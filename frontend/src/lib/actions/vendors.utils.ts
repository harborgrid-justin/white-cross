/**
 * @fileoverview Vendor Utility Functions
 * @module lib/actions/vendors/utils
 *
 * Utility functions for vendor operations including existence checks,
 * counts, and overview aggregations.
 */

'use server';

import { cache } from 'react';

// Types
import type {
  Vendor,
  VendorContract,
  VendorEvaluation,
  VendorFilters
} from './vendors.types';

// Cache functions
import { getVendor, getVendors, getVendorContracts, getVendorEvaluations } from './vendors.cache';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if vendor exists
 */
export async function vendorExists(vendorId: string): Promise<boolean> {
  const vendor = await getVendor(vendorId);
  return vendor !== null;
}

/**
 * Get vendor count with optional filters
 */
export const getVendorCount = cache(async (filters?: VendorFilters): Promise<number> => {
  try {
    const vendors = await getVendors(filters);
    return vendors.length;
  } catch {
    return 0;
  }
});

/**
 * Get comprehensive vendor overview
 * Aggregates vendor data, contracts, evaluations, and computed metrics
 */
export async function getVendorOverview(vendorId: string): Promise<{
  vendor: Vendor | null;
  contracts: VendorContract[];
  evaluations: VendorEvaluation[];
  activeContracts: number;
  averageRating: number;
}> {
  try {
    const [vendor, contracts, evaluations] = await Promise.all([
      getVendor(vendorId),
      getVendorContracts(vendorId),
      getVendorEvaluations(vendorId)
    ]);

    const activeContracts = contracts.filter(c => c.status === 'active').length;
    const averageRating = evaluations.length > 0
      ? evaluations.reduce((sum, evaluation) => sum + evaluation.scores.overall, 0) / evaluations.length
      : 0;

    return {
      vendor,
      contracts,
      evaluations,
      activeContracts,
      averageRating,
    };
  } catch {
    return {
      vendor: null,
      contracts: [],
      evaluations: [],
      activeContracts: 0,
      averageRating: 0,
    };
  }
}
