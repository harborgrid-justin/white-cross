/**
 * Forms Library - Central Export
 *
 * Provides comprehensive form handling capabilities including:
 * - Dynamic form field types and interfaces
 * - Zod schema generation and validation
 * - API integration for form CRUD operations
 * - Security utilities (PHI detection, XSS sanitization)
 * - Healthcare-specific validation patterns
 *
 * @module lib/forms
 * @example
 * ```typescript
 * import {
 *   type FormField,
 *   type FormDefinition,
 *   generateZodSchema,
 *   validateFormData,
 *   sanitizeFormData,
 *   detectPHI
 * } from '@/lib/forms';
 * ```
 */

// Type Exports
export type {
  FieldType,
  ValidationRuleType,
  ValidationRule,
  SelectOption,
  ConditionalOperator,
  ConditionalRule,
  FieldCondition,
  FormField,
  FormSection,
  FormDefinition,
  GeneratedSchema,
  FormSubmission,
  FormValidationResult
} from './types';

// Schema Generation & Validation Exports
export {
  fieldToZodType,
  generateZodSchema,
  generateSchemaMetadata,
  parseSchemaMetadata,
  addHealthcareValidation,
  validateFormData
} from './schema';

// Legacy Validation Exports (for backward compatibility)
export {
  generateZodSchema as generateZodSchemaLegacy,
  validateFormData as validateFormDataLegacy,
  safeValidateFormData,
  serializeZodSchema,
  formatValidationErrors
} from './validation';

// API Integration Exports
export type {
  FormDefinition as ApiFormDefinition,
  FormResponse
} from './api';

export {
  FORM_API_ENDPOINTS,
  getForm,
  storeForm,
  updateForm,
  softDeleteForm,
  createFormVersion,
  getFormResponses,
  storeFormResponse,
  getFormResponseCount,
  listForms
} from './api';

// Security & PHI Exports
export {
  isPHIField,
  detectPHI,
  formContainsPHI,
  sanitizeFormData as sanitizeFormDataSecurity,
  sanitizeHTML,
  maskSensitiveData,
  redactPHI,
  extractClientInfo
} from './security';

// Sanitization Exports
export type { SanitizationConfig } from './sanitization';

export {
  createSanitizer,
  sanitizeHtml,
  sanitizeRichText,
  sanitizeText,
  sanitizeFieldValue,
  sanitizeFormData,
  stripHtmlTags,
  sanitizeAndTruncate,
  validateSanitization
} from './sanitization';
