'use client';

/**
 * DonutChart Component - Category Breakdown with Center Label
 *
 * A reusable donut chart component (pie chart with inner radius) using recharts.
 * Displays category breakdown with a center label showing total or custom content.
 *
 * @module components/ui/charts/DonutChart
 */

import React, { useMemo, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

// ============================================================================
// TYPES
// ============================================================================

export interface DonutChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutChartDataPoint[];
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  darkMode?: boolean;
  className?: string;
  colors?: string[];
  centerLabel?: string;
  centerValue?: string | number;
  innerRadius?: number;
  outerRadius?: number;
  tooltipFormatter?: (value: number, name: string) => string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * DonutChart Component
 *
 * Features:
 * - Center label for total or custom content
 * - Category breakdown
 * - Interactive segments
 * - Custom colors
 * - Responsive design
 * - Dark mode support
 */
export const DonutChart = React.memo<DonutChartProps>(({
  data,
  height = 300,
  showLegend = true,
  showTooltip = true,
  darkMode = false,
  className = '',
  colors = DEFAULT_COLORS,
  centerLabel,
  centerValue,
  innerRadius = 60,
  outerRadius = 80,
  tooltipFormatter
}) => {
  // Calculate total
  const total = useMemo(() =>
    data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  // Memoize theme colors
  const themeColors = useMemo(() => ({
    text: darkMode ? '#e5e7eb' : '#374151',
    textSecondary: darkMode ? '#9ca3af' : '#6b7280',
    background: darkMode ? '#1f2937' : '#ffffff'
  }), [darkMode]);

  // Custom tooltip component
  const CustomTooltip = useCallback(({ active, payload }: TooltipProps<number, string>) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0];
    const percentage = ((data.value as number / total) * 100).toFixed(1);

    return (
      <div className={`rounded-lg shadow-lg p-3 border ${
        darkMode
          ? 'bg-gray-800 border-gray-700 text-gray-200'
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <p className="font-semibold mb-1">{data.name}</p>
        <div className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.payload.fill }}
          />
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Value:
          </span>
          <span className="font-medium">
            {tooltipFormatter
              ? tooltipFormatter(data.value as number, data.name as string)
              : data.value
            }
          </span>
          <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ({percentage}%)
          </span>
        </div>
      </div>
    );
  }, [darkMode, total, tooltipFormatter]);

  // Center label content
  const displayCenterValue = centerValue !== undefined ? centerValue : total;

  return (
    <div className={`relative ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey="value"
            animationDuration={300}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || colors[index % colors.length]}
              />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && (
            <Legend
              wrapperStyle={{ color: themeColors.text }}
              iconType="circle"
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        {centerLabel && (
          <div
            className="text-xs font-medium mb-1"
            style={{ color: themeColors.textSecondary }}
          >
            {centerLabel}
          </div>
        )}
        <div
          className="text-2xl font-bold"
          style={{ color: themeColors.text }}
        >
          {displayCenterValue}
        </div>
      </div>
    </div>
  );
});

DonutChart.displayName = 'DonutChart';

export default DonutChart;
