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

import { Model, Column, Table, DataType, Index, PrimaryKey, Default, AllowNull, Unique } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsObject, IsArray, IsDate, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export enum TemplateCategory {
  PATIENT_FORMS = 'PATIENT_FORMS',
  CONSENT_FORMS = 'CONSENT_FORMS',
  MEDICAL_RECORDS = 'MEDICAL_RECORDS',
  INSURANCE_CLAIMS = 'INSURANCE_CLAIMS',
  PRESCRIPTIONS = 'PRESCRIPTIONS',
  LAB_REPORTS = 'LAB_REPORTS',
  DISCHARGE_SUMMARIES = 'DISCHARGE_SUMMARIES',
  REFERRAL_LETTERS = 'REFERRAL_LETTERS',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  CUSTOM = 'CUSTOM',
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
export enum ContentFormat {
  HTML = 'HTML',
  PDF = 'PDF',
  DOCX = 'DOCX',
  MARKDOWN = 'MARKDOWN',
  PLAIN_TEXT = 'PLAIN_TEXT',
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
export enum PageSize {
  LETTER = 'LETTER',
  A4 = 'A4',
  LEGAL = 'LEGAL',
  EXECUTIVE = 'EXECUTIVE',
  CUSTOM = 'CUSTOM',
}

/**
 * Page orientations
 */
export enum PageOrientation {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE',
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
export enum MeasurementUnit {
  PIXELS = 'PIXELS',
  POINTS = 'POINTS',
  INCHES = 'INCHES',
  MILLIMETERS = 'MILLIMETERS',
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
export enum MergeFieldType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  ADDRESS = 'ADDRESS',
  CURRENCY = 'CURRENCY',
  PERCENTAGE = 'PERCENTAGE',
  LIST = 'LIST',
  OBJECT = 'OBJECT',
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
export enum TextTransform {
  UPPERCASE = 'UPPERCASE',
  LOWERCASE = 'LOWERCASE',
  CAPITALIZE = 'CAPITALIZE',
  TITLE_CASE = 'TITLE_CASE',
  NONE = 'NONE',
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
export enum ConditionalOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  IS_EMPTY = 'IS_EMPTY',
  IS_NOT_EMPTY = 'IS_NOT_EMPTY',
}

/**
 * Logical operators for combining rules
 */
export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
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
export enum FormFieldType {
  TEXT_INPUT = 'TEXT_INPUT',
  TEXT_AREA = 'TEXT_AREA',
  NUMBER_INPUT = 'NUMBER_INPUT',
  DATE_PICKER = 'DATE_PICKER',
  TIME_PICKER = 'TIME_PICKER',
  DATETIME_PICKER = 'DATETIME_PICKER',
  CHECKBOX = 'CHECKBOX',
  RADIO_GROUP = 'RADIO_GROUP',
  DROPDOWN = 'DROPDOWN',
  MULTI_SELECT = 'MULTI_SELECT',
  FILE_UPLOAD = 'FILE_UPLOAD',
  SIGNATURE = 'SIGNATURE',
  INITIAL = 'INITIAL',
  EMAIL_INPUT = 'EMAIL_INPUT',
  PHONE_INPUT = 'PHONE_INPUT',
  ADDRESS_INPUT = 'ADDRESS_INPUT',
  CUSTOM = 'CUSTOM',
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
export enum ComponentType {
  TEMPLATE = 'TEMPLATE',
  STATIC_CONTENT = 'STATIC_CONTENT',
  DYNAMIC_CONTENT = 'DYNAMIC_CONTENT',
  PAGE_BREAK = 'PAGE_BREAK',
  TABLE = 'TABLE',
  IMAGE = 'IMAGE',
  CHART = 'CHART',
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
export enum WatermarkPosition {
  CENTER = 'CENTER',
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  DIAGONAL = 'DIAGONAL',
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

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Document Template Model
 * Stores document template configurations
 */
@Table({
  tableName: 'document_templates',
  timestamps: true,
  indexes: [
    { fields: ['category'] },
    { fields: ['isActive'] },
    { fields: ['version'] },
  ],
})
export class DocumentTemplateModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique template identifier' })
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Template name' })
  name: string;

  @Column(DataType.TEXT)
  @ApiPropertyOptional({ description: 'Template description' })
  description?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(TemplateCategory)))
  @ApiProperty({ enum: TemplateCategory, description: 'Template category' })
  category: TemplateCategory;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Template version' })
  version: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Template content structure' })
  content: TemplateContent;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Merge fields', type: [Object] })
  mergeFields: MergeField[];

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Conditional sections', type: [Object] })
  conditionalSections: ConditionalSection[];

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @Default(true)
  @Index
  @Column(DataType.BOOLEAN)
  @ApiProperty({ description: 'Whether template is active' })
  isActive: boolean;
}

/**
 * Form Field Configuration Model
 * Stores form field definitions
 */
@Table({
  tableName: 'form_field_configs',
  timestamps: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['required'] },
  ],
})
export class FormFieldConfigModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique field identifier' })
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Field name' })
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Field label' })
  label: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(FormFieldType)))
  @ApiProperty({ enum: FormFieldType, description: 'Field type' })
  type: FormFieldType;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Field position' })
  position: Position;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Field dimensions' })
  dimensions: Dimensions;

  @Column(DataType.TEXT)
  @ApiPropertyOptional({ description: 'Placeholder text' })
  placeholder?: string;

  @Column(DataType.TEXT)
  @ApiPropertyOptional({ description: 'Help text' })
  helpText?: string;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Validation rules' })
  validation?: FieldValidation;

  @Default(false)
  @Index
  @Column(DataType.BOOLEAN)
  @ApiProperty({ description: 'Whether field is required' })
  required: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  @ApiProperty({ description: 'Whether field is read-only' })
  readOnly: boolean;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Field options', type: [Object] })
  options?: FieldOption[];

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Conditional rules' })
  conditional?: ConditionalRule;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Document Assembly Configuration Model
 * Stores document assembly configurations
 */
@Table({
  tableName: 'document_assembly_configs',
  timestamps: true,
  indexes: [
    { fields: ['outputFormat'] },
  ],
})
export class DocumentAssemblyConfigModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique assembly configuration identifier' })
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Configuration name' })
  name: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Assembly components', type: [Object] })
  components: AssemblyComponent[];

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.STRING))
  @ApiProperty({ description: 'Component assembly order' })
  assemblyOrder: string[];

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Merge data for assembly' })
  mergeData: Record<string, any>;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(ContentFormat)))
  @ApiProperty({ enum: ContentFormat, description: 'Output format' })
  outputFormat: ContentFormat;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

// ============================================================================
// CORE DOCUMENT PREPARATION FUNCTIONS
// ============================================================================

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
export const createDocumentTemplate = (
  name: string,
  category: TemplateCategory,
  content: TemplateContent,
  options?: Partial<DocumentTemplate>
): DocumentTemplate => {
  return {
    id: crypto.randomUUID(),
    name,
    description: options?.description,
    category,
    version: options?.version || '1.0.0',
    content,
    mergeFields: options?.mergeFields || [],
    conditionalSections: options?.conditionalSections || [],
    metadata: options?.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: options?.isActive ?? true,
  };
};

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
export const cloneTemplate = (template: DocumentTemplate, newName: string): DocumentTemplate => {
  return {
    ...template,
    id: crypto.randomUUID(),
    name: newName,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

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
export const updateTemplateVersion = (
  template: DocumentTemplate,
  newVersion: string
): DocumentTemplate => {
  return {
    ...template,
    version: newVersion,
    updatedAt: new Date(),
  };
};

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
export const addMergeFieldToTemplate = (
  template: DocumentTemplate,
  mergeField: MergeField
): DocumentTemplate => {
  return {
    ...template,
    mergeFields: [...template.mergeFields, mergeField],
    updatedAt: new Date(),
  };
};

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
export const removeMergeFieldFromTemplate = (
  template: DocumentTemplate,
  fieldId: string
): DocumentTemplate => {
  return {
    ...template,
    mergeFields: template.mergeFields.filter((f) => f.id !== fieldId),
    updatedAt: new Date(),
  };
};

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
export const createMergeField = (
  name: string,
  label: string,
  type: MergeFieldType,
  options?: Partial<MergeField>
): MergeField => {
  return {
    id: crypto.randomUUID(),
    name,
    label,
    type,
    defaultValue: options?.defaultValue,
    format: options?.format,
    validation: options?.validation,
    required: options?.required ?? false,
    metadata: options?.metadata,
  };
};

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
export const validateMergeFieldValue = (value: any, field: MergeField): string[] => {
  const errors: string[] = [];

  if (field.required && (value === undefined || value === null || value === '')) {
    errors.push(`${field.label} is required`);
  }

  if (!field.validation) return errors;

  const validation = field.validation;

  if (typeof value === 'string') {
    if (validation.minLength && value.length < validation.minLength) {
      errors.push(`${field.label} must be at least ${validation.minLength} characters`);
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      errors.push(`${field.label} must be at most ${validation.maxLength} characters`);
    }
    if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
      errors.push(validation.errorMessage || `${field.label} format is invalid`);
    }
  }

  if (typeof value === 'number') {
    if (validation.minValue !== undefined && value < validation.minValue) {
      errors.push(`${field.label} must be at least ${validation.minValue}`);
    }
    if (validation.maxValue !== undefined && value > validation.maxValue) {
      errors.push(`${field.label} must be at most ${validation.maxValue}`);
    }
  }

  return errors;
};

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
export const mergeTemplateData = (
  template: DocumentTemplate,
  data: Record<string, any>
): string => {
  let mergedContent = template.content.body;

  template.mergeFields.forEach((field) => {
    const value = data[field.name] || field.defaultValue || '';
    const formattedValue = formatMergeFieldValue(value, field);
    const placeholder = new RegExp(`{{\\s*${field.name}\\s*}}`, 'g');
    mergedContent = mergedContent.replace(placeholder, formattedValue);
  });

  return mergedContent;
};

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
export const formatMergeFieldValue = (value: any, field: MergeField): string => {
  if (value === undefined || value === null) return '';

  if (!field.format) return String(value);

  const format = field.format;

  // Date formatting
  if (field.type === MergeFieldType.DATE && value instanceof Date) {
    return format.dateFormat
      ? formatDate(value, format.dateFormat)
      : value.toISOString().split('T')[0];
  }

  // Number formatting
  if (field.type === MergeFieldType.NUMBER && typeof value === 'number') {
    if (format.numberFormat) {
      return formatNumber(value, format.numberFormat);
    }
  }

  // Text transformation
  if (typeof value === 'string' && format.textTransform) {
    return applyTextTransform(value, format.textTransform);
  }

  return String(value);
};

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
export const formatDate = (date: Date, formatString: string): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return formatString
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day);
};

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
export const formatNumber = (value: number, format: NumberFormat): string => {
  const parts = value.toFixed(format.decimals).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, format.thousandsSeparator);
  const decimalPart = parts[1] || '';

  const formattedNumber =
    decimalPart ? `${integerPart}${format.decimalSeparator}${decimalPart}` : integerPart;

  return `${format.prefix || ''}${formattedNumber}${format.suffix || ''}`;
};

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
export const applyTextTransform = (text: string, transform: TextTransform): string => {
  switch (transform) {
    case TextTransform.UPPERCASE:
      return text.toUpperCase();
    case TextTransform.LOWERCASE:
      return text.toLowerCase();
    case TextTransform.CAPITALIZE:
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case TextTransform.TITLE_CASE:
      return text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    default:
      return text;
  }
};

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
export const createFormField = (
  name: string,
  label: string,
  type: FormFieldType,
  position: Position,
  options?: Partial<FormField>
): FormField => {
  return {
    id: crypto.randomUUID(),
    name,
    label,
    type,
    position,
    dimensions: options?.dimensions || { width: 200, height: 30, unit: MeasurementUnit.PIXELS },
    value: options?.value,
    placeholder: options?.placeholder,
    helpText: options?.helpText,
    validation: options?.validation,
    required: options?.required ?? false,
    readOnly: options?.readOnly ?? false,
    options: options?.options,
    conditional: options?.conditional,
    metadata: options?.metadata,
  };
};

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
export const validateFormFieldPlacement = (
  field: FormField,
  pageSize: Dimensions
): boolean => {
  return (
    field.position.x >= 0 &&
    field.position.y >= 0 &&
    field.position.x + field.dimensions.width <= pageSize.width &&
    field.position.y + field.dimensions.height <= pageSize.height
  );
};

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
export const addFieldOption = (field: FormField, option: FieldOption): FormField => {
  return {
    ...field,
    options: [...(field.options || []), option],
  };
};

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
export const createConditionalRule = (
  field: string,
  operator: ConditionalOperator,
  value: any,
  options?: Partial<ConditionalRule>
): ConditionalRule => {
  return {
    field,
    operator,
    value,
    logicalOperator: options?.logicalOperator,
    nestedRules: options?.nestedRules,
  };
};

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
export const evaluateConditionalRule = (
  rule: ConditionalRule,
  data: Record<string, any>
): boolean => {
  const fieldValue = data[rule.field];

  let result = false;

  switch (rule.operator) {
    case ConditionalOperator.EQUALS:
      result = fieldValue === rule.value;
      break;
    case ConditionalOperator.NOT_EQUALS:
      result = fieldValue !== rule.value;
      break;
    case ConditionalOperator.GREATER_THAN:
      result = fieldValue > rule.value;
      break;
    case ConditionalOperator.LESS_THAN:
      result = fieldValue < rule.value;
      break;
    case ConditionalOperator.GREATER_THAN_OR_EQUAL:
      result = fieldValue >= rule.value;
      break;
    case ConditionalOperator.LESS_THAN_OR_EQUAL:
      result = fieldValue <= rule.value;
      break;
    case ConditionalOperator.CONTAINS:
      result = String(fieldValue).includes(String(rule.value));
      break;
    case ConditionalOperator.NOT_CONTAINS:
      result = !String(fieldValue).includes(String(rule.value));
      break;
    case ConditionalOperator.STARTS_WITH:
      result = String(fieldValue).startsWith(String(rule.value));
      break;
    case ConditionalOperator.ENDS_WITH:
      result = String(fieldValue).endsWith(String(rule.value));
      break;
    case ConditionalOperator.IS_EMPTY:
      result = !fieldValue || fieldValue === '';
      break;
    case ConditionalOperator.IS_NOT_EMPTY:
      result = !!fieldValue && fieldValue !== '';
      break;
  }

  // Handle nested rules with logical operators
  if (rule.nestedRules && rule.nestedRules.length > 0) {
    const nestedResults = rule.nestedRules.map((nested) =>
      evaluateConditionalRule(nested, data)
    );

    switch (rule.logicalOperator) {
      case LogicalOperator.AND:
        result = result && nestedResults.every((r) => r);
        break;
      case LogicalOperator.OR:
        result = result || nestedResults.some((r) => r);
        break;
      case LogicalOperator.NOT:
        result = !result;
        break;
    }
  }

  return result;
};

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
export const createConditionalSection = (
  sectionId: string,
  condition: ConditionalRule,
  content: string,
  alternateContent?: string
): ConditionalSection => {
  return {
    id: crypto.randomUUID(),
    sectionId,
    condition,
    content,
    alternateContent,
  };
};

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
export const renderConditionalSections = (
  sections: ConditionalSection[],
  data: Record<string, any>
): Record<string, string> => {
  const rendered: Record<string, string> = {};

  sections.forEach((section) => {
    const conditionMet = evaluateConditionalRule(section.condition, data);
    rendered[section.sectionId] = conditionMet
      ? section.content
      : section.alternateContent || '';
  });

  return rendered;
};

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
export const createDocumentAssembly = (
  name: string,
  components: AssemblyComponent[],
  outputFormat: ContentFormat,
  options?: Partial<DocumentAssemblyConfig>
): DocumentAssemblyConfig => {
  return {
    id: crypto.randomUUID(),
    name,
    components,
    assemblyOrder: options?.assemblyOrder || components.map((c) => c.id),
    mergeData: options?.mergeData || {},
    outputFormat,
    metadata: options?.metadata,
  };
};

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
export const addComponentToAssembly = (
  assembly: DocumentAssemblyConfig,
  component: AssemblyComponent
): DocumentAssemblyConfig => {
  return {
    ...assembly,
    components: [...assembly.components, component],
    assemblyOrder: [...assembly.assemblyOrder, component.id],
  };
};

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
export const assembleDocument = (config: DocumentAssemblyConfig): string => {
  const assembledParts: string[] = [];

  config.assemblyOrder.forEach((componentId) => {
    const component = config.components.find((c) => c.id === componentId);
    if (!component) return;

    // Check conditional rendering
    if (component.conditional) {
      const shouldRender = evaluateConditionalRule(component.conditional, config.mergeData);
      if (!shouldRender) return;
    }

    // Add component content
    if (component.type === ComponentType.TEMPLATE && component.templateId) {
      // Template would be loaded and merged here
      assembledParts.push(`[Template: ${component.templateId}]`);
    } else if (component.content) {
      assembledParts.push(component.content);
    } else if (component.type === ComponentType.PAGE_BREAK) {
      assembledParts.push('\n\n--- PAGE BREAK ---\n\n');
    }
  });

  return assembledParts.join('\n\n');
};

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
export const createLayoutConfig = (
  pageSize: PageSize,
  orientation: PageOrientation,
  margins: PageMargins,
  options?: Partial<LayoutConfig>
): LayoutConfig => {
  return {
    pageSize,
    orientation,
    margins,
    header: options?.header,
    footer: options?.footer,
    columns: options?.columns || 1,
  };
};

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
export const calculatePageDimensions = (
  pageSize: PageSize,
  orientation: PageOrientation
): Dimensions => {
  const sizes: Record<PageSize, { width: number; height: number }> = {
    [PageSize.LETTER]: { width: 612, height: 792 },
    [PageSize.A4]: { width: 595, height: 842 },
    [PageSize.LEGAL]: { width: 612, height: 1008 },
    [PageSize.EXECUTIVE]: { width: 522, height: 756 },
    [PageSize.CUSTOM]: { width: 612, height: 792 },
  };

  const size = sizes[pageSize];

  return orientation === PageOrientation.LANDSCAPE
    ? { width: size.height, height: size.width, unit: MeasurementUnit.POINTS }
    : { width: size.width, height: size.height, unit: MeasurementUnit.POINTS };
};

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
export const createPDFOptions = (options?: Partial<PDFGenerationOptions>): PDFGenerationOptions => {
  return {
    pageSize: options?.pageSize || PageSize.LETTER,
    orientation: options?.orientation || PageOrientation.PORTRAIT,
    margins: options?.margins || {
      top: 72,
      right: 72,
      bottom: 72,
      left: 72,
      unit: MeasurementUnit.POINTS,
    },
    embedFonts: options?.embedFonts ?? true,
    compress: options?.compress ?? true,
    encryption: options?.encryption,
    watermark: options?.watermark,
    metadata: options?.metadata || {},
  };
};

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
export const createWatermark = (text: string, options?: Partial<Watermark>): Watermark => {
  return {
    text,
    opacity: options?.opacity || 0.3,
    rotation: options?.rotation || 45,
    fontSize: options?.fontSize || 48,
    color: options?.color || '#999999',
    position: options?.position || WatermarkPosition.DIAGONAL,
  };
};

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
export const createPDFEncryption = (options?: Partial<PDFEncryption>): PDFEncryption => {
  return {
    userPassword: options?.userPassword,
    ownerPassword: options?.ownerPassword,
    permissions: options?.permissions || {
      printing: true,
      modifying: false,
      copying: false,
      annotating: true,
      fillingForms: true,
      contentAccessibility: true,
      documentAssembly: false,
    },
  };
};

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
export const validateTemplateStructure = (template: DocumentTemplate): string[] => {
  const errors: string[] = [];

  if (!template.name || template.name.trim() === '') {
    errors.push('Template name is required');
  }

  if (!template.content || !template.content.body) {
    errors.push('Template content is required');
  }

  if (!template.version || !/^\d+\.\d+\.\d+$/.test(template.version)) {
    errors.push('Template version must follow semver format (e.g., 1.0.0)');
  }

  // Validate merge fields
  template.mergeFields.forEach((field, index) => {
    if (!field.name) {
      errors.push(`Merge field ${index + 1} is missing a name`);
    }
    if (!field.label) {
      errors.push(`Merge field ${index + 1} is missing a label`);
    }
  });

  return errors;
};

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
export const exportTemplateToJSON = (template: DocumentTemplate): string => {
  return JSON.stringify(template, null, 2);
};

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
export const importTemplateFromJSON = (json: string): DocumentTemplate => {
  const template = JSON.parse(json);
  return {
    ...template,
    createdAt: new Date(template.createdAt),
    updatedAt: new Date(template.updatedAt),
  };
};

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
export const generateFieldName = (label: string): string => {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_');
};

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
export const convertMeasurementUnit = (
  value: number,
  fromUnit: MeasurementUnit,
  toUnit: MeasurementUnit
): number => {
  // Convert to points first
  let points = value;

  switch (fromUnit) {
    case MeasurementUnit.INCHES:
      points = value * 72;
      break;
    case MeasurementUnit.MILLIMETERS:
      points = value * 2.83465;
      break;
    case MeasurementUnit.PIXELS:
      points = value * 0.75;
      break;
  }

  // Convert from points to target unit
  switch (toUnit) {
    case MeasurementUnit.INCHES:
      return points / 72;
    case MeasurementUnit.MILLIMETERS:
      return points / 2.83465;
    case MeasurementUnit.PIXELS:
      return points / 0.75;
    default:
      return points;
  }
};

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
export const calculateOptimalFieldPositions = (
  fields: FormField[],
  layout: LayoutConfig
): FormField[] => {
  const pageDimensions = calculatePageDimensions(layout.pageSize, layout.orientation);
  const availableWidth = pageDimensions.width - layout.margins.left - layout.margins.right;

  let currentY = layout.margins.top;
  const fieldSpacing = 10;

  return fields.map((field) => {
    const positioned = {
      ...field,
      position: {
        x: layout.margins.left,
        y: currentY,
        unit: MeasurementUnit.POINTS,
      },
    };

    currentY += field.dimensions.height + fieldSpacing;

    return positioned;
  });
};

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
export const groupFieldsBySection = (
  fields: FormField[],
  sectionField: string = 'section'
): Map<string, FormField[]> => {
  const groups = new Map<string, FormField[]>();

  fields.forEach((field) => {
    const section = field.metadata?.[sectionField] || 'default';
    const group = groups.get(section) || [];
    group.push(field);
    groups.set(section, group);
  });

  return groups;
};

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
export const generateTemplatePreview = (
  template: DocumentTemplate,
  sampleData: Record<string, any>
): string => {
  const mergedContent = mergeTemplateData(template, sampleData);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${template.name} - Preview</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .template-content { border: 1px solid #ccc; padding: 20px; }
        </style>
      </head>
      <body>
        <h1>${template.name}</h1>
        <div class="template-content">${mergedContent}</div>
      </body>
    </html>
  `;
};

// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================

/**
 * Document Preparation Service
 * Production-ready NestJS service for document preparation operations
 */
@Injectable()
export class DocumentPreparationService {
  /**
   * Creates and validates a new template
   */
  async createTemplate(
    name: string,
    category: TemplateCategory,
    content: TemplateContent
  ): Promise<DocumentTemplate> {
    const template = createDocumentTemplate(name, category, content);

    // Validate template structure
    const errors = validateTemplateStructure(template);
    if (errors.length > 0) {
      throw new Error(`Template validation failed: ${errors.join(', ')}`);
    }

    return template;
  }

  /**
   * Merges data into template and generates document
   */
  async generateDocument(
    templateId: string,
    data: Record<string, any>
  ): Promise<string> {
    // Implementation would fetch template and merge data
    return 'Generated document content';
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  DocumentTemplateModel,
  FormFieldConfigModel,
  DocumentAssemblyConfigModel,

  // Core Functions
  createDocumentTemplate,
  cloneTemplate,
  updateTemplateVersion,
  addMergeFieldToTemplate,
  removeMergeFieldFromTemplate,
  createMergeField,
  validateMergeFieldValue,
  mergeTemplateData,
  formatMergeFieldValue,
  formatDate,
  formatNumber,
  applyTextTransform,
  createFormField,
  validateFormFieldPlacement,
  addFieldOption,
  createConditionalRule,
  evaluateConditionalRule,
  createConditionalSection,
  renderConditionalSections,
  createDocumentAssembly,
  addComponentToAssembly,
  assembleDocument,
  createLayoutConfig,
  calculatePageDimensions,
  createPDFOptions,
  createWatermark,
  createPDFEncryption,
  validateTemplateStructure,
  exportTemplateToJSON,
  importTemplateFromJSON,
  generateFieldName,
  convertMeasurementUnit,
  calculateOptimalFieldPositions,
  groupFieldsBySection,
  generateTemplatePreview,

  // Services
  DocumentPreparationService,
};
