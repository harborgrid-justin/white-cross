/**
 * @fileoverview Billing Utility Functions
 * @module app/billing/utils
 *
 * Utility functions for billing dashboard, summaries, and analytics.
 */

'use server';

import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types and cache
import type {
  BillingRecord,
  BillingStats
} from './billing.types';
import { getInvoices, getBillingStats, getBillingAnalytics } from './billing.cache';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Get revenue summary
 */
export async function getRevenueSummary(): Promise<{
  totalRevenue: number;
  monthlyRevenue: number;
  outstandingAmount: number;
  overdueAmount: number;
}> {
  try {
    const analytics = await getBillingAnalytics();

    return {
      totalRevenue: analytics?.totalRevenue || 0,
      monthlyRevenue: analytics?.periodComparison.revenue.current || 0,
      outstandingAmount: analytics?.outstandingAmount || 0,
      overdueAmount: analytics?.overdueAmount || 0,
    };
  } catch {
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      outstandingAmount: 0,
      overdueAmount: 0,
    };
  }
}

// ==========================================
// DASHBOARD DATA FUNCTIONS
// ==========================================

/**
 * Get comprehensive billing dashboard data
 * Combines billing records and statistics for dashboard display
 */
export async function getBillingDashboardData() {
  try {
    // Fetch both billing records and stats in parallel for optimal performance
    const [billingRecords, stats] = await Promise.all([
      getInvoices(),
      getBillingStats()
    ]);

    // Transform invoices to billing records format
    const records: BillingRecord[] = billingRecords.map(invoice => ({
      id: invoice.id,
      studentId: invoice.customerId,
      studentName: invoice.customerName,
      serviceType: 'medical-consultation' as const,
      description: invoice.description,
      amount: invoice.totalAmount,
      status: invoice.status === 'paid' ? 'paid' :
             invoice.status === 'sent' ? 'pending' :
             invoice.status === 'overdue' ? 'overdue' : 'draft',
      dateOfService: invoice.issueDate,
      billingDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      paymentDate: invoice.paidDate,
      notes: `Invoice #${invoice.invoiceNumber}`,
    }));

    // HIPAA compliance audit logging
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'billing_dashboard',
      resourceId: 'dashboard-view',
      details: `Retrieved ${records.length} billing records for dashboard`
    });

    return {
      billingRecords: records,
      stats
    };
  } catch (error) {
    console.error('Error fetching billing dashboard data:', error);

    // Return empty data structure on error
    return {
      billingRecords: [] as BillingRecord[],
      stats: {
        totalBilled: 0,
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        claimsPending: 0,
        claimsApproved: 0,
        claimsDenied: 0,
      } as BillingStats
    };
  }
}
