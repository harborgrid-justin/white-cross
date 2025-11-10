/**
 * LOC: DOCPREP001
 * File: /reuse/document/composites/document-preparation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-templates-kit
 *   - ../document-forms-kit
 *   - ../document-forms-advanced-kit
 *   - ../document-assembly-kit
 *   - ../document-pdf-advanced-kit
 *
 * DOWNSTREAM (imported by):
 *   - Template creation services
 *   - Form builder modules
 *   - Document assembly engines
 *   - PDF generation services
 *   - Field placement tools
 *   - Healthcare document preparation dashboards
 */
/**
 * File: /reuse/document/composites/document-preparation-composite.ts
 * Locator: WC-DOC-PREPARATION-001
 * Purpose: Comprehensive Document Preparation Toolkit - Production-ready template creation and form design
 *
 * Upstream: Composed from document-templates-kit, document-forms-kit, document-forms-advanced-kit, document-assembly-kit, document-pdf-advanced-kit
 * Downstream: ../backend/*, Template services, Form builders, Document assembly, PDF generation, Field management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 48 utility functions for template creation, form design, field placement, document assembly, PDF generation
 *
 * LLM Context: Enterprise-grade document preparation toolkit for White Cross healthcare platform.
 * Provides comprehensive document preparation capabilities including template creation and management,
 * dynamic form field design, intelligent field positioning, document assembly from components, PDF
 * manipulation and generation, merge field handling, conditional content rendering, and HIPAA-compliant
 * document structure validation. Composes functions from multiple document kits to provide unified
 * preparation operations for patient forms, medical records templates, insurance claim forms, and
 * administrative healthcare documents.
 */
import { Model } from 'sequelize-typescript';
/**
 * Document template configuration
 */
export interface DocumentTemplate {
    id: string;
    name: string;
    description?: string;
    category: TemplateCategory;
    version: string;
    content: TemplateContent;
    mergeFields: MergeField[];
    conditionalSections: ConditionalSection[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}
/**
 * Template categories
 */
export declare enum TemplateCategory {
    PATIENT_FORMS = "PATIENT_FORMS",
    CONSENT_FORMS = "CONSENT_FORMS",
    MEDICAL_RECORDS = "MEDICAL_RECORDS",
    INSURANCE_CLAIMS = "INSURANCE_CLAIMS",
    PRESCRIPTIONS = "PRESCRIPTIONS",
    LAB_REPORTS = "LAB_REPORTS",
    DISCHARGE_SUMMARIES = "DISCHARGE_SUMMARIES",
    REFERRAL_LETTERS = "REFERRAL_LETTERS",
    ADMINISTRATIVE = "ADMINISTRATIVE",
    CUSTOM = "CUSTOM"
}
/**
 * Template content structure
 */
export interface TemplateContent {
    format: ContentFormat;
    body: string;
    styles?: Record<string, any>;
    layout: LayoutConfig;
    pages: TemplatePage[];
}
/**
 * Content formats
 */
export declare enum ContentFormat {
    HTML = "HTML",
    PDF = "PDF",
    DOCX = "DOCX",
    MARKDOWN = "MARKDOWN",
    PLAIN_TEXT = "PLAIN_TEXT"
}
/**
 * Layout configuration
 */
export interface LayoutConfig {
    pageSize: PageSize;
    orientation: PageOrientation;
    margins: PageMargins;
    header?: LayoutSection;
    footer?: LayoutSection;
    columns?: number;
}
/**
 * Page sizes
 */
export declare enum PageSize {
    LETTER = "LETTER",
    A4 = "A4",
    LEGAL = "LEGAL",
    EXECUTIVE = "EXECUTIVE",
    CUSTOM = "CUSTOM"
}
/**
 * Page orientations
 */
export declare enum PageOrientation {
    PORTRAIT = "PORTRAIT",
    LANDSCAPE = "LANDSCAPE"
}
/**
 * Page margins
 */
export interface PageMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
    unit: MeasurementUnit;
}
/**
 * Measurement units
 */
export declare enum MeasurementUnit {
    PIXELS = "PIXELS",
    POINTS = "POINTS",
    INCHES = "INCHES",
    MILLIMETERS = "MILLIMETERS"
}
/**
 * Layout section (header/footer)
 */
export interface LayoutSection {
    content: string;
    height: number;
    showOnFirstPage: boolean;
    showOnLastPage: boolean;
}
/**
 * Template page
 */
export interface TemplatePage {
    id: string;
    number: number;
    content: string;
    fields: FormField[];
    sections: PageSection[];
}
/**
 * Page section
 */
export interface PageSection {
    id: string;
    name: string;
    content: string;
    position: Position;
    dimensions: Dimensions;
    conditional?: ConditionalRule;
}
/**
 * Position coordinates
 */
export interface Position {
    x: number;
    y: number;
    unit: MeasurementUnit;
}
/**
 * Dimensions
 */
export interface Dimensions {
    width: number;
    height: number;
    unit: MeasurementUnit;
}
/**
 * Merge field definition
 */
export interface MergeField {
    id: string;
    name: string;
    label: string;
    type: MergeFieldType;
    defaultValue?: string;
    format?: FieldFormat;
    validation?: FieldValidation;
    required: boolean;
    metadata?: Record<string, any>;
}
/**
 * Merge field types
 */
export declare enum MergeFieldType {
    TEXT = "TEXT",
    NUMBER = "NUMBER",
    DATE = "DATE",
    BOOLEAN = "BOOLEAN",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    ADDRESS = "ADDRESS",
    CURRENCY = "CURRENCY",
    PERCENTAGE = "PERCENTAGE",
    LIST = "LIST",
    OBJECT = "OBJECT"
}
/**
 * Field format configuration
 */
export interface FieldFormat {
    pattern?: string;
    dateFormat?: string;
    numberFormat?: NumberFormat;
    textTransform?: TextTransform;
}
/**
 * Number format
 */
export interface NumberFormat {
    decimals: number;
    thousandsSeparator: string;
    decimalSeparator: string;
    prefix?: string;
    suffix?: string;
}
/**
 * Text transformations
 */
export declare enum TextTransform {
    UPPERCASE = "UPPERCASE",
    LOWERCASE = "LOWERCASE",
    CAPITALIZE = "CAPITALIZE",
    TITLE_CASE = "TITLE_CASE",
    NONE = "NONE"
}
/**
 * Field validation rules
 */
export interface FieldValidation {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    customValidator?: string;
    errorMessage?: string;
}
/**
 * Conditional section definition
 */
export interface ConditionalSection {
    id: string;
    sectionId: string;
    condition: ConditionalRule;
    content: string;
    alternateContent?: string;
}
/**
 * Conditional rule
 */
export interface ConditionalRule {
    field: string;
    operator: ConditionalOperator;
    value: any;
    logicalOperator?: LogicalOperator;
    nestedRules?: ConditionalRule[];
}
/**
 * Conditional operators
 */
export declare enum ConditionalOperator {
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    GREATER_THAN = "GREATER_THAN",
    LESS_THAN = "LESS_THAN",
    GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
    LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
    CONTAINS = "CONTAINS",
    NOT_CONTAINS = "NOT_CONTAINS",
    STARTS_WITH = "STARTS_WITH",
    ENDS_WITH = "ENDS_WITH",
    IS_EMPTY = "IS_EMPTY",
    IS_NOT_EMPTY = "IS_NOT_EMPTY"
}
/**
 * Logical operators for combining rules
 */
export declare enum LogicalOperator {
    AND = "AND",
    OR = "OR",
    NOT = "NOT"
}
/**
 * Form field definition
 */
export interface FormField {
    id: string;
    name: string;
    label: string;
    type: FormFieldType;
    position: Position;
    dimensions: Dimensions;
    value?: any;
    placeholder?: string;
    helpText?: string;
    validation?: FieldValidation;
    required: boolean;
    readOnly: boolean;
    options?: FieldOption[];
    conditional?: ConditionalRule;
    metadata?: Record<string, any>;
}
/**
 * Form field types
 */
export declare enum FormFieldType {
    TEXT_INPUT = "TEXT_INPUT",
    TEXT_AREA = "TEXT_AREA",
    NUMBER_INPUT = "NUMBER_INPUT",
    DATE_PICKER = "DATE_PICKER",
    TIME_PICKER = "TIME_PICKER",
    DATETIME_PICKER = "DATETIME_PICKER",
    CHECKBOX = "CHECKBOX",
    RADIO_GROUP = "RADIO_GROUP",
    DROPDOWN = "DROPDOWN",
    MULTI_SELECT = "MULTI_SELECT",
    FILE_UPLOAD = "FILE_UPLOAD",
    SIGNATURE = "SIGNATURE",
    INITIAL = "INITIAL",
    EMAIL_INPUT = "EMAIL_INPUT",
    PHONE_INPUT = "PHONE_INPUT",
    ADDRESS_INPUT = "ADDRESS_INPUT",
    CUSTOM = "CUSTOM"
}
/**
 * Field option for select/radio fields
 */
export interface FieldOption {
    value: string;
    label: string;
    selected?: boolean;
    metadata?: Record<string, any>;
}
/**
 * Document assembly configuration
 */
export interface DocumentAssemblyConfig {
    id: string;
    name: string;
    components: AssemblyComponent[];
    assemblyOrder: string[];
    mergeData: Record<string, any>;
    outputFormat: ContentFormat;
    metadata?: Record<string, any>;
}
/**
 * Assembly component
 */
export interface AssemblyComponent {
    id: string;
    type: ComponentType;
    templateId?: string;
    content?: string;
    position: number;
    conditional?: ConditionalRule;
    metadata?: Record<string, any>;
}
/**
 * Component types
 */
export declare enum ComponentType {
    TEMPLATE = "TEMPLATE",
    STATIC_CONTENT = "STATIC_CONTENT",
    DYNAMIC_CONTENT = "DYNAMIC_CONTENT",
    PAGE_BREAK = "PAGE_BREAK",
    TABLE = "TABLE",
    IMAGE = "IMAGE",
    CHART = "CHART"
}
/**
 * PDF generation options
 */
export interface PDFGenerationOptions {
    pageSize: PageSize;
    orientation: PageOrientation;
    margins: PageMargins;
    embedFonts: boolean;
    compress: boolean;
    encryption?: PDFEncryption;
    watermark?: Watermark;
    metadata: PDFMetadata;
}
/**
 * PDF encryption settings
 */
export interface PDFEncryption {
    userPassword?: string;
    ownerPassword?: string;
    permissions: PDFPermissions;
}
/**
 * PDF permissions
 */
export interface PDFPermissions {
    printing: boolean;
    modifying: boolean;
    copying: boolean;
    annotating: boolean;
    fillingForms: boolean;
    contentAccessibility: boolean;
    documentAssembly: boolean;
}
/**
 * Watermark configuration
 */
export interface Watermark {
    text: string;
    opacity: number;
    rotation: number;
    fontSize: number;
    color: string;
    position: WatermarkPosition;
}
/**
 * Watermark positions
 */
export declare enum WatermarkPosition {
    CENTER = "CENTER",
    TOP_LEFT = "TOP_LEFT",
    TOP_RIGHT = "TOP_RIGHT",
    BOTTOM_LEFT = "BOTTOM_LEFT",
    BOTTOM_RIGHT = "BOTTOM_RIGHT",
    DIAGONAL = "DIAGONAL"
}
/**
 * PDF metadata
 */
export interface PDFMetadata {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
    creator?: string;
    producer?: string;
}
/**
 * Document Template Model
 * Stores document template configurations
 */
export declare class DocumentTemplateModel extends Model {
    id: string;
    name: string;
    description?: string;
    category: TemplateCategory;
    version: string;
    content: TemplateContent;
    mergeFields: MergeField[];
    conditionalSections: ConditionalSection[];
    metadata?: Record<string, any>;
    isActive: boolean;
}
/**
 * Form Field Configuration Model
 * Stores form field definitions
 */
export declare class FormFieldConfigModel extends Model {
    id: string;
    name: string;
    label: string;
    type: FormFieldType;
    position: Position;
    dimensions: Dimensions;
    placeholder?: string;
    helpText?: string;
    validation?: FieldValidation;
    required: boolean;
    readOnly: boolean;
    options?: FieldOption[];
    conditional?: ConditionalRule;
    metadata?: Record<string, any>;
}
/**
 * Document Assembly Configuration Model
 * Stores document assembly configurations
 */
export declare class DocumentAssemblyConfigModel extends Model {
    id: string;
    name: string;
    components: AssemblyComponent[];
    assemblyOrder: string[];
    mergeData: Record<string, any>;
    outputFormat: ContentFormat;
    metadata?: Record<string, any>;
}
/**
 * Creates a new document template.
 *
 * @param {string} name - Template name
 * @param {TemplateCategory} category - Template category
 * @param {TemplateContent} content - Template content
 * @param {Partial<DocumentTemplate>} options - Additional options
 * @returns {DocumentTemplate} Created template
 *
 * @example
 * ```typescript
 * const template = createDocumentTemplate('Patient Intake Form', TemplateCategory.PATIENT_FORMS, content);
 * ```
 */
export declare const createDocumentTemplate: (name: string, category: TemplateCategory, content: TemplateContent, options?: Partial<DocumentTemplate>) => DocumentTemplate;
/**
 * Clones an existing template with a new name.
 *
 * @param {DocumentTemplate} template - Template to clone
 * @param {string} newName - New template name
 * @returns {DocumentTemplate} Cloned template
 *
 * @example
 * ```typescript
 * const cloned = cloneTemplate(originalTemplate, 'New Patient Form V2');
 * ```
 */
export declare const cloneTemplate: (template: DocumentTemplate, newName: string) => DocumentTemplate;
/**
 * Updates template version.
 *
 * @param {DocumentTemplate} template - Template to update
 * @param {string} newVersion - New version number
 * @returns {DocumentTemplate} Updated template
 *
 * @example
 * ```typescript
 * const updated = updateTemplateVersion(template, '2.0.0');
 * ```
 */
export declare const updateTemplateVersion: (template: DocumentTemplate, newVersion: string) => DocumentTemplate;
/**
 * Adds a merge field to template.
 *
 * @param {DocumentTemplate} template - Template to update
 * @param {MergeField} mergeField - Merge field to add
 * @returns {DocumentTemplate} Updated template
 *
 * @example
 * ```typescript
 * const updated = addMergeFieldToTemplate(template, patientNameField);
 * ```
 */
export declare const addMergeFieldToTemplate: (template: DocumentTemplate, mergeField: MergeField) => DocumentTemplate;
/**
 * Removes a merge field from template.
 *
 * @param {DocumentTemplate} template - Template to update
 * @param {string} fieldId - Field ID to remove
 * @returns {DocumentTemplate} Updated template
 *
 * @example
 * ```typescript
 * const updated = removeMergeFieldFromTemplate(template, 'field123');
 * ```
 */
export declare const removeMergeFieldFromTemplate: (template: DocumentTemplate, fieldId: string) => DocumentTemplate;
/**
 * Creates a merge field definition.
 *
 * @param {string} name - Field name
 * @param {string} label - Field label
 * @param {MergeFieldType} type - Field type
 * @param {Partial<MergeField>} options - Additional options
 * @returns {MergeField} Merge field
 *
 * @example
 * ```typescript
 * const field = createMergeField('patient_name', 'Patient Name', MergeFieldType.TEXT, {required: true});
 * ```
 */
export declare const createMergeField: (name: string, label: string, type: MergeFieldType, options?: Partial<MergeField>) => MergeField;
/**
 * Validates merge field value against validation rules.
 *
 * @param {any} value - Value to validate
 * @param {MergeField} field - Merge field with validation rules
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateMergeFieldValue('test@example.com', emailField);
 * ```
 */
export declare const validateMergeFieldValue: (value: any, field: MergeField) => string[];
/**
 * Merges data into template.
 *
 * @param {DocumentTemplate} template - Template to merge
 * @param {Record<string, any>} data - Data to merge
 * @returns {string} Merged content
 *
 * @example
 * ```typescript
 * const merged = mergeTemplateData(template, {patient_name: 'John Doe', date: '2025-01-01'});
 * ```
 */
export declare const mergeTemplateData: (template: DocumentTemplate, data: Record<string, any>) => string;
/**
 * Formats merge field value according to field format.
 *
 * @param {any} value - Value to format
 * @param {MergeField} field - Merge field with format rules
 * @returns {string} Formatted value
 *
 * @example
 * ```typescript
 * const formatted = formatMergeFieldValue(1234.56, currencyField);
 * ```
 */
export declare const formatMergeFieldValue: (value: any, field: MergeField) => string;
/**
 * Formats a date according to format string.
 *
 * @param {Date} date - Date to format
 * @param {string} formatString - Format string (e.g., 'YYYY-MM-DD')
 * @returns {string} Formatted date
 *
 * @example
 * ```typescript
 * const formatted = formatDate(new Date(), 'MM/DD/YYYY');
 * ```
 */
export declare const formatDate: (date: Date, formatString: string) => string;
/**
 * Formats a number according to number format configuration.
 *
 * @param {number} value - Number to format
 * @param {NumberFormat} format - Number format configuration
 * @returns {string} Formatted number
 *
 * @example
 * ```typescript
 * const formatted = formatNumber(1234.56, {decimals: 2, thousandsSeparator: ',', decimalSeparator: '.'});
 * ```
 */
export declare const formatNumber: (value: number, format: NumberFormat) => string;
/**
 * Applies text transformation to string.
 *
 * @param {string} text - Text to transform
 * @param {TextTransform} transform - Transformation type
 * @returns {string} Transformed text
 *
 * @example
 * ```typescript
 * const transformed = applyTextTransform('hello world', TextTransform.TITLE_CASE);
 * ```
 */
export declare const applyTextTransform: (text: string, transform: TextTransform) => string;
/**
 * Creates a form field definition.
 *
 * @param {string} name - Field name
 * @param {string} label - Field label
 * @param {FormFieldType} type - Field type
 * @param {Position} position - Field position
 * @param {Partial<FormField>} options - Additional options
 * @returns {FormField} Form field
 *
 * @example
 * ```typescript
 * const field = createFormField('email', 'Email Address', FormFieldType.EMAIL_INPUT, {x: 100, y: 200, unit: MeasurementUnit.PIXELS});
 * ```
 */
export declare const createFormField: (name: string, label: string, type: FormFieldType, position: Position, options?: Partial<FormField>) => FormField;
/**
 * Validates form field placement on page.
 *
 * @param {FormField} field - Form field
 * @param {Dimensions} pageSize - Page dimensions
 * @returns {boolean} True if placement is valid
 *
 * @example
 * ```typescript
 * const isValid = validateFormFieldPlacement(field, {width: 612, height: 792, unit: MeasurementUnit.POINTS});
 * ```
 */
export declare const validateFormFieldPlacement: (field: FormField, pageSize: Dimensions) => boolean;
/**
 * Adds a field option to select/radio field.
 *
 * @param {FormField} field - Form field
 * @param {FieldOption} option - Field option to add
 * @returns {FormField} Updated field
 *
 * @example
 * ```typescript
 * const updated = addFieldOption(dropdownField, {value: 'option1', label: 'Option 1'});
 * ```
 */
export declare const addFieldOption: (field: FormField, option: FieldOption) => FormField;
/**
 * Creates a conditional rule for dynamic content.
 *
 * @param {string} field - Field name to evaluate
 * @param {ConditionalOperator} operator - Comparison operator
 * @param {any} value - Value to compare against
 * @param {Partial<ConditionalRule>} options - Additional options
 * @returns {ConditionalRule} Conditional rule
 *
 * @example
 * ```typescript
 * const rule = createConditionalRule('age', ConditionalOperator.GREATER_THAN, 18);
 * ```
 */
export declare const createConditionalRule: (field: string, operator: ConditionalOperator, value: any, options?: Partial<ConditionalRule>) => ConditionalRule;
/**
 * Evaluates a conditional rule against data.
 *
 * @param {ConditionalRule} rule - Conditional rule
 * @param {Record<string, any>} data - Data to evaluate
 * @returns {boolean} True if condition is met
 *
 * @example
 * ```typescript
 * const result = evaluateConditionalRule(rule, {age: 25, name: 'John'});
 * ```
 */
export declare const evaluateConditionalRule: (rule: ConditionalRule, data: Record<string, any>) => boolean;
/**
 * Creates a conditional section for template.
 *
 * @param {string} sectionId - Section identifier
 * @param {ConditionalRule} condition - Conditional rule
 * @param {string} content - Content to show if condition is true
 * @param {string} alternateContent - Content to show if condition is false
 * @returns {ConditionalSection} Conditional section
 *
 * @example
 * ```typescript
 * const section = createConditionalSection('adult_section', ageRule, adultContent, minorContent);
 * ```
 */
export declare const createConditionalSection: (sectionId: string, condition: ConditionalRule, content: string, alternateContent?: string) => ConditionalSection;
/**
 * Renders conditional sections based on data.
 *
 * @param {ConditionalSection[]} sections - Conditional sections
 * @param {Record<string, any>} data - Data to evaluate
 * @returns {Record<string, string>} Rendered sections
 *
 * @example
 * ```typescript
 * const rendered = renderConditionalSections(sections, formData);
 * ```
 */
export declare const renderConditionalSections: (sections: ConditionalSection[], data: Record<string, any>) => Record<string, string>;
/**
 * Creates a document assembly configuration.
 *
 * @param {string} name - Assembly configuration name
 * @param {AssemblyComponent[]} components - Assembly components
 * @param {ContentFormat} outputFormat - Output format
 * @param {Partial<DocumentAssemblyConfig>} options - Additional options
 * @returns {DocumentAssemblyConfig} Assembly configuration
 *
 * @example
 * ```typescript
 * const config = createDocumentAssembly('Patient Discharge Summary', components, ContentFormat.PDF);
 * ```
 */
export declare const createDocumentAssembly: (name: string, components: AssemblyComponent[], outputFormat: ContentFormat, options?: Partial<DocumentAssemblyConfig>) => DocumentAssemblyConfig;
/**
 * Adds a component to document assembly.
 *
 * @param {DocumentAssemblyConfig} assembly - Assembly configuration
 * @param {AssemblyComponent} component - Component to add
 * @returns {DocumentAssemblyConfig} Updated assembly
 *
 * @example
 * ```typescript
 * const updated = addComponentToAssembly(assembly, headerComponent);
 * ```
 */
export declare const addComponentToAssembly: (assembly: DocumentAssemblyConfig, component: AssemblyComponent) => DocumentAssemblyConfig;
/**
 * Assembles document from components.
 *
 * @param {DocumentAssemblyConfig} config - Assembly configuration
 * @returns {string} Assembled document content
 *
 * @example
 * ```typescript
 * const document = assembleDocument(assemblyConfig);
 * ```
 */
export declare const assembleDocument: (config: DocumentAssemblyConfig) => string;
/**
 * Creates a layout configuration.
 *
 * @param {PageSize} pageSize - Page size
 * @param {PageOrientation} orientation - Page orientation
 * @param {PageMargins} margins - Page margins
 * @param {Partial<LayoutConfig>} options - Additional options
 * @returns {LayoutConfig} Layout configuration
 *
 * @example
 * ```typescript
 * const layout = createLayoutConfig(PageSize.LETTER, PageOrientation.PORTRAIT, standardMargins);
 * ```
 */
export declare const createLayoutConfig: (pageSize: PageSize, orientation: PageOrientation, margins: PageMargins, options?: Partial<LayoutConfig>) => LayoutConfig;
/**
 * Calculates page dimensions for standard page sizes.
 *
 * @param {PageSize} pageSize - Page size
 * @param {PageOrientation} orientation - Page orientation
 * @returns {Dimensions} Page dimensions in points
 *
 * @example
 * ```typescript
 * const dimensions = calculatePageDimensions(PageSize.LETTER, PageOrientation.PORTRAIT);
 * ```
 */
export declare const calculatePageDimensions: (pageSize: PageSize, orientation: PageOrientation) => Dimensions;
/**
 * Creates PDF generation options.
 *
 * @param {Partial<PDFGenerationOptions>} options - PDF options
 * @returns {PDFGenerationOptions} PDF generation options
 *
 * @example
 * ```typescript
 * const pdfOptions = createPDFOptions({pageSize: PageSize.A4, compress: true});
 * ```
 */
export declare const createPDFOptions: (options?: Partial<PDFGenerationOptions>) => PDFGenerationOptions;
/**
 * Creates a watermark configuration.
 *
 * @param {string} text - Watermark text
 * @param {Partial<Watermark>} options - Watermark options
 * @returns {Watermark} Watermark configuration
 *
 * @example
 * ```typescript
 * const watermark = createWatermark('CONFIDENTIAL', {opacity: 0.3, rotation: 45});
 * ```
 */
export declare const createWatermark: (text: string, options?: Partial<Watermark>) => Watermark;
/**
 * Creates PDF encryption settings.
 *
 * @param {Partial<PDFEncryption>} options - Encryption options
 * @returns {PDFEncryption} Encryption settings
 *
 * @example
 * ```typescript
 * const encryption = createPDFEncryption({userPassword: 'user123', ownerPassword: 'owner456'});
 * ```
 */
export declare const createPDFEncryption: (options?: Partial<PDFEncryption>) => PDFEncryption;
/**
 * Validates template structure and integrity.
 *
 * @param {DocumentTemplate} template - Template to validate
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateTemplateStructure(template);
 * ```
 */
export declare const validateTemplateStructure: (template: DocumentTemplate) => string[];
/**
 * Exports template to JSON format.
 *
 * @param {DocumentTemplate} template - Template to export
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = exportTemplateToJSON(template);
 * ```
 */
export declare const exportTemplateToJSON: (template: DocumentTemplate) => string;
/**
 * Imports template from JSON format.
 *
 * @param {string} json - JSON string
 * @returns {DocumentTemplate} Imported template
 *
 * @example
 * ```typescript
 * const template = importTemplateFromJSON(jsonString);
 * ```
 */
export declare const importTemplateFromJSON: (json: string) => DocumentTemplate;
/**
 * Generates a field name from label.
 *
 * @param {string} label - Field label
 * @returns {string} Generated field name
 *
 * @example
 * ```typescript
 * const name = generateFieldName('Patient Name'); // Returns 'patient_name'
 * ```
 */
export declare const generateFieldName: (label: string) => string;
/**
 * Converts measurement units.
 *
 * @param {number} value - Value to convert
 * @param {MeasurementUnit} fromUnit - Source unit
 * @param {MeasurementUnit} toUnit - Target unit
 * @returns {number} Converted value
 *
 * @example
 * ```typescript
 * const inches = convertMeasurementUnit(72, MeasurementUnit.POINTS, MeasurementUnit.INCHES);
 * ```
 */
export declare const convertMeasurementUnit: (value: number, fromUnit: MeasurementUnit, toUnit: MeasurementUnit) => number;
/**
 * Calculates optimal field positions for form layout.
 *
 * @param {FormField[]} fields - Form fields to position
 * @param {LayoutConfig} layout - Layout configuration
 * @returns {FormField[]} Fields with calculated positions
 *
 * @example
 * ```typescript
 * const positioned = calculateOptimalFieldPositions(fields, layout);
 * ```
 */
export declare const calculateOptimalFieldPositions: (fields: FormField[], layout: LayoutConfig) => FormField[];
/**
 * Groups form fields by section.
 *
 * @param {FormField[]} fields - Form fields
 * @param {string} sectionField - Field name containing section identifier
 * @returns {Map<string, FormField[]>} Grouped fields
 *
 * @example
 * ```typescript
 * const grouped = groupFieldsBySection(fields, 'section');
 * ```
 */
export declare const groupFieldsBySection: (fields: FormField[], sectionField?: string) => Map<string, FormField[]>;
/**
 * Generates template preview HTML.
 *
 * @param {DocumentTemplate} template - Template to preview
 * @param {Record<string, any>} sampleData - Sample data for preview
 * @returns {string} Preview HTML
 *
 * @example
 * ```typescript
 * const html = generateTemplatePreview(template, sampleData);
 * ```
 */
export declare const generateTemplatePreview: (template: DocumentTemplate, sampleData: Record<string, any>) => string;
/**
 * Document Preparation Service
 * Production-ready NestJS service for document preparation operations
 */
export declare class DocumentPreparationService {
    /**
     * Creates and validates a new template
     */
    createTemplate(name: string, category: TemplateCategory, content: TemplateContent): Promise<DocumentTemplate>;
    /**
     * Merges data into template and generates document
     */
    generateDocument(templateId: string, data: Record<string, any>): Promise<string>;
}
declare const _default: {
    DocumentTemplateModel: typeof DocumentTemplateModel;
    FormFieldConfigModel: typeof FormFieldConfigModel;
    DocumentAssemblyConfigModel: typeof DocumentAssemblyConfigModel;
    createDocumentTemplate: (name: string, category: TemplateCategory, content: TemplateContent, options?: Partial<DocumentTemplate>) => DocumentTemplate;
    cloneTemplate: (template: DocumentTemplate, newName: string) => DocumentTemplate;
    updateTemplateVersion: (template: DocumentTemplate, newVersion: string) => DocumentTemplate;
    addMergeFieldToTemplate: (template: DocumentTemplate, mergeField: MergeField) => DocumentTemplate;
    removeMergeFieldFromTemplate: (template: DocumentTemplate, fieldId: string) => DocumentTemplate;
    createMergeField: (name: string, label: string, type: MergeFieldType, options?: Partial<MergeField>) => MergeField;
    validateMergeFieldValue: (value: any, field: MergeField) => string[];
    mergeTemplateData: (template: DocumentTemplate, data: Record<string, any>) => string;
    formatMergeFieldValue: (value: any, field: MergeField) => string;
    formatDate: (date: Date, formatString: string) => string;
    formatNumber: (value: number, format: NumberFormat) => string;
    applyTextTransform: (text: string, transform: TextTransform) => string;
    createFormField: (name: string, label: string, type: FormFieldType, position: Position, options?: Partial<FormField>) => FormField;
    validateFormFieldPlacement: (field: FormField, pageSize: Dimensions) => boolean;
    addFieldOption: (field: FormField, option: FieldOption) => FormField;
    createConditionalRule: (field: string, operator: ConditionalOperator, value: any, options?: Partial<ConditionalRule>) => ConditionalRule;
    evaluateConditionalRule: (rule: ConditionalRule, data: Record<string, any>) => boolean;
    createConditionalSection: (sectionId: string, condition: ConditionalRule, content: string, alternateContent?: string) => ConditionalSection;
    renderConditionalSections: (sections: ConditionalSection[], data: Record<string, any>) => Record<string, string>;
    createDocumentAssembly: (name: string, components: AssemblyComponent[], outputFormat: ContentFormat, options?: Partial<DocumentAssemblyConfig>) => DocumentAssemblyConfig;
    addComponentToAssembly: (assembly: DocumentAssemblyConfig, component: AssemblyComponent) => DocumentAssemblyConfig;
    assembleDocument: (config: DocumentAssemblyConfig) => string;
    createLayoutConfig: (pageSize: PageSize, orientation: PageOrientation, margins: PageMargins, options?: Partial<LayoutConfig>) => LayoutConfig;
    calculatePageDimensions: (pageSize: PageSize, orientation: PageOrientation) => Dimensions;
    createPDFOptions: (options?: Partial<PDFGenerationOptions>) => PDFGenerationOptions;
    createWatermark: (text: string, options?: Partial<Watermark>) => Watermark;
    createPDFEncryption: (options?: Partial<PDFEncryption>) => PDFEncryption;
    validateTemplateStructure: (template: DocumentTemplate) => string[];
    exportTemplateToJSON: (template: DocumentTemplate) => string;
    importTemplateFromJSON: (json: string) => DocumentTemplate;
    generateFieldName: (label: string) => string;
    convertMeasurementUnit: (value: number, fromUnit: MeasurementUnit, toUnit: MeasurementUnit) => number;
    calculateOptimalFieldPositions: (fields: FormField[], layout: LayoutConfig) => FormField[];
    groupFieldsBySection: (fields: FormField[], sectionField?: string) => Map<string, FormField[]>;
    generateTemplatePreview: (template: DocumentTemplate, sampleData: Record<string, any>) => string;
    DocumentPreparationService: typeof DocumentPreparationService;
};
export default _default;
//# sourceMappingURL=document-preparation-composite.d.ts.map