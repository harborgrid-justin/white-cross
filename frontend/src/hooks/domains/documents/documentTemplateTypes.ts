/**
 * Documents Domain Template Type Definitions
 *
 * TypeScript interfaces for document templates, template fields,
 * and field validation rules.
 *
 * @module hooks/domains/documents/documentTemplateTypes
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import type { DocumentUser } from './documentTypes';

/**
 * Validation rules for template field input.
 *
 * Defines constraints for template field values to ensure data quality
 * and consistency across generated documents.
 *
 * @property minLength - Minimum string length for text fields
 * @property maxLength - Maximum string length for text fields
 * @property min - Minimum value for number fields
 * @property max - Maximum value for number fields
 * @property pattern - Regular expression pattern for validation
 */
export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

/**
 * Fillable field definition within a document template.
 *
 * Defines a single fillable field in a template, including its type,
 * validation rules, and default value.
 *
 * @property id - Unique field identifier within template
 * @property name - Field programmatic name (used in data mapping)
 * @property label - Human-readable field label for forms
 * @property type - Field data type (text, number, date, boolean, select, textarea)
 * @property required - Whether field must be filled before document generation
 * @property defaultValue - Optional default value for the field
 * @property options - Array of options for 'select' type fields
 * @property validation - Optional validation rules for field input
 *
 * @see {@link FieldValidation} for validation rule structure
 * @see {@link DocumentTemplate} for template structure
 */
export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'textarea';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: FieldValidation;
}

/**
 * Document template for creating standardized documents.
 *
 * Defines reusable templates with predefined structure and fillable fields.
 * Used for generating consistent healthcare forms, reports, and records.
 *
 * @property id - Unique template identifier
 * @property name - Template display name
 * @property description - Optional template description and usage notes
 * @property category - Template category (forms, reports, letters, etc.)
 * @property templateUrl - URL to the template file (PDF, DOCX, etc.)
 * @property thumbnailUrl - Optional preview thumbnail URL
 * @property fields - Array of fillable template fields with validation
 * @property isPublic - Whether template is available to all users
 * @property usageCount - Number of times template has been used
 * @property createdBy - User who created the template
 * @property createdAt - ISO 8601 timestamp of template creation
 * @property updatedAt - ISO 8601 timestamp of last template update
 *
 * @remarks
 * **Template Fields:**
 * - Each field defines a fillable area in the template
 * - Supports text, number, date, boolean, select, textarea types
 * - Required fields must be completed before document generation
 * - Validation rules ensure data quality
 *
 * **Usage:**
 * - Templates standardize document creation
 * - Fields are populated with student/health data
 * - Generated documents follow consistent format
 *
 * @example
 * ```typescript
 * const template: DocumentTemplate = {
 *   id: 'tmpl-health-assessment',
 *   name: 'Annual Health Assessment Form',
 *   description: 'Standard form for annual student health screenings',
 *   category: 'health-forms',
 *   templateUrl: 'https://cdn.example.com/templates/health-assessment.pdf',
 *   thumbnailUrl: 'https://cdn.example.com/templates/thumbs/health-assessment.jpg',
 *   fields: [
 *     {
 *       id: 'student-name',
 *       name: 'studentName',
 *       label: 'Student Name',
 *       type: 'text',
 *       required: true,
 *       validation: { minLength: 2, maxLength: 100 }
 *     },
 *     {
 *       id: 'assessment-date',
 *       name: 'assessmentDate',
 *       label: 'Assessment Date',
 *       type: 'date',
 *       required: true
 *     }
 *   ],
 *   isPublic: true,
 *   usageCount: 145,
 *   createdBy: {
 *     id: 'user-admin-01',
 *     name: 'Admin User',
 *     email: 'admin@school.edu'
 *   },
 *   createdAt: '2024-09-01T00:00:00Z',
 *   updatedAt: '2025-01-01T00:00:00Z'
 * };
 * ```
 *
 * @see {@link TemplateField} for field definition structure
 * @see {@link useCreateFromTemplate} for generating documents from templates
 */
export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  templateUrl: string;
  thumbnailUrl?: string;
  fields: TemplateField[];
  isPublic: boolean;
  usageCount: number;
  createdBy: DocumentUser;
  createdAt: string;
  updatedAt: string;
}
