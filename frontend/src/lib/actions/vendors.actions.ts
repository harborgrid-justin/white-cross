/**
 * @fileoverview Vendor Management Server Actions - Next.js v14+ Compatible
 * @module app/vendors/actions
 *
 * HIPAA-compliant server actions for vendor management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all vendor operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

// ==========================================
// CONFIGURATION
// ==========================================

// Custom cache tags for vendors
export const VENDOR_CACHE_TAGS = {
  VENDORS: 'vendors',
  CONTRACTS: 'vendor-contracts',
  CERTIFICATIONS: 'vendor-certifications',
  EVALUATIONS: 'vendor-evaluations',
  PRODUCTS: 'vendor-products',
  COMPLIANCE: 'vendor-compliance',
} as const;

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

export interface Vendor {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: 'pharmaceutical' | 'medical-supply' | 'equipment' | 'service' | 'food-service' | 'technology';
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'terminated';
  priority: 'preferred' | 'approved' | 'conditional' | 'restricted';
  contactInfo: {
    primaryContact: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    website?: string;
  };
  businessInfo: {
    taxId?: string;
    dunsNumber?: string;
    businessLicense?: string;
    insuranceInfo?: {
      provider: string;
      policyNumber: string;
      coverage: number;
      expiresAt: string;
    };
  };
  compliance: {
    hipaaCompliant: boolean;
    fdaRegistered: boolean;
    deaRegistered: boolean;
    certifications: string[];
    lastAuditDate?: string;
    nextAuditDate?: string;
  };
  financials: {
    creditRating?: string;
    paymentTerms: number;
    currency: string;
    taxRate?: number;
  };
  performance: {
    onTimeDeliveryRate: number;
    qualityRating: number;
    serviceRating: number;
    totalOrders: number;
    totalSpend: number;
  };
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorData {
  name: string;
  code?: string;
  description?: string;
  type: Vendor['type'];
  contactInfo: Vendor['contactInfo'];
  businessInfo?: Partial<Vendor['businessInfo']>;
  compliance?: Partial<Vendor['compliance']>;
  financials?: Partial<Vendor['financials']>;
}

export interface UpdateVendorData {
  name?: string;
  description?: string;
  type?: Vendor['type'];
  status?: Vendor['status'];
  priority?: Vendor['priority'];
  contactInfo?: Partial<Vendor['contactInfo']>;
  businessInfo?: Partial<Vendor['businessInfo']>;
  compliance?: Partial<Vendor['compliance']>;
  financials?: Partial<Vendor['financials']>;
}

export interface VendorContract {
  id: string;
  vendorId: string;
  contractNumber: string;
  title: string;
  type: 'master-agreement' | 'purchase-order' | 'service-agreement' | 'maintenance' | 'license';
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'suspended';
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  terms: {
    paymentTerms: number;
    deliveryTerms: string;
    warrantyPeriod?: number;
    penaltyClause?: string;
  };
  documents: {
    contractFile?: string;
    amendments?: string[];
    addendums?: string[];
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorEvaluation {
  id: string;
  vendorId: string;
  evaluationType: 'initial' | 'annual' | 'performance' | 'incident' | 'renewal';
  evaluationDate: string;
  evaluator: string;
  scores: {
    quality: number;
    delivery: number;
    service: number;
    compliance: number;
    pricing: number;
    overall: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  actionItems: {
    item: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
  status: 'draft' | 'completed' | 'approved';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorFilters {
  name?: string;
  code?: string;
  type?: Vendor['type'];
  status?: Vendor['status'];
  priority?: Vendor['priority'];
  hipaaCompliant?: boolean;
  fdaRegistered?: boolean;
  deaRegistered?: boolean;
  minRating?: number;
  location?: string;
}

export interface VendorAnalytics {
  totalVendors: number;
  activeVendors: number;
  preferredVendors: number;
  complianceRate: number;
  averageRating: number;
  totalSpend: number;
  typeBreakdown: {
    type: Vendor['type'];
    count: number;
    percentage: number;
    totalSpend: number;
  }[];
  statusBreakdown: {
    status: Vendor['status'];
    count: number;
    percentage: number;
  }[];
  complianceMetrics: {
    hipaaCompliant: number;
    fdaRegistered: number;
    deaRegistered: number;
    fullyCompliant: number;
  };
  performanceMetrics: {
    averageDeliveryRate: number;
    averageQualityRating: number;
    averageServiceRating: number;
  };
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get vendor by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getVendor = cache(async (id: string): Promise<Vendor | null> => {
  try {
    const response = await serverGet<ApiResponse<Vendor>>(
      API_ENDPOINTS.VENDORS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`vendor-${id}`, VENDOR_CACHE_TAGS.VENDORS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get vendor:', error);
    return null;
  }
});

/**
 * Get all vendors with caching
 */
export const getVendors = cache(async (filters?: VendorFilters): Promise<Vendor[]> => {
  try {
    const response = await serverGet<ApiResponse<Vendor[]>>(
      API_ENDPOINTS.VENDORS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [VENDOR_CACHE_TAGS.VENDORS, 'vendor-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get vendors:', error);
    return [];
  }
});

/**
 * Get vendor contracts with caching
 */
export const getVendorContracts = cache(async (vendorId: string): Promise<VendorContract[]> => {
  try {
    const response = await serverGet<ApiResponse<VendorContract[]>>(
      `${API_ENDPOINTS.VENDORS.BY_ID(vendorId)}/contracts`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`vendor-contracts-${vendorId}`, VENDOR_CACHE_TAGS.CONTRACTS] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get vendor contracts:', error);
    return [];
  }
});

/**
 * Get vendor evaluations with caching
 */
export const getVendorEvaluations = cache(async (vendorId: string): Promise<VendorEvaluation[]> => {
  try {
    const response = await serverGet<ApiResponse<VendorEvaluation[]>>(
      `${API_ENDPOINTS.VENDORS.BY_ID(vendorId)}/evaluations`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`vendor-evaluations-${vendorId}`, VENDOR_CACHE_TAGS.EVALUATIONS] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get vendor evaluations:', error);
    return [];
  }
});

/**
 * Get vendor analytics with caching
 */
export const getVendorAnalytics = cache(async (filters?: Record<string, unknown>): Promise<VendorAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<VendorAnalytics>>(
      API_ENDPOINTS.VENDORS.STATISTICS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: ['vendor-analytics', 'vendor-stats'] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get vendor analytics:', error);
    return null;
  }
});

// ==========================================
// VENDOR OPERATIONS
// ==========================================

/**
 * Create a new vendor
 * Includes audit logging and cache invalidation
 */
export async function createVendorAction(data: CreateVendorData): Promise<ActionResult<Vendor>> {
  try {
    // Validate required fields
    if (!data.name || !data.type || !data.contactInfo?.email || !data.contactInfo?.phone) {
      return {
        success: false,
        error: 'Missing required fields: name, type, contact email, contact phone'
      };
    }

    // Validate email
    if (!validateEmail(data.contactInfo.email)) {
      return {
        success: false,
        error: 'Invalid email address'
      };
    }

    // Validate phone
    if (!validatePhone(data.contactInfo.phone)) {
      return {
        success: false,
        error: 'Invalid phone number'
      };
    }

    // Generate vendor code if not provided
    const vendorData = {
      ...data,
      code: data.code || generateId('VND')
    };

    const response = await serverPost<ApiResponse<Vendor>>(
      API_ENDPOINTS.VENDORS.BASE,
      vendorData,
      {
        cache: 'no-store',
        next: { tags: [VENDOR_CACHE_TAGS.VENDORS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create vendor');
    }

    // AUDIT LOG - Vendor creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Vendor',
      resourceId: response.data.id,
      details: `Created vendor: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(VENDOR_CACHE_TAGS.VENDORS, 'default');
    revalidateTag('vendor-list', 'default');
    revalidatePath('/vendors', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Vendor created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create vendor';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Vendor',
      details: `Failed to create vendor: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update vendor
 * Includes audit logging and cache invalidation
 */
export async function updateVendorAction(
  vendorId: string,
  data: UpdateVendorData
): Promise<ActionResult<Vendor>> {
  try {
    if (!vendorId) {
      return {
        success: false,
        error: 'Vendor ID is required'
      };
    }

    // Validate email if provided
    if (data.contactInfo?.email && !validateEmail(data.contactInfo.email)) {
      return {
        success: false,
        error: 'Invalid email address'
      };
    }

    // Validate phone if provided
    if (data.contactInfo?.phone && !validatePhone(data.contactInfo.phone)) {
      return {
        success: false,
        error: 'Invalid phone number'
      };
    }

    const response = await serverPut<ApiResponse<Vendor>>(
      API_ENDPOINTS.VENDORS.BY_ID(vendorId),
      data,
      {
        cache: 'no-store',
        next: { tags: [VENDOR_CACHE_TAGS.VENDORS, `vendor-${vendorId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update vendor');
    }

    // AUDIT LOG - Vendor update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Vendor',
      resourceId: vendorId,
      details: 'Updated vendor information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(VENDOR_CACHE_TAGS.VENDORS, 'default');
    revalidateTag(`vendor-${vendorId}`, 'default');
    revalidateTag('vendor-list', 'default');
    revalidatePath('/vendors', 'page');
    revalidatePath(`/vendors/${vendorId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Vendor updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update vendor';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Vendor',
      resourceId: vendorId,
      details: `Failed to update vendor: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Delete vendor (soft delete)
 * Includes audit logging and cache invalidation
 */
export async function deleteVendorAction(vendorId: string): Promise<ActionResult<void>> {
  try {
    if (!vendorId) {
      return {
        success: false,
        error: 'Vendor ID is required'
      };
    }

    await serverDelete<ApiResponse<void>>(
      API_ENDPOINTS.VENDORS.BY_ID(vendorId),
      {
        cache: 'no-store',
        next: { tags: [VENDOR_CACHE_TAGS.VENDORS, `vendor-${vendorId}`] }
      }
    );

    // AUDIT LOG - Vendor deletion
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Vendor',
      resourceId: vendorId,
      details: 'Deleted vendor (soft delete)',
      success: true
    });

    // Cache invalidation
    revalidateTag(VENDOR_CACHE_TAGS.VENDORS, 'default');
    revalidateTag(`vendor-${vendorId}`, 'default');
    revalidateTag('vendor-list', 'default');
    revalidatePath('/vendors', 'page');

    return {
      success: true,
      message: 'Vendor deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete vendor';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Vendor',
      resourceId: vendorId,
      details: `Failed to delete vendor: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Activate/Deactivate vendor
 * Includes audit logging and cache invalidation
 */
export async function toggleVendorStatusAction(
  vendorId: string,
  isActive: boolean
): Promise<ActionResult<Vendor>> {
  try {
    if (!vendorId) {
      return {
        success: false,
        error: 'Vendor ID is required'
      };
    }

    const response = await serverPost<ApiResponse<Vendor>>(
      isActive ? API_ENDPOINTS.VENDORS.REACTIVATE(vendorId) : `${API_ENDPOINTS.VENDORS.BY_ID(vendorId)}/deactivate`,
      {},
      {
        cache: 'no-store',
        next: { tags: [VENDOR_CACHE_TAGS.VENDORS, `vendor-${vendorId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to ${isActive ? 'activate' : 'deactivate'} vendor`);
    }

    // AUDIT LOG - Status change
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Vendor',
      resourceId: vendorId,
      details: `${isActive ? 'Activated' : 'Deactivated'} vendor`,
      changes: { isActive },
      success: true
    });

    // Cache invalidation
    revalidateTag(VENDOR_CACHE_TAGS.VENDORS, 'default');
    revalidateTag(`vendor-${vendorId}`, 'default');
    revalidateTag('vendor-list', 'default');
    revalidatePath('/vendors', 'page');
    revalidatePath(`/vendors/${vendorId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: `Vendor ${isActive ? 'activated' : 'deactivated'} successfully`
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : `Failed to ${isActive ? 'activate' : 'deactivate'} vendor`;

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Vendor',
      resourceId: vendorId,
      details: `Failed to ${isActive ? 'activate' : 'deactivate'} vendor: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Create vendor evaluation
 * Includes audit logging and cache invalidation
 */
export async function createVendorEvaluationAction(
  vendorId: string,
  evaluationData: Omit<VendorEvaluation, 'id' | 'vendorId' | 'createdBy' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<VendorEvaluation>> {
  try {
    if (!vendorId) {
      return {
        success: false,
        error: 'Vendor ID is required'
      };
    }

    const response = await serverPost<ApiResponse<VendorEvaluation>>(
      `${API_ENDPOINTS.VENDORS.BY_ID(vendorId)}/evaluations`,
      evaluationData,
      {
        cache: 'no-store',
        next: { tags: [VENDOR_CACHE_TAGS.EVALUATIONS, `vendor-evaluations-${vendorId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create vendor evaluation');
    }

    // AUDIT LOG - Evaluation creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'VendorEvaluation',
      resourceId: response.data.id,
      details: `Created vendor evaluation (${evaluationData.evaluationType})`,
      success: true
    });

    // Cache invalidation
    revalidateTag(VENDOR_CACHE_TAGS.EVALUATIONS, 'default');
    revalidateTag(`vendor-evaluations-${vendorId}`, 'default');
    revalidateTag(`vendor-${vendorId}`, 'default');
    revalidatePath('/vendors', 'page');
    revalidatePath(`/vendors/${vendorId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Vendor evaluation created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create vendor evaluation';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'VendorEvaluation',
      details: `Failed to create vendor evaluation: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create vendor from form data
 * Form-friendly wrapper for createVendorAction
 */
export async function createVendorFromForm(formData: FormData): Promise<ActionResult<Vendor>> {
  const vendorData: CreateVendorData = {
    name: formData.get('name') as string,
    code: formData.get('code') as string || undefined,
    description: formData.get('description') as string || undefined,
    type: formData.get('type') as Vendor['type'],
    contactInfo: {
      primaryContact: formData.get('primaryContact') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: {
        street: formData.get('address.street') as string,
        city: formData.get('address.city') as string,
        state: formData.get('address.state') as string,
        zipCode: formData.get('address.zipCode') as string,
        country: formData.get('address.country') as string || 'US',
      },
      website: formData.get('website') as string || undefined,
    },
    businessInfo: {
      taxId: formData.get('taxId') as string || undefined,
      dunsNumber: formData.get('dunsNumber') as string || undefined,
      businessLicense: formData.get('businessLicense') as string || undefined,
    },
    compliance: {
      hipaaCompliant: formData.get('hipaaCompliant') === 'true',
      fdaRegistered: formData.get('fdaRegistered') === 'true',
      deaRegistered: formData.get('deaRegistered') === 'true',
      certifications: (formData.get('certifications') as string)?.split(',').filter(Boolean) || [],
    },
    financials: {
      paymentTerms: parseInt(formData.get('paymentTerms') as string) || 30,
      currency: formData.get('currency') as string || 'USD',
      taxRate: parseFloat(formData.get('taxRate') as string) || undefined,
    },
  };

  const result = await createVendorAction(vendorData);
  
  if (result.success && result.data) {
    redirect(`/vendors/${result.data.id}`);
  }
  
  return result;
}

/**
 * Update vendor from form data
 * Form-friendly wrapper for updateVendorAction
 */
export async function updateVendorFromForm(
  vendorId: string,
  formData: FormData
): Promise<ActionResult<Vendor>> {
  const vendorData: UpdateVendorData = {
    name: formData.get('name') as string || undefined,
    description: formData.get('description') as string || undefined,
    type: formData.get('type') as Vendor['type'] || undefined,
    status: formData.get('status') as Vendor['status'] || undefined,
    priority: formData.get('priority') as Vendor['priority'] || undefined,
  };

  // Handle nested contact info updates
  if (formData.get('primaryContact') || formData.get('email') || formData.get('phone')) {
    vendorData.contactInfo = {
      primaryContact: formData.get('primaryContact') as string || undefined,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
    };
  }

  // Filter out undefined values
  const filteredData = Object.entries(vendorData).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof UpdateVendorData] = value;
    }
    return acc;
  }, {} as UpdateVendorData);

  const result = await updateVendorAction(vendorId, filteredData);
  
  if (result.success && result.data) {
    revalidatePath(`/vendors/${vendorId}`, 'page');
  }
  
  return result;
}

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
 * Get vendor count
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
 * Get vendor overview
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

/**
 * Clear vendor cache
 */
export async function clearVendorCache(vendorId?: string): Promise<void> {
  if (vendorId) {
    revalidateTag(`vendor-${vendorId}`, 'default');
    revalidateTag(`vendor-contracts-${vendorId}`, 'default');
    revalidateTag(`vendor-evaluations-${vendorId}`, 'default');
  }
  
  // Clear all vendor caches
  Object.values(VENDOR_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('vendor-list', 'default');
  revalidateTag('vendor-stats', 'default');

  // Clear paths
  revalidatePath('/vendors', 'page');
  if (vendorId) {
    revalidatePath(`/vendors/${vendorId}`, 'page');
  }
}
