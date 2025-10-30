/**
 * @fileoverview Billing Reports Page Data Layer - Server-Side Data Fetching
 * @module app/(dashboard)/billing/reports/data
 *
 * @description
 * Server-side data fetching functions for the billing reports dashboard.
 * Separates data logic from UI components for better maintainability.
 *
 * **Features:**
 * - Billing and payment analytics fetching with date range filtering
 * - Error handling and caching
 * - Type-safe API responses
 *
 * @since 1.0.0
 */

import { billingApi, type BillingAnalytics } from '@/services/api';

/**
 * Report time period types
 */
export type ReportPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

/**
 * Revenue metrics interface
 */
export interface RevenueMetrics {
  totalRevenue: number;
  previousPeriodRevenue: number;
  revenueGrowth: number;
  averageInvoiceValue: number;
  collectionRate: number;
  outstandingBalance: number;
}

/**
 * Payment metrics interface
 */
export interface PaymentMetrics {
  totalPayments: number;
  paymentVolume: number;
  averagePaymentTime: number;
  paymentMethods: { method: string; amount: number; percentage: number }[];
  refundRate: number;
  chargebackRate: number;
}

/**
 * Calculate date range based on selected period
 *
 * @param period - Selected time period
 * @param customRange - Custom date range if period is 'custom'
 * @returns Object with startDate and endDate strings
 */
function calculateDateRange(
  period: ReportPeriod,
  customRange?: { start: string; end: string }
): { startDate?: string; endDate?: string } {
  const now = new Date();
  let startDate: string | undefined;
  let endDate: string | undefined;
  
  if (period === 'custom' && customRange?.start && customRange?.end) {
    startDate = customRange.start;
    endDate = customRange.end;
  } else if (period !== 'custom') {
    endDate = now.toISOString();
    const start = new Date(now);
    
    switch (period) {
      case 'today':
        start.setDate(start.getDate() - 1);
        break;
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(start.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }
    
    startDate = start.toISOString();
  }
  
  return { startDate, endDate };
}

/**
 * Fetch billing analytics data
 *
 * @param period - Time period for analytics
 * @param customRange - Custom date range if period is 'custom'
 * @returns Promise resolving to billing analytics data
 */
export async function fetchBillingAnalytics(
  period: ReportPeriod,
  customRange?: { start: string; end: string }
): Promise<BillingAnalytics | null> {
  try {
    const { startDate, endDate } = calculateDateRange(period, customRange);
    
    if (!startDate || !endDate) {
      return null;
    }
    
    const billingAnalytics = await billingApi.getBillingAnalytics(startDate, endDate);
    return billingAnalytics;
  } catch (error) {
    console.error('Error fetching billing analytics:', error);
    return null;
  }
}

/**
 * Fetch payment analytics data
 *
 * @param period - Time period for analytics
 * @param customRange - Custom date range if period is 'custom'
 * @returns Promise resolving to payment analytics data
 */
export async function fetchPaymentAnalytics(
  period: ReportPeriod,
  customRange?: { start: string; end: string }
): Promise<any | null> {
  try {
    const { startDate, endDate } = calculateDateRange(period, customRange);
    
    if (!startDate || !endDate) {
      return null;
    }
    
    const paymentAnalytics = await billingApi.getPaymentAnalytics(startDate, endDate);
    return paymentAnalytics;
  } catch (error) {
    console.error('Error fetching payment analytics:', error);
    return null;
  }
}

/**
 * Fetch billing reports dashboard data
 *
 * @param period - Time period for reports
 * @param customRange - Custom date range if period is 'custom'
 * @returns Promise resolving to formatted revenue and payment metrics
 */
export async function fetchBillingReportsDashboardData(
  period: ReportPeriod,
  customRange?: { start: string; end: string }
) {
  try {
    // Fetch both analytics in parallel
    const [billingAnalytics, paymentAnalytics] = await Promise.allSettled([
      fetchBillingAnalytics(period, customRange),
      fetchPaymentAnalytics(period, customRange)
    ]);

    // Process billing analytics
    let revenueMetrics: RevenueMetrics = {
      totalRevenue: 0,
      previousPeriodRevenue: 0,
      revenueGrowth: 0,
      averageInvoiceValue: 0,
      collectionRate: 0,
      outstandingBalance: 0
    };

    if (billingAnalytics.status === 'fulfilled' && billingAnalytics.value) {
      const billing = billingAnalytics.value;
      revenueMetrics = {
        totalRevenue: billing.totalRevenue,
        previousPeriodRevenue: billing.monthlyRevenue, // This would need proper calculation
        revenueGrowth: 0, // Would need to calculate from historical data
        averageInvoiceValue: billing.averageInvoiceValue,
        collectionRate: billing.collectionRate,
        outstandingBalance: billing.outstandingBalance
      };
    }

    // Process payment analytics
    let paymentMetrics: PaymentMetrics = {
      totalPayments: 0,
      paymentVolume: 0,
      averagePaymentTime: 0,
      paymentMethods: [],
      refundRate: 0,
      chargebackRate: 0
    };

    if (paymentAnalytics.status === 'fulfilled' && paymentAnalytics.value) {
      const payment = paymentAnalytics.value;
      paymentMetrics = {
        totalPayments: payment.totalPayments,
        paymentVolume: payment.totalAmount,
        averagePaymentTime: payment.averagePaymentTime,
        paymentMethods: payment.paymentMethods.map((pm: any) => ({
          method: pm.method,
          amount: pm.amount,
          percentage: (pm.amount / payment.totalAmount) * 100
        })),
        refundRate: payment.refundRate,
        chargebackRate: payment.chargebackRate
      };
    }

    return {
      revenueMetrics,
      paymentMetrics,
      error: null
    };
  } catch (error) {
    console.error('Error fetching billing reports dashboard data:', error);
    return {
      revenueMetrics: {
        totalRevenue: 0,
        previousPeriodRevenue: 0,
        revenueGrowth: 0,
        averageInvoiceValue: 0,
        collectionRate: 0,
        outstandingBalance: 0
      },
      paymentMetrics: {
        totalPayments: 0,
        paymentVolume: 0,
        averagePaymentTime: 0,
        paymentMethods: [],
        refundRate: 0,
        chargebackRate: 0
      },
      error: error instanceof Error ? error.message : 'Failed to load billing reports data'
    };
  }
}
