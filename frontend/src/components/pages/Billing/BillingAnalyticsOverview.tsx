'use client';

import React from 'react';
import { BarChart3, Eye } from 'lucide-react';
import { formatValue, getTrendIcon, getTrendColor } from './BillingAnalytics.utils';
import type { AnalyticsMetric, PaymentMethodStats } from './BillingAnalytics.types';

interface BillingAnalyticsOverviewProps {
  metrics: AnalyticsMetric[];
  paymentMethods: PaymentMethodStats[];
  onViewDetailedReport?: (type: string) => void;
}

/**
 * BillingAnalyticsOverview Component
 *
 * Overview tab displaying key metrics, revenue trends, and payment methods.
 */
const BillingAnalyticsOverview: React.FC<BillingAnalyticsOverviewProps> = ({
  metrics,
  paymentMethods,
  onViewDetailedReport,
}) => {
  /**
   * Renders metric card
   */
  const renderMetricCard = (metric: AnalyticsMetric) => {
    const Icon = metric.icon;
    const trendIcon = getTrendIcon(metric.trend, metric.changePercentage);
    const trendColor = getTrendColor(metric.trend);

    return (
      <div key={metric.id} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-gray-50">
            <Icon className={`w-6 h-6 ${metric.color}`} />
          </div>
          <div className="flex items-center space-x-1">
            {trendIcon}
            <span className={`text-sm font-medium ${trendColor}`}>
              {Math.abs(metric.changePercentage).toFixed(1)}%
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatValue(metric.value, metric.format)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            vs {formatValue(metric.previousValue, metric.format)} previous period
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map(renderMetricCard)}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
          <button
            onClick={() => onViewDetailedReport?.('revenue')}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600
                     bg-green-50 border border-green-200 rounded hover:bg-green-100"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </button>
        </div>

        {/* Simplified chart visualization */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Revenue chart visualization</p>
            <p className="text-sm text-gray-500">Integration with chart library required</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <button
            onClick={() => onViewDetailedReport?.('payments')}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600
                     bg-green-50 border border-green-200 rounded hover:bg-green-100"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div key={method.method} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${method.color.replace('bg-', 'bg-').replace('-500', '-100')}`}>
                    <Icon className={`w-4 h-4 ${method.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{method.method}</p>
                    <p className="text-sm text-gray-500">{method.count} transactions</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatValue(method.amount, 'currency')}
                  </p>
                  <p className="text-sm text-gray-500">{method.percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BillingAnalyticsOverview;
