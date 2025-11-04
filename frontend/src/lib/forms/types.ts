/**
 * Form Field Types and Interfaces
 *
 * Type definitions for dynamic form generation and validation.
 *
 * @module lib/forms/types
 */

/**
 * Form field types
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'boolean'
  | 'file'
  | 'image'
  | 'ssn'
  | 'mrn'
  | 'zipcode'
  | 'url'
  | 'password'
  | 'hidden'
  | 'richtext';

/**
 * Validation rule types
 */
export type ValidationRuleType =
  | 'required'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'email'
  | 'phone'
  | 'ssn'
  | 'mrn'
  | 'url'
  | 'custom';

/**
 * Validation rule definition
 */
export interface ValidationRule {
  type: ValidationRuleType;
  value?: any;
  message?: string;
  validator?: (value: any) => boolean | Promise<boolean>;
}

/**
 * Select option
 */
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

/**
 * Conditional logic operator
 */
export type ConditionalOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'isEmpty'
  | 'isNotEmpty';

/**
 * Conditional logic rule
 */
export interface ConditionalRule {
  field: string;
  operator: ConditionalOperator;
  value?: any;
}

/**
 * Field visibility/validation condition
 */
export interface FieldCondition {
  rules: ConditionalRule[];
  logic?: 'and' | 'or'; // How to combine rules (default: 'and')
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require';
}

/**
 * Form field definition
 */
export interface FormField {
  // Basic properties
  id: string;
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  validation?: ValidationRule[];

  // Type-specific options
  options?: SelectOption[]; // For select, radio, checkbox
  min?: number; // For number, date
  max?: number; // For number, date
  step?: number; // For number
  accept?: string; // For file upload
  multiple?: boolean; // For select, file
  rows?: number; // For textarea
  minLength?: number; // For text, textarea
  maxLength?: number; // For text, textarea
  pattern?: string; // For text validation

  // Layout and styling
  className?: string;
  width?: 'full' | 'half' | 'third' | 'quarter';
  order?: number;
  section?: string;

  // PHI and security
  isPHI?: boolean;
  encrypted?: boolean;
  maskValue?: boolean; // Show masked version in UI

  // Conditional logic
  conditions?: FieldCondition[];

  // Metadata
  metadata?: Record<string, any>;
}

/**
 * Form section grouping
 */
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

/**
 * Form definition
 */
export interface FormDefinition {
  id: string;
  title: string;
  description?: string;
  version: string;
  fields: FormField[];
  sections?: FormSection[];
  metadata?: {
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
    category?: string;
  };
}

/**
 * Generated Zod schema metadata
 */
export interface GeneratedSchema {
  schemaString: string; // Serialized Zod schema
  hash: string; // Hash for validation
  fieldTypes: Record<string, FieldType>;
  phiFields: string[];
  requiredFields: string[];
  createdAt: string;
}

/**
 * Form submission data
 */
export interface FormSubmission {
  formId: string;
  formVersion: string;
  data: Record<string, any>;
  submittedBy: string;
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Form validation result
 */
export interface FormValidationResult {
  valid: boolean;
  errors: Record<string, string[]>;
  warnings?: Record<string, string[]>;
}
