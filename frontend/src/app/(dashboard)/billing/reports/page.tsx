'use client';

import React, { useState, useEffect } from 'react';
import { BillingReports } from '@/components/pages/Billing';
import { billingApi, type BillingAnalytics } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

/**
 * Report time period types
 */
type ReportPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

/**
 * Report chart types
 */
type ChartType = 'line' | 'bar' | 'pie' | 'area';

/**
 * Revenue metrics interface
 */
interface RevenueMetrics {
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
interface PaymentMetrics {
  totalPayments: number;
  paymentVolume: number;
  averagePaymentTime: number;
  paymentMethods: { method: string; amount: number; percentage: number }[];
  refundRate: number;
  chargebackRate: number;
}

/**
 * BillingReportsPage Component
 * 
 * Next.js page component for billing reports and analytics dashboard.
 * Provides comprehensive financial insights, revenue tracking, payment analysis,
 * and visual data representation with filtering and export capabilities.
 * 
 * @returns JSX element representing the billing reports page
 */
export default function BillingReportsPage() {
  // State
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('month');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics>({
    totalRevenue: 0,
    previousPeriodRevenue: 0,
    revenueGrowth: 0,
    averageInvoiceValue: 0,
    collectionRate: 0,
    outstandingBalance: 0
  });
  const [paymentMetrics, setPaymentMetrics] = useState<PaymentMetrics>({
    totalPayments: 0,
    paymentVolume: 0,
    averagePaymentTime: 0,
    paymentMethods: [],
    refundRate: 0,
    chargebackRate: 0
  });
  const { toast } = useToast();

  /**
   * Load analytics data from API
   */
  useEffect(() => {
    const loadReportsData = async () => {
      setLoading(true);
      
      try {
        // Calculate date range based on selected period
        const now = new Date();
        let startDate: string | undefined;
        let endDate: string | undefined;
        
        if (selectedPeriod === 'custom' && dateRange.start && dateRange.end) {
          startDate = dateRange.start;
          endDate = dateRange.end;
        } else if (selectedPeriod !== 'custom') {
          endDate = now.toISOString();
          const start = new Date(now);
          
          switch (selectedPeriod) {
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
        
        // Fetch billing analytics
        const billingAnalytics = await billingApi.getBillingAnalytics(startDate, endDate);
        
        // Fetch payment analytics
        const paymentAnalytics = await billingApi.getPaymentAnalytics(startDate, endDate);
        
        // Convert billing analytics to revenue metrics format
        setRevenueMetrics({
          totalRevenue: billingAnalytics.totalRevenue,
          previousPeriodRevenue: billingAnalytics.monthlyRevenue, // This would need proper calculation
          revenueGrowth: 0, // Would need to calculate from historical data
          averageInvoiceValue: billingAnalytics.averageInvoiceValue,
          collectionRate: billingAnalytics.collectionRate,
          outstandingBalance: billingAnalytics.outstandingBalance
        });
        
        // Convert payment analytics to payment metrics format
        setPaymentMetrics({
          totalPayments: paymentAnalytics.totalPayments,
          paymentVolume: paymentAnalytics.totalAmount,
          averagePaymentTime: paymentAnalytics.averagePaymentTime,
          paymentMethods: paymentAnalytics.paymentMethods.map(pm => ({
            method: pm.method,
            amount: pm.amount,
            percentage: (pm.amount / paymentAnalytics.totalAmount) * 100
          })),
          refundRate: paymentAnalytics.refundRate,
          chargebackRate: paymentAnalytics.chargebackRate
        });
        
      } catch (error) {
        console.error('Failed to load billing analytics:', error);
        toast({
          title: 'Error',
          description: 'Failed to load billing analytics. Please try again.',
          variant: 'destructive',
        });
        
        // Set empty state on error
        setRevenueMetrics({
          totalRevenue: 0,
          previousPeriodRevenue: 0,
          revenueGrowth: 0,
          averageInvoiceValue: 0,
          collectionRate: 0,
          outstandingBalance: 0
        });
        setPaymentMetrics({
          totalPayments: 0,
          paymentVolume: 0,
          averagePaymentTime: 0,
          paymentMethods: [],
          refundRate: 0,
          chargebackRate: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadReportsData();
  }, [selectedPeriod, dateRange, toast]);

  /**
   * Handle period change
   */
  const handlePeriodChange = (period: ReportPeriod) => {
    setSelectedPeriod(period);
    
    // Clear custom date range if not custom period
    if (period !== 'custom') {
      setDateRange({ start: '', end: '' });
    }
  };

  /**
   * Handle date range change
   */
  const handleDateRangeChange = (range: { start: string; end: string }) => {
    setDateRange(range);
  };

  /**
   * Handle chart type change
   */
  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };

  /**
   * Handle report export
   */
  const handleExportReport = (format: string) => {
    // In a real application, this would trigger the actual export
    console.log(`Exporting report in ${format} format...`);
    
    // Simulate export process
    const filename = `billing-report-${selectedPeriod}-${new Date().getTime()}.${format}`;
    
    // Show success message (in real app, this would be a toast notification)
    alert(`Report exported successfully as ${filename}`);
  };

  /**
   * Handle data refresh
   */
  const handleRefresh = () => {
    // Force re-fetch by triggering the useEffect
    setSelectedPeriod(selectedPeriod); // This will trigger the useEffect to reload data
  };

  /**
   * Handle viewing detailed report
   */
  const handleViewDetailedReport = (reportType: string) => {
    // In a real application, this would navigate to detailed report page
    console.log(`Viewing detailed ${reportType} report...`);
    
    // Show placeholder message
    alert(`Opening detailed ${reportType} report...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BillingReports
        revenueMetrics={revenueMetrics}
        paymentMetrics={paymentMetrics}
        loading={loading}
        selectedPeriod={selectedPeriod}
        dateRange={dateRange}
        chartType={chartType}
        onPeriodChange={handlePeriodChange}
        onDateRangeChange={handleDateRangeChange}
        onChartTypeChange={handleChartTypeChange}
        onExportReport={handleExportReport}
        onRefresh={handleRefresh}
        onViewDetailedReport={handleViewDetailedReport}
      />
    </div>
  );
}
