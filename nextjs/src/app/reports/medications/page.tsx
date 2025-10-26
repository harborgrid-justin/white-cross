/**
 * Medications Reports Page
 *
 * Comprehensive medication administration tracking and compliance reporting.
 *
 * @module app/reports/medications/page
 */

'use client';

import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/domains/reports';
import {
  MultiSeriesLineChart,
  StackedBarChart,
  GaugeChart,
  FunnelChart
} from '@/components/ui/charts';
import type { DateRange } from '@/types/schemas/reports.schema';

export default function MedicationsReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    period: 'last-30-days'
  });

  const { data: medicationData, isLoading } = useAnalytics({
    type: 'medications',
    dateRange,
    includeComparison: true
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medication Reports</h1>
          <p className="text-gray-600 mt-1">
            Administration tracking and compliance monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Schedule Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Total Administrations</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {medicationData?.summary?.total.toLocaleString() || '0'}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-green-600">
              +{medicationData?.summary?.percentageChange || 0}%
            </span>
            <span className="text-xs text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <GaugeChart
            value={94.5}
            min={0}
            max={100}
            title="Compliance Rate"
            unit="%"
            size={140}
            colorZones={[
              { min: 0, max: 70, color: '#EF4444', label: 'Low' },
              { min: 70, max: 90, color: '#F59E0B', label: 'Med' },
              { min: 90, max: 100, color: '#10B981', label: 'High' }
            ]}
          />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Missed Doses</div>
          <div className="text-3xl font-bold text-red-600 mt-2">23</div>
          <div className="text-xs text-gray-500 mt-2">requires follow-up</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Adverse Reactions</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">3</div>
          <div className="text-xs text-gray-500 mt-2">reported this month</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Administration Trends */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <MultiSeriesLineChart
            config={{
              title: 'Medication Administration Trends',
              xAxis: { field: 'date', label: 'Date' },
              yAxis: { label: 'Count' },
              series: [
                { name: 'Scheduled', field: 'scheduled', color: '#3B82F6' },
                { name: 'Administered', field: 'administered', color: '#10B981' },
                { name: 'Missed', field: 'missed', color: '#EF4444' }
              ]
            }}
            data={medicationData?.data || []}
            showBrush
          />
        </div>

        {/* Medication Type Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <StackedBarChart
            config={{
              title: 'Medications by Type',
              xAxis: { field: 'type', label: 'Medication Type' },
              yAxis: { label: 'Count' },
              series: [
                { name: 'Daily', field: 'daily', color: '#3B82F6' },
                { name: 'As Needed', field: 'asNeeded', color: '#10B981' },
                { name: 'Emergency', field: 'emergency', color: '#EF4444' }
              ]
            }}
            data={[
              { type: 'Pain Relief', daily: 45, asNeeded: 123, emergency: 8 },
              { type: 'Allergy', daily: 67, asNeeded: 89, emergency: 23 },
              { type: 'Asthma', daily: 89, asNeeded: 45, emergency: 12 },
              { type: 'Other', daily: 34, asNeeded: 67, emergency: 5 }
            ]}
          />
        </div>

        {/* Compliance Funnel */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 col-span-2">
          <FunnelChart
            title="Medication Administration Funnel"
            data={[
              { name: 'Scheduled', value: 1000 },
              { name: 'Student Present', value: 950 },
              { name: 'Consented', value: 920 },
              { name: 'Administered', value: 895 },
              { name: 'Documented', value: 890 }
            ]}
            showPercentages
            showValues
          />
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Administration Details
          </h3>
          <input
            type="text"
            placeholder="Search medications..."
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date/Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Medication
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Administered By
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
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
