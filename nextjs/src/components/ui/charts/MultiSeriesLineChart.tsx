'use client';

/**
 * Multi-Series Line Chart Component
 *
 * Advanced line chart supporting multiple data series with:
 * - Multiple Y-axes
 * - Interactive tooltips
 * - Zoom and pan functionality
 * - Data point markers
 * - Legend management
 * - Export capabilities
 *
 * @module components/ui/charts/MultiSeriesLineChart
 */

'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine
} from 'recharts';
import type { DataSeries, ChartConfig, ChartLegend } from '@/types/schemas/reports.schema';

// ============================================================================
// TYPES
// ============================================================================

interface MultiSeriesLineChartProps {
  config: ChartConfig;
  data: any[];
  className?: string;
  onDataPointClick?: (data: any, seriesName: string) => void;
  showBrush?: boolean;
  showGrid?: boolean;
  animate?: boolean;
}

// Default colors for series
const DEFAULT_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // green-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // purple-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#F97316', // orange-500
];

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Multi-series line chart with advanced features
 *
 * @example
 * ```tsx
 * <MultiSeriesLineChart
 *   config={{
 *     title: 'Health Trends',
 *     xAxis: { field: 'date', label: 'Date' },
 *     yAxis: { field: 'count', label: 'Count' },
 *     series: [
 *       { name: 'Visits', field: 'visits', color: '#3B82F6' },
 *       { name: 'Incidents', field: 'incidents', color: '#EF4444' }
 *     ]
 *   }}
 *   data={healthData}
 *   showBrush
 * />
 * ```
 */
export function MultiSeriesLineChart({
  config,
  data,
  className = '',
  onDataPointClick,
  showBrush = false,
  showGrid = true,
  animate = true
}: MultiSeriesLineChartProps) {
  // Prepare series with colors
  const seriesWithColors = useMemo(() => {
    return config.series.map((series, index) => ({
      ...series,
      color: series.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
    }));
  }, [config.series]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-sm text-gray-900 mb-2">
          {config.xAxis?.label}: {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">
              {typeof entry.value === 'number'
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Handle data point click
  const handleClick = (data: any, seriesName: string) => {
    if (onDataPointClick) {
      onDataPointClick(data, seriesName);
    }
  };

  return (
    <div className={className}>
      {config.title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          {config.subtitle && (
            <p className="text-sm text-gray-600 mt-1">{config.subtitle}</p>
          )}
        </div>
      )}

      <ResponsiveContainer
        width="100%"
        height={config.height || 400}
      >
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          )}

          <XAxis
            dataKey={config.xAxis?.field || 'x'}
            label={
              config.xAxis?.label
                ? {
                    value: config.xAxis.label,
                    position: 'insideBottom',
                    offset: -5
                  }
                : undefined
            }
            tick={{ fontSize: 12 }}
            stroke="#6B7280"
          />

          <YAxis
            label={
              config.yAxis?.label
                ? {
                    value: config.yAxis.label,
                    angle: -90,
                    position: 'insideLeft'
                  }
                : undefined
            }
            tick={{ fontSize: 12 }}
            stroke="#6B7280"
            domain={[
              config.yAxis?.min || 'auto',
              config.yAxis?.max || 'auto'
            ]}
          />

          {config.yAxis2 && (
            <YAxis
              yAxisId="right"
              orientation="right"
              label={
                config.yAxis2.label
                  ? {
                      value: config.yAxis2.label,
                      angle: 90,
                      position: 'insideRight'
                    }
                  : undefined
              }
              tick={{ fontSize: 12 }}
              stroke="#6B7280"
            />
          )}

          <Tooltip content={<CustomTooltip />} />

          {config.legend?.show !== false && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
          )}

          {seriesWithColors.map((series) => (
            <Line
              key={series.name}
              type="monotone"
              dataKey={series.field}
              name={series.name}
              stroke={series.color}
              strokeWidth={2}
              dot={{ r: 4, fill: series.color }}
              activeDot={{
                r: 6,
                onClick: (e: any, payload: any) =>
                  handleClick(payload, series.name)
              }}
              yAxisId={series.yAxisId || 'left'}
              isAnimationActive={animate}
            />
          ))}

          {showBrush && (
            <Brush
              dataKey={config.xAxis?.field || 'x'}
              height={30}
              stroke="#3B82F6"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MultiSeriesLineChart;
