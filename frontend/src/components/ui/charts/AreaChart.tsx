/**
 * AreaChart Component - Cumulative Data Visualization
 *
 * A reusable area chart component using recharts for visualizing cumulative data over time.
 * Supports gradient fills, multiple areas, and stacking.
 *
 * @module components/ui/charts/AreaChart
 */

import React, { useMemo } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
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

export interface AreaChartDataPoint {
  [key: string]: string | number;
}

export interface AreaChartSeries {
  dataKey: string;
  name: string;
  color: string;
  fillOpacity?: number;
}

export interface AreaChartProps {
  data: AreaChartDataPoint[];
  series: AreaChartSeries[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  stacked?: boolean;
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
 * AreaChart Component
 *
 * Features:
 * - Gradient fills
 * - Multiple areas
 * - Stacked support
 * - Responsive design
 * - Dark mode support
 */
export const AreaChart = React.memo<AreaChartProps>(({
  data,
  series,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  stacked = false,
  darkMode = false,
  className = '',
  xAxisLabel,
  yAxisLabel,
  tooltipFormatter
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
        <RechartsAreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            {series.map((s) => (
              <linearGradient
                key={`gradient-${s.dataKey}`}
                id={`color-${s.dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={s.color}
                  stopOpacity={s.fillOpacity || 0.8}
                />
                <stop
                  offset="95%"
                  stopColor={s.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
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
              iconType="rect"
            />
          )}
          {series.map((s) => (
            <Area
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#color-${s.dataKey})`}
              stackId={stacked ? 'stack' : undefined}
              animationDuration={300}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
});

AreaChart.displayName = 'AreaChart';

export default AreaChart;
