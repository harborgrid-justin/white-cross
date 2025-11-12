'use client';

import React from 'react';
import { formatValue } from './BillingAnalytics.utils';
import type { CollectionPerformance } from './BillingAnalytics.types';

interface BillingAnalyticsCollectionsProps {
  collectionPerformance: CollectionPerformance[];
}

/**
 * BillingAnalyticsCollections Component
 *
 * Collections tab displaying collection performance metrics.
 */
const BillingAnalyticsCollections: React.FC<BillingAnalyticsCollectionsProps> = ({
  collectionPerformance,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {collectionPerformance.map((performance, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{performance.period}</h4>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Invoiced</span>
                <span className="font-medium">{formatValue(performance.totalInvoiced, 'currency')}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Collected</span>
                <span className="font-medium">{formatValue(performance.totalCollected, 'currency')}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Collection Rate</span>
                <span className="font-medium text-green-600">{performance.collectionRate}%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Days to Collect</span>
                <span className="font-medium">{performance.averageDaysToCollect} days</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Outstanding</span>
                <span className="font-medium text-orange-600">{formatValue(performance.outstandingAmount, 'currency')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillingAnalyticsCollections;
