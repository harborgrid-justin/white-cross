'use client';

/**
 * BarChart Component - Comparison Data Visualization
 *
 * A reusable bar chart component using recharts for comparing data across categories.
 * Supports horizontal/vertical orientation, stacked bars, and dark mode.
 *
 * @module components/ui/charts/BarChart
 */

import React, { useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  TooltipProps
} from 'recharts';

// ============================================================================
// TYPES
// ============================================================================

export interface BarChartDataPoint {
  [key: string]: string | number;
}

export interface BarChartSeries {
  dataKey: string;
  name: string;
  color: string;
}

export interface BarChartProps {
  data: BarChartDataPoint[];
  series: BarChartSeries[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
  darkMode?: boolean;
  className?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  tooltipFormatter?: (value: number, name: string) => string;
  barSize?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * BarChart Component
 *
 * Features:
 * - Horizontal and vertical orientations
 * - Stacked bar support
 * - Multiple data series
 * - Custom colors per bar
 * - Responsive design
 * - Dark mode support
 */
export const BarChart = React.memo<BarChartProps>(({
  data,
  series,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  stacked = false,
  horizontal = false,
  darkMode = false,
  className = '',
  xAxisLabel,
  yAxisLabel,
  tooltipFormatter,
  barSize = 40
}) => {
  // Memoize theme colors
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
              className="w-3 h-3 rounded"
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
        <RechartsBarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={themeColors.grid}
              opacity={0.5}
            />
          )}
          {horizontal ? (
            <>
              <XAxis
                type="number"
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
                type="category"
                dataKey={xAxisKey}
                stroke={themeColors.text}
                tick={{ fill: themeColors.text }}
                label={yAxisLabel ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                  fill: themeColors.text
                } : undefined}
              />
            </>
          ) : (
            <>
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
            </>
          )}
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && (
            <Legend
              wrapperStyle={{ color: themeColors.text }}
              iconType="rect"
            />
          )}
          {series.map((s) => (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.name}
              fill={s.color}
              stackId={stacked ? 'stack' : undefined}
              radius={[4, 4, 0, 0]}
              maxBarSize={barSize}
              animationDuration={300}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
});

BarChart.displayName = 'BarChart';

export default BarChart;
