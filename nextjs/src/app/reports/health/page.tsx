/**
 * Health Reports Page
 *
 * Comprehensive health metrics and trend analysis including:
 * - Clinic visit statistics
 * - Health condition trends
 * - Vital signs analysis
 * - Immunization compliance
 * - Screening results
 *
 * @module app/reports/health/page
 */

'use client';

import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/domains/reports';
import {
  MultiSeriesLineChart,
  StackedBarChart,
  GaugeChart,
  HeatMapChart
} from '@/components/ui/charts';
import type { DateRange, DateGrouping } from '@/types/schemas/reports.schema';

// ============================================================================
// COMPONENT
// ============================================================================

export default function HealthReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    period: 'last-30-days'
  });
  const [groupBy, setGroupBy] = useState<DateGrouping>('daily');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');

  // Fetch analytics data
  const { data: healthTrends, isLoading } = useAnalytics({
    type: 'health',
    dateRange,
    groupBy,
    includeComparison: true
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Reports</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive health metrics and trend analysis
          </p>
        </div>

        {/* Export Button */}
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={dateRange.period || ''}
              onChange={(e) => setDateRange({ period: e.target.value as any })}
            >
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-90-days">Last 90 Days</option>
              <option value="this-month">This Month</option>
              <option value="this-year">This Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group By
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as DateGrouping)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
            >
              <option value="all">All Schools</option>
              <option value="elementary">Elementary School</option>
              <option value="middle">Middle School</option>
              <option value="high">High School</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Total Clinic Visits</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {healthTrends?.summary?.total.toLocaleString() || '0'}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-green-600">
              +{healthTrends?.summary?.percentageChange || 0}%
            </span>
            <span className="text-xs text-gray-500">vs previous period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Daily Average</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {healthTrends?.summary?.average.toFixed(1) || '0'}
          </div>
          <div className="text-xs text-gray-500 mt-2">visits per day</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Peak Day</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {healthTrends?.summary?.max || '0'}
          </div>
          <div className="text-xs text-gray-500 mt-2">maximum visits</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <GaugeChart
            value={87}
            min={0}
            max={100}
            title="Health Score"
            unit="%"
            size={140}
            colorZones={[
              { min: 0, max: 60, color: '#EF4444' },
              { min: 60, max: 85, color: '#F59E0B' },
              { min: 85, max: 100, color: '#10B981' }
            ]}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Health Trends */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <MultiSeriesLineChart
            config={{
              title: 'Health Visit Trends',
              xAxis: { field: 'date', label: 'Date' },
              yAxis: { label: 'Number of Visits' },
              series: [
                { name: 'Clinic Visits', field: 'visits', color: '#3B82F6' },
                { name: 'Medication Administrations', field: 'medications', color: '#10B981' },
                { name: 'Incidents', field: 'incidents', color: '#EF4444' }
              ]
            }}
            data={healthTrends?.data || []}
            showBrush
          />
        </div>

        {/* Condition Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <StackedBarChart
            config={{
              title: 'Conditions by Category',
              xAxis: { field: 'category', label: 'Category' },
              yAxis: { label: 'Count' },
              series: [
                { name: 'Chronic', field: 'chronic', color: '#EF4444' },
                { name: 'Acute', field: 'acute', color: '#F59E0B' },
                { name: 'Allergies', field: 'allergies', color: '#3B82F6' }
              ]
            }}
            data={[
              { category: 'Respiratory', chronic: 45, acute: 23, allergies: 67 },
              { category: 'Digestive', chronic: 12, acute: 34, allergies: 8 },
              { category: 'Skin', chronic: 8, acute: 45, allergies: 89 },
              { category: 'Other', chronic: 23, acute: 12, allergies: 34 }
            ]}
            showPercentage
          />
        </div>

        {/* Visit Pattern Heatmap */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 col-span-2">
          <HeatMapChart
            title="Visit Patterns by Day and Hour"
            data={[
              { x: 'Monday', y: '8AM', value: 12 },
              { x: 'Monday', y: '9AM', value: 23 },
              { x: 'Monday', y: '10AM', value: 45 },
              { x: 'Tuesday', y: '8AM', value: 18 },
              { x: 'Tuesday', y: '9AM', value: 34 },
              { x: 'Tuesday', y: '10AM', value: 56 },
              // Add more data points
            ]}
            colorScheme="blue"
            showValues
          />
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Health Records
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action Taken
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Table rows would be rendered here */}
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {isLoading ? 'Loading...' : 'No records found'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
