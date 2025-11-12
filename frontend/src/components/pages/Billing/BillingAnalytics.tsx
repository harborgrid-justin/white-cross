'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import BillingAnalyticsHeader from './BillingAnalyticsHeader';
import BillingAnalyticsOverview from './BillingAnalyticsOverview';
import BillingAnalyticsTrends from './BillingAnalyticsTrends';
import BillingAnalyticsCollections from './BillingAnalyticsCollections';
import BillingAnalyticsPatients from './BillingAnalyticsPatients';
import {
  DEFAULT_METRICS,
  DEFAULT_CHART_DATA,
  DEFAULT_PAYMENT_METHODS,
  DEFAULT_COLLECTION_PERFORMANCE,
  DEFAULT_TOP_PATIENTS,
} from './BillingAnalytics.constants';
import type { BillingAnalyticsProps, AnalyticsTab } from './BillingAnalytics.types';

/**
 * BillingAnalytics Component
 *
 * A comprehensive analytics dashboard for billing data with revenue insights,
 * payment trends, collection performance, and detailed financial metrics.
 * Features interactive charts, KPI tracking, and performance analysis.
 *
 * @param props - BillingAnalytics component props
 * @returns JSX element representing the billing analytics dashboard
 */
const BillingAnalytics: React.FC<BillingAnalyticsProps> = ({
  metrics = DEFAULT_METRICS,
  chartData = DEFAULT_CHART_DATA,
  paymentMethods = DEFAULT_PAYMENT_METHODS,
  collectionPerformance = DEFAULT_COLLECTION_PERFORMANCE,
  topPatients = DEFAULT_TOP_PATIENTS,
  dateRange = 'last-6-months',
  loading = false,
  className = '',
  onDateRangeChange,
  onRefresh,
  onExportData,
  onViewDetailedReport,
  onSettings,
}) => {
  // State
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');

  // Loading state
  if (loading) {
    return (
      <div className={`bg-white min-h-screen ${className}`}>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      {/* Header with tabs */}
      <BillingAnalyticsHeader
        dateRange={dateRange}
        loading={loading}
        activeTab={activeTab}
        onDateRangeChange={onDateRangeChange}
        onRefresh={onRefresh}
        onExportData={onExportData}
        onSettings={onSettings}
        onTabChange={setActiveTab}
      />

      {/* Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <BillingAnalyticsOverview
            metrics={metrics}
            paymentMethods={paymentMethods}
            onViewDetailedReport={onViewDetailedReport}
          />
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && <BillingAnalyticsTrends />}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <BillingAnalyticsCollections collectionPerformance={collectionPerformance} />
        )}

        {/* Top Patients Tab */}
        {activeTab === 'patients' && <BillingAnalyticsPatients topPatients={topPatients} />}
      </div>
    </div>
  );
};

export default BillingAnalytics;
