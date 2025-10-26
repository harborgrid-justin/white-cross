/**
 * TypeDistribution Component
 *
 * Production-grade bar chart showing incident distribution by type.
 * Displays horizontal bars sorted by frequency with color coding.
 *
 * @example
 * ```tsx
 * <TypeDistribution
 *   data={[
 *     { type: 'INJURY', count: 25 },
 *     { type: 'ILLNESS', count: 18 },
 *     { type: 'BEHAVIORAL', count: 12 }
 *   ]}
 *   onTypeClick={(type) => filterByType(type)}
 * />
 * ```
 */

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { IncidentType } from '@/types/incidents';

interface TypeDistributionProps {
  data: { type: string; count: number }[];
  onTypeClick?: (type: IncidentType) => void;
  className?: string;
}

interface ChartDataPoint {
  name: string;
  count: number;
  type: IncidentType;
  color: string;
}

// Color mapping for incident types
const TYPE_COLORS: Record<string, string> = {
  INJURY: '#EF4444',            // red-500
  ILLNESS: '#F59E0B',           // amber-500
  BEHAVIORAL: '#8B5CF6',        // violet-500
  MEDICATION_ERROR: '#EC4899',  // pink-500
  ALLERGIC_REACTION: '#DC2626', // red-600
  EMERGENCY: '#991B1B',         // red-800
  OTHER: '#6B7280',             // gray-500
};

// Display labels for incident types
const TYPE_LABELS: Record<string, string> = {
  INJURY: 'Injury',
  ILLNESS: 'Illness',
  BEHAVIORAL: 'Behavioral',
  MEDICATION_ERROR: 'Medication Error',
  ALLERGIC_REACTION: 'Allergic Reaction',
  EMERGENCY: 'Emergency',
  OTHER: 'Other',
};

/**
 * Custom tooltip component for the bar chart
 */
const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
      <p className="text-sm font-semibold text-gray-900">{data.name}</p>
      <p className="text-sm text-gray-600">
        Count: <span className="font-medium">{data.count}</span>
      </p>
    </div>
  );
};

/**
 * TypeDistribution component - Displays incident distribution by type
 *
 * Features:
 * - Horizontal bar chart sorted by frequency
 * - Color-coded bars by incident type
 * - Click to filter functionality
 * - Responsive design
 * - Accessible tooltips and labels
 * - Empty state handling
 */
const TypeDistribution: React.FC<TypeDistributionProps> = React.memo(({
  data,
  onTypeClick,
  className = ''
}) => {
  // Transform and sort data for chart consumption with memoization
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data
      .filter(item => item.count > 0) // Only show non-zero counts
      .map(item => ({
        name: TYPE_LABELS[item.type] || item.type,
        count: item.count,
        type: item.type as IncidentType,
        color: TYPE_COLORS[item.type] || '#6B7280',
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [data]);

  // Calculate total for display
  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0);
  }, [chartData]);

  // Handle bar click
  const handleBarClick = React.useCallback((data: ChartDataPoint) => {
    if (onTypeClick) {
      onTypeClick(data.type);
    }
  }, [onTypeClick]);

  // Empty state
  if (!chartData || chartData.length === 0) {
    return (
      <div className={`type-distribution ${className}`}>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Incident Type Distribution
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
    <div className={`type-distribution ${className}`}>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Incident Type Distribution
          </h3>
          <span className="text-sm text-gray-500">
            Total: {total}
          </span>
        </div>

        <div
          className="h-80"
          role="img"
          aria-label={`Bar chart showing incident distribution by type. Total incidents: ${total}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#6B7280"
                width={150}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
                onClick={handleBarClick}
                style={{ cursor: onTypeClick ? 'pointer' : 'default' }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {onTypeClick && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Click a bar to filter incidents by type
          </p>
        )}
      </div>
    </div>
  );
});

TypeDistribution.displayName = 'TypeDistribution';

export default TypeDistribution;
