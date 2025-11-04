/**
 * @fileoverview Incident Trends Analytics Page
 *
 * Analyzes incident report patterns across multiple dimensions including type
 * (Injury, Illness, Behavioral, Safety), severity levels, and temporal trends.
 * Enables identification of high-risk areas and prevention opportunities.
 *
 * @module app/(dashboard)/analytics/incident-trends/page
 *
 * @remarks
 * Incident analysis dimensions:
 * - Total incidents over time
 * - By Type: Injury, Illness, Behavioral, Safety
 * - By Severity: Low, Medium, High, Critical
 * - Temporal patterns: Daily, weekly, monthly trends
 *
 * Visualization options:
 * - Chart types: Line, Area, Bar
 * - View modes: Total, By Type, By Severity
 * - Interactive controls for switching between views
 *
 * Use cases:
 * - Identify seasonal patterns (e.g., flu season illness spikes)
 * - Spot high-risk areas requiring intervention
 * - Track effectiveness of safety programs
 * - Support accreditation and regulatory reporting
 *
 * Performance:
 * - Client Component for interactive chart controls
 * - Custom IncidentTrendChart with multiple visualization modes
 * - Efficient state management for view switching
 * - Export functionality for reports and presentations
 *
 * HIPAA compliance:
 * - Aggregated incident data (no student identifiers)
 * - Count-based analytics only
 * - No PHI exposed in charts or exports
 * - Access logged for security audits
 *
 * Safety considerations:
 * - High incident rates trigger alerts (in production)
 * - Critical severity incidents flagged for immediate review
 * - Trend analysis supports proactive safety measures
 *
 * @example
 * ```tsx
 * // Route: /analytics/incident-trends
 * // Safety coordinator workflow:
 * // 1. View 30-day incident trends (12 this week)
 * // 2. Switch to "By Type" to identify patterns
 * // 3. Notice spike in behavioral incidents
 * // 4. Export report to inform intervention planning
 * ```
 *
 * @see {@link /analytics} - Main analytics dashboard
 * @see {@link /incidents} - Incident management
 */

'use client';

import { useState, Suspense } from 'react';
import { LazyIncidentTrendChart, ChartSkeleton } from '@/components/lazy';
import { DataExporter } from '@/components/analytics/DataExporter';
import { Download, Filter, RefreshCw } from 'lucide-react';

/**
 * Force dynamic rendering for real-time incident data
 *
 * @type {"force-dynamic"}
 */


/**
 * Incident Trends Analytics Page Component
 *
 * Interactive dashboard for analyzing incident patterns with multiple view modes
 * and chart type options. Supports export for safety reviews and reporting.
 *
 * @returns {JSX.Element} Incident trends analytics page
 *
 * @remarks
 * Component structure:
 * 1. Header with title and export button
 * 2. Display Options: View mode and chart type selectors
 * 3. IncidentTrendChart: Customizable trend visualization
 *
 * State management:
 * - `view`: View mode - 'total' | 'byType' | 'bySeverity'
 * - `chartType`: Chart visualization - 'line' | 'area' | 'bar'
 * - `showExporter`: Toggle for DataExporter component
 *
 * Data structure:
 * ```typescript
 * trendData: Array<{
 *   date: string,         // "Jan 15"
 *   total: number,        // Total incidents that day
 *   byType: {
 *     Injury: number,     // ~40% of total
 *     Illness: number,    // ~30% of total
 *     Behavioral: number, // ~20% of total
 *     Safety: number      // ~10% of total
 *   },
 *   bySeverity: {
 *     Low: number,        // ~50% of total
 *     Medium: number,     // ~30% of total
 *     High: number,       // ~15% of total
 *     Critical: number    // ~5% of total
 *   }
 * }>
 * ```
 *
 * View modes:
 * - **Total**: Overall incident count trend
 * - **By Type**: Separate lines for each incident type
 * - **By Severity**: Separate lines for each severity level
 *
 * Chart types:
 * - **Line**: Best for trend analysis over time
 * - **Area**: Emphasizes volume and cumulative impact
 * - **Bar**: Best for comparing discrete time periods
 *
 * Mock data generation:
 * - 30 days of incident data
 * - 5-20 incidents per day (random)
 * - Realistic distribution across types and severities
 *
 * @example
 * ```tsx
 * // User workflow:
 * // 1. Select "By Type" view mode
 * // 2. Choose "Area" chart type for visual impact
 * // 3. Observe injury incidents increasing over time
 * // 4. Export data to inform safety committee meeting
 * ```
 */
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

      <Suspense fallback={<ChartSkeleton />}>
        <LazyIncidentTrendChart
          data={trendData}
          view={view}
          chartType={chartType}
          title="Incident Trends Over Time"
        />
      </Suspense>
    </div>
  );
}
