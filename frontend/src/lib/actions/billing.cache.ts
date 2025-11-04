/**
 * @fileoverview Billing Cache Management
 * @module app/billing/cache
 *
 * Caching functions and cache management for billing data.
 * Uses Next.js cache() for automatic memoization and revalidation.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverGet } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TTL } from '@/lib/cache/constants';

// Types
import type {
  ApiResponse,
  Invoice,
  InvoiceFilters,
  Payment,
  PaymentFilters,
  BillingAnalytics,
  BillingStats
} from './billing.types';

// ==========================================
// CACHE CONFIGURATION
// ==========================================

export const BILLING_CACHE_TAGS = {
  INVOICES: 'billing-invoices',
  PAYMENTS: 'billing-payments',
  ANALYTICS: 'billing-analytics',
  REPORTS: 'billing-reports',
  SETTINGS: 'billing-settings',
} as const;

// ==========================================
// INVOICE CACHE FUNCTIONS
// ==========================================

/**
 * Get invoice by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getInvoice = cache(async (id: string): Promise<Invoice | null> => {
  try {
    const response = await serverGet<ApiResponse<Invoice>>(
      API_ENDPOINTS.BILLING.INVOICE_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`invoice-${id}`, BILLING_CACHE_TAGS.INVOICES]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get invoice:', error);
    return null;
  }
});

/**
 * Get all invoices with caching
 */
export const getInvoices = cache(async (filters?: InvoiceFilters): Promise<Invoice[]> => {
  try {
    const response = await serverGet<ApiResponse<Invoice[]>>(
      API_ENDPOINTS.BILLING.INVOICES,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [BILLING_CACHE_TAGS.INVOICES, 'invoice-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get invoices:', error);
    return [];
  }
});

// ==========================================
// PAYMENT CACHE FUNCTIONS
// ==========================================

/**
 * Get payment by ID with caching
 */
export const getPayment = cache(async (id: string): Promise<Payment | null> => {
  try {
    const response = await serverGet<ApiResponse<Payment>>(
      API_ENDPOINTS.BILLING.PAYMENT_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`payment-${id}`, BILLING_CACHE_TAGS.PAYMENTS]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get payment:', error);
    return null;
  }
});

/**
 * Get all payments with caching
 */
export const getPayments = cache(async (filters?: PaymentFilters): Promise<Payment[]> => {
  try {
    const response = await serverGet<ApiResponse<Payment[]>>(
      API_ENDPOINTS.BILLING.PAYMENTS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [BILLING_CACHE_TAGS.PAYMENTS, 'payment-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get payments:', error);
    return [];
  }
});

// ==========================================
// ANALYTICS CACHE FUNCTIONS
// ==========================================

/**
 * Get billing analytics with caching
 */
export const getBillingAnalytics = cache(async (filters?: Record<string, unknown>): Promise<BillingAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<BillingAnalytics>>(
      API_ENDPOINTS.BILLING.ANALYTICS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: [BILLING_CACHE_TAGS.ANALYTICS, 'billing-stats']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get billing analytics:', error);
    return null;
  }
});

/**
 * Get billing statistics for dashboard
 * Provides comprehensive billing metrics with proper caching
 */
export const getBillingStats = cache(async (): Promise<BillingStats> => {
  try {
    // Fetch invoices for stats calculation
    const invoices = await serverGet<Invoice[]>(
      `${API_ENDPOINTS.BILLING?.BASE || '/api/billing'}/invoices`,
      {
        next: {
          revalidate: 300, // 5 minutes
          tags: ['billing-stats', 'billing-dashboard']
        }
      }
    );

    // Calculate stats from invoices
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const pendingInvoices = invoices.filter(inv => inv.status === 'sent');
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

    const stats: BillingStats = {
      totalBilled: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalPaid: paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalPending: pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalOverdue: overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      claimsPending: pendingInvoices.length,
      claimsApproved: paidInvoices.length,
      claimsDenied: invoices.filter(inv => inv.status === 'cancelled').length,
    };

    // PHI protection audit log
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'billing_stats',
      resourceId: 'dashboard-stats',
      details: 'Retrieved billing statistics for dashboard display'
    });

    return stats;
  } catch (error) {
    console.error('Error fetching billing stats:', error);
    // Return default stats on error
    return {
      totalBilled: 0,
      totalPaid: 0,
      totalPending: 0,
      totalOverdue: 0,
      claimsPending: 0,
      claimsApproved: 0,
      claimsDenied: 0,
    };
  }
});

// ==========================================
// CACHE INVALIDATION
// ==========================================

/**
 * Clear billing cache
 */
export async function clearBillingCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`, 'default');
  }

  // Clear all billing caches
  Object.values(BILLING_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('invoice-list', 'default');
  revalidateTag('payment-list', 'default');
  revalidateTag('billing-stats', 'default');

  // Clear paths
  revalidatePath('/billing', 'page');
  revalidatePath('/billing/invoices', 'page');
  revalidatePath('/billing/payments', 'page');
  revalidatePath('/billing/analytics', 'page');
}
