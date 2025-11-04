/**
 * @fileoverview Form Builder Server Actions - Main Export File
 * @module app/forms/actions
 *
 * HIPAA-compliant server actions for form builder with comprehensive
 * caching, audit logging, and error handling.
 *
 * This file serves as the main entry point and re-exports all form-related
 * functionality from focused, modular files.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all form operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 * - Dynamic form building with schema validation
 * - PHI detection and compliance logging
 *
 * Module Structure:
 * - forms.types.ts - TypeScript type definitions
 * - forms.cache.ts - Caching configuration and cached functions
 * - forms.crud.ts - Core CRUD operations (create, read, update, delete)
 * - forms.responses.ts - Form response submission and retrieval
 * - forms.formdata.ts - FormData wrapper functions
 * - forms.utils.ts - Utility functions and analytics
 */

'use server';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type {
  ActionResult,
  FormField,
  FormDefinition,
  CreateFormData,
  UpdateFormData,
  FormResponse,
  CreateFormResponseData
} from './forms.types';

// ==========================================
// CACHE CONFIGURATION & FUNCTIONS
// ==========================================

export {
  FORMS_CACHE_TAGS,
  getForm,
  getForms
} from './forms.cache';

// ==========================================
// CRUD OPERATIONS
// ==========================================

export {
  createFormAction,
  updateFormAction,
  deleteFormAction,
  getFormAction
} from './forms.crud';

// ==========================================
// FORM RESPONSE OPERATIONS
// ==========================================

export {
  submitFormResponseAction,
  getFormResponsesAction
} from './forms.responses';

// ==========================================
// FORMDATA HANDLERS
// ==========================================

export {
  createFormFromForm,
  updateFormFromForm,
  submitFormResponseFromForm
} from './forms.formdata';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export {
  formExists,
  getFormCount,
  getFormStats,
  getFormsDashboardData,
  clearFormCache,
  publishFormAction,
  archiveFormAction
} from './forms.utils';
