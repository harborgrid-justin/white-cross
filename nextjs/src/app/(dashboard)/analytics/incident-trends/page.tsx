/**
 * Incident Trends Analytics Page
 */

'use client';

import { useState } from 'react';
import { IncidentTrendChart } from '@/components/analytics/IncidentTrendChart';
import { DataExporter } from '@/components/analytics/DataExporter';
import { Download, Filter, RefreshCw } from 'lucide-react';

export default function IncidentTrendsPage() {
  const [view, setView] = useState<'total' | 'byType' | 'bySeverity'>('total');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [showExporter, setShowExporter] = useState(false);

  const trendData = Array.from({ length: 30 }, (_, i) => {
    const total = Math.floor(5 + Math.random() * 15);
    return {
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      total,
      byType: {
        Injury: Math.floor(total * 0.4),
        Illness: Math.floor(total * 0.3),
        Behavioral: Math.floor(total * 0.2),
        Safety: Math.floor(total * 0.1),
      },
      bySeverity: {
        Low: Math.floor(total * 0.5),
        Medium: Math.floor(total * 0.3),
        High: Math.floor(total * 0.15),
        Critical: Math.floor(total * 0.05),
      },
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incident Trends</h1>
          <p className="mt-1 text-sm text-gray-500">
            Identify patterns and high-risk areas
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
        </div>
      </div>

      {/* View Controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Display Options</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">View Mode</label>
            <div className="flex gap-2">
              {(['total', 'byType', 'bySeverity'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    view === v
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {v === 'total' ? 'Total' : v === 'byType' ? 'By Type' : 'By Severity'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Chart Type</label>
            <div className="flex gap-2">
              {(['line', 'area', 'bar'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                    chartType === type
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showExporter && (
        <DataExporter
          data={trendData}
          filename="incident-trends"
          title="Export Incident Data"
        />
      )}

      <IncidentTrendChart
        data={trendData}
        view={view}
        chartType={chartType}
        title="Incident Trends Over Time"
      />
    </div>
  );
}
