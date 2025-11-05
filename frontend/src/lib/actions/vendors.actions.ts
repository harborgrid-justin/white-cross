/**
 * @fileoverview Vendor Management Server Actions - Next.js v14+ Compatible
 * @module lib/actions/vendors
 *
 * HIPAA-compliant server actions for vendor management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive (in implementation files)
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all vendor operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 *
 * Architecture:
 * This file serves as a barrel export for all vendor-related functionality,
 * organized into the following modules:
 * - vendors.types.ts: TypeScript type definitions and interfaces
 * - vendors.cache.ts: Caching layer and cache invalidation
 * - vendors.evaluations.ts: Vendor evaluation management
 * - vendors.forms.ts: Form data handling and parsing
 * - vendors.utils.ts: Utility functions and helpers
 *
 * NOTE: This barrel file does NOT have 'use server' directive.
 * The 'use server' directive is present in implementation files that define
 * actual Server Actions. Barrel files cannot have 'use server' when re-exporting.
 */

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  ActionResult,
  Vendor,
  CreateVendorData,
  UpdateVendorData,
  VendorContract,
  VendorEvaluation,
  VendorFilters,
  VendorAnalytics
} from './vendors.types';

export { VENDOR_CACHE_TAGS } from './vendors.types';

// ==========================================
// CACHE OPERATIONS
// ==========================================

export {
  getVendor,
  getVendors,
  getVendorContracts,
  getVendorEvaluations,
  getVendorAnalytics,
  clearVendorCache
} from './vendors.cache';

// ==========================================
// CRUD OPERATIONS
// ==========================================

export {
  createVendorAction,
  updateVendorAction,
  deleteVendorAction,
  toggleVendorStatusAction
} from './vendors.crud';

// ==========================================
// EVALUATION OPERATIONS
// ==========================================

export {
  createVendorEvaluationAction
} from './vendors.evaluations';

// ==========================================
// FORM HANDLING
// ==========================================

export {
  createVendorFromForm,
  updateVendorFromForm
} from './vendors.forms';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export {
  vendorExists,
  getVendorCount,
  getVendorOverview
} from './vendors.utils';
