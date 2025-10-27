/**
 * Data Export Page
 * Bulk export functionality for analytics data
 */

'use client';

import { useState } from 'react';
import { DataExporter } from '@/components/analytics/DataExporter';
import { Download, Calendar, Database, Filter } from 'lucide-react';

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";


export default function ExportPage() {
  const [selectedDataset, setSelectedDataset] = useState<string>('health-metrics');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });

  const datasets = [
    {
      id: 'health-metrics',
      name: 'Health Metrics',
      description: 'All health measurements and vital signs',
      recordCount: 2847,
    },
    {
      id: 'medication-compliance',
      name: 'Medication Compliance',
      description: 'Medication administration records',
      recordCount: 913,
    },
    {
      id: 'appointments',
      name: 'Appointments',
      description: 'Appointment history and analytics',
      recordCount: 1245,
    },
    {
      id: 'incidents',
      name: 'Incident Reports',
      description: 'All incident reports and follow-ups',
      recordCount: 342,
    },
    {
      id: 'inventory',
      name: 'Inventory',
      description: 'Medication inventory and usage',
      recordCount: 2090,
    },
  ];

  // Mock data for selected dataset
  const getMockData = (datasetId: string) => {
    switch (datasetId) {
      case 'health-metrics':
        return Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          studentName: `Student ${i + 1}`,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          metricType: ['Blood Pressure', 'Heart Rate', 'Temperature'][i % 3],
          value: (70 + Math.random() * 30).toFixed(1),
        }));
      case 'medication-compliance':
        return Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          studentName: `Student ${i + 1}`,
          medication: `Medication ${(i % 10) + 1}`,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: ['Administered', 'Missed', 'Pending'][i % 3],
        }));
      default:
        return [];
    }
  };

  const selectedDatasetInfo = datasets.find((d) => d.id === selectedDataset);
  const exportData = getMockData(selectedDataset);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
        <p className="mt-1 text-sm text-gray-500">
          Export analytics data in multiple formats for external analysis
        </p>
      </div>

      {/* Dataset Selection */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Select Dataset</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets.map((dataset) => (
            <button
              key={dataset.id}
              onClick={() => setSelectedDataset(dataset.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedDataset === dataset.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">{dataset.name}</div>
              <div className="text-sm text-gray-500 mt-1">{dataset.description}</div>
              <div className="text-xs text-gray-400 mt-2">
                {dataset.recordCount.toLocaleString()} records
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Export Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date Range</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start.toISOString().split('T')[0]}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: new Date(e.target.value) }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.end.toISOString().split('T')[0]}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: new Date(e.target.value) }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Options</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <span className="text-sm text-gray-700">Include metadata</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">De-identify data (remove PHI)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Export Summary */}
      {selectedDatasetInfo && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Download className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">Ready to Export</div>
              <div className="text-sm text-blue-700 mt-1">
                {selectedDatasetInfo.name} • {exportData.length.toLocaleString()} records •{' '}
                {dateRange.start.toLocaleDateString()} to {dateRange.end.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Exporter */}
      <DataExporter
        data={exportData}
        filename={`${selectedDataset}_export`}
        title="Export Options"
        pdfOptions={{
          title: selectedDatasetInfo?.name || 'Data Export',
          subtitle: `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`,
          footer: 'Confidential - White Cross Healthcare System',
        }}
      />

      {/* HIPAA Notice */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-3">
          <svg
            className="h-5 w-5 text-yellow-600 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <div className="font-medium text-yellow-900">HIPAA Compliance Notice</div>
            <div className="text-sm text-yellow-700 mt-1">
              This export may contain Protected Health Information (PHI). Ensure proper handling,
              storage, and transmission according to HIPAA regulations. All exports are logged for
              audit purposes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
