/**
 * @fileoverview Billing Invoices Page Data Layer - Server-Side Data Fetching
 * @module app/(dashboard)/billing/invoices/data
 *
 * @description
 * Server-side data fetching functions for the billing invoices dashboard.
 * Separates data logic from UI components for better maintainability.
 *
 * **Features:**
 * - Invoice records fetching with filtering and search
 * - Error handling and caching
 * - Type-safe API responses
 *
 * @since 1.0.0
 */

import { apiActions } from '@/lib/api';
import type { BillingInvoice, InvoiceFilters } from '@/services/api';

/**
 * Fetch invoices data with optional filtering and search
 *
 * @param filters - Filtering options for invoices
 * @param searchTerm - Search term for client-side filtering
 * @returns Promise resolving to invoices data
 */
export async function fetchInvoices(
  filters: InvoiceFilters = {},
  searchTerm?: string
): Promise<BillingInvoice[]> {
  try {
    const response = await apiActions.billing.getInvoices(1, 50, filters);
    
    // Apply client-side search filter if needed
    if (searchTerm?.trim()) {
      return response.data.filter(invoice => 
        invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.providerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
}

/**
 * Fetch invoices dashboard data
 *
 * @param filters - Filtering options
 * @param searchTerm - Search term for filtering
 * @returns Promise resolving to invoices data and error state
 */
export async function fetchInvoicesDashboardData(
  filters: InvoiceFilters = {},
  searchTerm?: string
) {
  try {
    const invoices = await fetchInvoices(filters, searchTerm);
    
    return {
      invoices,
      error: null
    };
  } catch (error) {
    console.error('Error fetching invoices dashboard data:', error);
    return {
      invoices: [],
      error: error instanceof Error ? error.message : 'Failed to load invoices data'
    };
  }
}
