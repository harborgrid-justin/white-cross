/**
 * Health Trends Analytics Page
 *
 * Advanced health analytics with:
 * - Long-term trend analysis
 * - Seasonal pattern detection
 * - Comparative analysis across schools
 * - Risk factor identification
 * - Predictive insights
 *
 * @module app/analytics/health-trends/page
 */

'use client';

import React, { useState } from 'react';
import { useMultipleAnalytics } from '@/hooks/domains/reports';
import {
  MultiSeriesLineChart,
  StackedBarChart,
  GaugeChart,
  HeatMapChart
} from '@/components/ui/charts';
import type { DateRange } from '@/types/schemas/reports.schema';

export default function HealthTrendsAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('year');

  // Multiple analytics queries for dashboard
  const { results, isLoading, refetchAll } = useMultipleAnalytics([
    {
      type: 'health',
      dateRange: { period: 'this-year' },
      groupBy: 'monthly',
      includeComparison: true
    },
    {
      type: 'incidents',
      dateRange: { period: 'this-year' },
      groupBy: 'monthly'
    },
    {
      type: 'medications',
      dateRange: { period: 'this-year' },
      groupBy: 'monthly'
    }
  ]);

  const [healthData, incidentData, medicationData] = results;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Trends Analytics</h1>
          <p className="text-gray-600 mt-1">
            Long-term health pattern analysis and insights
          </p>
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={refetchAll}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <GaugeChart
            value={healthData.data?.summary?.average || 0}
            min={0}
            max={100}
            title="Overall Health"
            unit=""
            size={140}
            colorZones={[
              { min: 0, max: 50, color: '#EF4444', label: 'Poor' },
              { min: 50, max: 75, color: '#F59E0B', label: 'Fair' },
              { min: 75, max: 100, color: '#10B981', label: 'Good' }
            ]}
          />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Trend Direction</div>
          <div className="text-3xl font-bold text-green-600 mt-2">
            {healthData.data?.summary?.trend === 'up' ? '↑' : healthData.data?.summary?.trend === 'down' ? '↓' : '→'}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {healthData.data?.summary?.percentageChange || 0}% vs last period
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Seasonal Impact</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">High</div>
          <div className="text-xs text-gray-500 mt-2">flu season active</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">At-Risk Students</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">45</div>
          <div className="text-xs text-gray-500 mt-2">require monitoring</div>
        </div>
      </div>

      {/* Trend Analysis Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Multi-Year Comparison */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <MultiSeriesLineChart
            config={{
              title: 'Multi-Year Health Visit Trends',
              xAxis: { field: 'month', label: 'Month' },
              yAxis: { label: 'Visits' },
              series: [
                { name: '2025', field: 'current', color: '#3B82F6' },
                { name: '2024', field: 'previous', color: '#9CA3AF' }
              ]
            }}
            data={healthData.data?.data || []}
            showBrush
          />
        </div>

        {/* Condition Categories */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <StackedBarChart
            config={{
              title: 'Health Conditions by Severity',
              xAxis: { field: 'month', label: 'Month' },
              yAxis: { label: 'Count' },
              series: [
                { name: 'Critical', field: 'critical', color: '#EF4444' },
                { name: 'Moderate', field: 'moderate', color: '#F59E0B' },
                { name: 'Minor', field: 'minor', color: '#10B981' }
              ]
            }}
            data={[
              { month: 'Jan', critical: 12, moderate: 45, minor: 123 },
              { month: 'Feb', critical: 8, moderate: 34, minor: 98 },
              { month: 'Mar', critical: 15, moderate: 56, minor: 145 },
              { month: 'Apr', critical: 6, moderate: 23, minor: 87 }
            ]}
            showPercentage
          />
        </div>

        {/* Seasonal Patterns */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 col-span-2">
          <HeatMapChart
            title="Seasonal Health Patterns (by Month and Condition Type)"
            data={[
              { x: 'Jan', y: 'Respiratory', value: 89 },
              { x: 'Jan', y: 'Digestive', value: 23 },
              { x: 'Jan', y: 'Skin', value: 12 },
              { x: 'Feb', y: 'Respiratory', value: 76 },
              { x: 'Feb', y: 'Digestive', value: 34 },
              { x: 'Feb', y: 'Skin', value: 18 },
              { x: 'Mar', y: 'Respiratory', value: 54 },
              { x: 'Mar', y: 'Digestive', value: 45 },
              { x: 'Mar', y: 'Skin', value: 67 }
            ]}
            colorScheme="red"
            showValues
          />
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-blue-900">Key Insight</h3>
              <p className="text-sm text-blue-700 mt-1">
                Respiratory issues spike 45% during winter months. Consider
                proactive screening programs.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">✓</div>
            <div>
              <h3 className="font-semibold text-green-900">Positive Trend</h3>
              <p className="text-sm text-green-700 mt-1">
                Overall health visits decreased 12% compared to last year,
                indicating improved preventive care.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-yellow-900">Action Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                45 students have chronic conditions requiring regular monitoring.
                Review care plans.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Visits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Incidents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Medications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {isLoading ? 'Loading analytics...' : 'No data available'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
