/**
 * @fileoverview Vendor Constants
 * @module lib/actions/vendors/constants
 *
 * Runtime constant values for vendor management.
 * Separated from type definitions for proper type-only imports.
 */

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Custom cache tags for vendor-related data
 */
export const VENDOR_CACHE_TAGS = {
  VENDORS: 'vendors',
  CONTRACTS: 'vendor-contracts',
  CERTIFICATIONS: 'vendor-certifications',
  EVALUATIONS: 'vendor-evaluations',
  PRODUCTS: 'vendor-products',
  COMPLIANCE: 'vendor-compliance',
} as const;
