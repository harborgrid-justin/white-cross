/**
 * Force dynamic rendering for real-time billing analytics
 */
export const dynamic = 'force-dynamic';

import { BillingAnalytics } from '@/components/pages/Billing';

/**
 * Billing Analytics Page
 * 
 * Comprehensive analytics dashboard for billing data with revenue insights,
 * payment trends, collection performance, and detailed financial metrics.
 */
export default function BillingAnalyticsPage() {
  return (
    <BillingAnalytics
      onDateRangeChange={(range) => {
        console.log('Date range changed:', range);
        // Handle date range change - could update URL params or fetch new data
      }}
      onRefresh={() => {
        console.log('Refreshing analytics data');
        window.location.reload();
      }}
      onExportData={() => {
        console.log('Exporting analytics data');
        // Handle data export - generate CSV, PDF, etc.
      }}
      onViewDetailedReport={(type) => {
        console.log('View detailed report:', type);
        // Navigate to detailed report page or open modal
        window.location.href = `/dashboard/billing/reports?type=${type}`;
      }}
      onSettings={() => {
        console.log('Open analytics settings');
        window.location.href = '/dashboard/billing/settings?tab=analytics';
      }}
    />
  );
}
