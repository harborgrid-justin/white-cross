'use client';

/**
 * Force dynamic rendering for current billing reports
 * PERFORMANCE: Uses lazy loading to reduce initial bundle size (~640+ lines)
 */

import React, { useState, useEffect, Suspense } from 'react';
import { LazyBillingReports, PageSkeleton } from '@/components/lazy';
import { fetchBillingReportsDashboardData, type ReportPeriod, type RevenueMetrics, type PaymentMetrics } from './data';
import { useToast } from '@/hooks/use-toast';

/**
 * Report chart types
 */
type ChartType = 'line' | 'bar' | 'pie' | 'area';

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
        const customRange = selectedPeriod === 'custom' && dateRange.start && dateRange.end 
          ? dateRange 
          : undefined;
        
        const { revenueMetrics: revenueData, paymentMetrics: paymentData, error } = 
          await fetchBillingReportsDashboardData(selectedPeriod, customRange);
        
        setRevenueMetrics(revenueData);
        setPaymentMetrics(paymentData);
        
        if (error) {
          toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
          });
        }
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
      <Suspense fallback={<PageSkeleton />}>
        <LazyBillingReports
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
      </Suspense>
    </div>
  );
}
