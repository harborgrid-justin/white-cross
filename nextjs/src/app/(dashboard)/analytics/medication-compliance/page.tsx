/**
 * Medication Compliance Analytics Page
 */

'use client';

import { useState, useEffect } from 'react';
import { MedicationComplianceChart } from '@/components/analytics/MedicationComplianceChart';
import { DataExporter } from '@/components/analytics/DataExporter';
import { getMedicationCompliance } from '@/lib/actions/analytics.actions';
import { Download, Filter, RefreshCw } from 'lucide-react';

export default function MedicationCompliancePage() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });
  const [data, setData] = useState({
    administered: 842,
    missed: 48,
    pending: 23,
    total: 913,
  });
  const [trendData, setTrendData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExporter, setShowExporter] = useState(false);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Mock trend data
      const mockTrend = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        complianceRate: 90 + Math.random() * 10,
      }));

      setTrendData(mockTrend);
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medication Compliance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor medication administration rates and identify trends
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExporter(!showExporter)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>

          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
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
        </div>
      </div>

      {showExporter && (
        <DataExporter
          data={trendData}
          filename="medication-compliance"
          title="Export Compliance Data"
          pdfOptions={{
            title: 'Medication Compliance Report',
            subtitle: `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`,
          }}
        />
      )}

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <MedicationComplianceChart data={data} trendData={trendData} />
        )}
      </div>
    </div>
  );
}
