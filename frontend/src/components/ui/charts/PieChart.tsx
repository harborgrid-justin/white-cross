/**
 * PieChart Component - Proportion Visualization
 *
 * A reusable pie chart component using recharts for visualizing proportions and percentages.
 * Supports custom colors, labels, and interactive segments.
 *
 * @module components/ui/charts/PieChart
 */

import React, { useMemo, useCallback } from 'react';
import {
  PieChart as RechartsPieChart,
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

export interface PieChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  data: PieChartDataPoint[];
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  showLabels?: boolean;
  showPercentage?: boolean;
  darkMode?: boolean;
  className?: string;
  colors?: string[];
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
 * PieChart Component
 *
 * Features:
 * - Custom colors
 * - Percentage labels
 * - Interactive segments
 * - Responsive design
 * - Dark mode support
 * - Customizable radius (can create donut chart)
 */
export const PieChart = React.memo<PieChartProps>(({
  data,
  height = 300,
  showLegend = true,
  showTooltip = true,
  showLabels = true,
  showPercentage = true,
  darkMode = false,
  className = '',
  colors = DEFAULT_COLORS,
  innerRadius = 0,
  outerRadius = 80,
  tooltipFormatter
}) => {
  // Calculate total for percentages
  const total = useMemo(() =>
    data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  // Memoize theme colors
  const themeColors = useMemo(() => ({
    text: darkMode ? '#e5e7eb' : '#374151',
    background: darkMode ? '#1f2937' : '#ffffff'
  }), [darkMode]);

  // Custom label renderer
  const renderLabel = useCallback((entry: PieChartDataPoint & { percent?: number }) => {
    if (!showLabels) return null;

    const percentage = ((entry.value / total) * 100).toFixed(1);

    if (showPercentage) {
      return `${percentage}%`;
    }
    return entry.name;
  }, [showLabels, showPercentage, total]);

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

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={showLabels}
            label={renderLabel}
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
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
});

PieChart.displayName = 'PieChart';

export default PieChart;
