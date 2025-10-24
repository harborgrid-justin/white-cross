/**
 * LineChart Component - Trend Visualization
 *
 * A reusable line chart component using recharts for visualizing trends over time.
 * Supports multiple data series, responsive design, tooltips, and dark mode.
 *
 * @module components/ui/charts/LineChart
 */

import React, { useMemo } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

// ============================================================================
// TYPES
// ============================================================================

export interface LineChartDataPoint {
  [key: string]: string | number;
}

export interface LineChartSeries {
  dataKey: string;
  name: string;
  color: string;
  strokeWidth?: number;
}

export interface LineChartProps {
  data: LineChartDataPoint[];
  series: LineChartSeries[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  curved?: boolean;
  darkMode?: boolean;
  className?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  tooltipFormatter?: (value: number, name: string) => string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * LineChart Component
 *
 * Features:
 * - Multiple data series
 * - Responsive design
 * - Custom tooltips
 * - Grid lines
 * - Legend
 * - Dark mode support
 * - Curved or straight lines
 */
export const LineChart = React.memo<LineChartProps>(({
  data,
  series,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  curved = true,
  darkMode = false,
  className = '',
  xAxisLabel,
  yAxisLabel,
  tooltipFormatter
}) => {
  // Memoize theme colors to avoid recalculation
  const themeColors = useMemo(() => ({
    text: darkMode ? '#e5e7eb' : '#374151',
    grid: darkMode ? '#374151' : '#e5e7eb',
    background: darkMode ? '#1f2937' : '#ffffff'
  }), [darkMode]);

  // Custom tooltip component
  const CustomTooltip = React.useCallback(({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className={`rounded-lg shadow-lg p-3 border ${
        darkMode
          ? 'bg-gray-800 border-gray-700 text-gray-200'
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {entry.name}:
            </span>
            <span className="font-medium">
              {tooltipFormatter
                ? tooltipFormatter(entry.value as number, entry.name as string)
                : entry.value
              }
            </span>
          </div>
        ))}
      </div>
    );
  }, [darkMode, tooltipFormatter]);

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={themeColors.grid}
              opacity={0.5}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            stroke={themeColors.text}
            tick={{ fill: themeColors.text }}
            label={xAxisLabel ? {
              value: xAxisLabel,
              position: 'insideBottom',
              offset: -5,
              fill: themeColors.text
            } : undefined}
          />
          <YAxis
            stroke={themeColors.text}
            tick={{ fill: themeColors.text }}
            label={yAxisLabel ? {
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              fill: themeColors.text
            } : undefined}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && (
            <Legend
              wrapperStyle={{ color: themeColors.text }}
              iconType="line"
            />
          )}
          {series.map((s) => (
            <Line
              key={s.dataKey}
              type={curved ? 'monotone' : 'linear'}
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={s.strokeWidth || 2}
              dot={{ fill: s.color, r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={300}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
});

LineChart.displayName = 'LineChart';

export default LineChart;
