/**
 * SeverityChart Component
 *
 * Production-grade pie/donut chart showing incident distribution by severity level.
 * Interactive chart with click-to-filter functionality and responsive design.
 *
 * @example
 * ```tsx
 * <SeverityChart
 *   data={[
 *     { severity: 'LOW', count: 10 },
 *     { severity: 'MEDIUM', count: 15 },
 *     { severity: 'HIGH', count: 8 },
 *     { severity: 'CRITICAL', count: 3 }
 *   ]}
 *   onSeverityClick={(severity) => filterBySeverity(severity)}
 * />
 * ```
 */

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { IncidentSeverity } from '@/types/incidents';

interface SeverityChartProps {
  data: { severity: string; count: number }[];
  onSeverityClick?: (severity: IncidentSeverity) => void;
  className?: string;
}

interface ChartDataPoint {
  name: string;
  value: number;
  severity: IncidentSeverity;
  color: string;
}

// Color mapping for severity levels
const SEVERITY_COLORS: Record<string, string> = {
  LOW: '#10B981',      // green-500
  MEDIUM: '#F59E0B',   // amber-500
  HIGH: '#EF4444',     // red-500
  CRITICAL: '#991B1B', // red-800
};

// Display labels for severity levels
const SEVERITY_LABELS: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

/**
 * Custom tooltip component for the pie chart
 */
const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
      <p className="text-sm font-semibold text-gray-900">{data.name}</p>
      <p className="text-sm text-gray-600">
        Count: <span className="font-medium">{data.value}</span>
      </p>
    </div>
  );
};

/**
 * SeverityChart component - Displays incident distribution by severity
 *
 * Features:
 * - Interactive pie/donut chart
 * - Color-coded segments by severity level
 * - Click to filter functionality
 * - Responsive design
 * - Accessible tooltips and labels
 * - Empty state handling
 */
const SeverityChart: React.FC<SeverityChartProps> = React.memo(({
  data,
  onSeverityClick,
  className = ''
}) => {
  // Transform data for chart consumption with memoization
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data
      .filter(item => item.count > 0) // Only show non-zero counts
      .map(item => ({
        name: SEVERITY_LABELS[item.severity] || item.severity,
        value: item.count,
        severity: item.severity as IncidentSeverity,
        color: SEVERITY_COLORS[item.severity] || '#6B7280',
      }));
  }, [data]);

  // Calculate total for percentage display
  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  // Handle segment click
  const handleClick = React.useCallback((data: ChartDataPoint) => {
    if (onSeverityClick) {
      onSeverityClick(data.severity);
    }
  }, [onSeverityClick]);

  // Empty state
  if (!chartData || chartData.length === 0) {
    return (
      <div className={`severity-chart ${className}`}>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Severity Distribution
          </h3>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="mt-2 text-sm">No incident data available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`severity-chart ${className}`}>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Severity Distribution
          </h3>
          <span className="text-sm text-gray-500">
            Total: {total}
          </span>
        </div>

        <div className="h-80" role="img" aria-label={`Pie chart showing incident distribution by severity. Total incidents: ${total}`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                onClick={handleClick}
                style={{ cursor: onSeverityClick ? 'pointer' : 'default' }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-sm text-gray-700">
                    {value} ({entry.payload.value})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {onSeverityClick && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Click a segment to filter incidents by severity
          </p>
        )}
      </div>
    </div>
  );
});

SeverityChart.displayName = 'SeverityChart';

export default SeverityChart;
