/**
 * Stacked Bar Chart Component
 *
 * Displays multiple data series stacked on top of each other.
 * Useful for showing composition and totals simultaneously.
 *
 * Features:
 * - Vertical or horizontal orientation
 * - Interactive tooltips with totals
 * - Percentage mode
 * - Export capabilities
 *
 * @module components/ui/charts/StackedBarChart
 */

'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { ChartConfig } from '@/types/schemas/reports.schema';

// ============================================================================
// TYPES
// ============================================================================

interface StackedBarChartProps {
  config: ChartConfig;
  data: any[];
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  showPercentage?: boolean;
  onBarClick?: (data: any, seriesName: string) => void;
}

const DEFAULT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Converts data to percentage values
 */
function convertToPercentage(data: any[], fields: string[]): any[] {
  return data.map((item) => {
    const total = fields.reduce((sum, field) => sum + (item[field] || 0), 0);
    const percentageItem: any = { ...item };

    fields.forEach((field) => {
      percentageItem[field] = total > 0 ? ((item[field] || 0) / total) * 100 : 0;
    });

    return percentageItem;
  });
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Stacked bar chart component
 *
 * @example
 * ```tsx
 * <StackedBarChart
 *   config={{
 *     title: 'Medication Distribution by School',
 *     xAxis: { field: 'school', label: 'School' },
 *     yAxis: { label: 'Count' },
 *     series: [
 *       { name: 'Administered', field: 'administered', color: '#10B981' },
 *       { name: 'Pending', field: 'pending', color: '#F59E0B' },
 *       { name: 'Missed', field: 'missed', color: '#EF4444' }
 *     ]
 *   }}
 *   data={medicationData}
 *   showPercentage
 * />
 * ```
 */
export function StackedBarChart({
  config,
  data,
  className = '',
  orientation = 'vertical',
  showPercentage = false,
  onBarClick
}: StackedBarChartProps) {
  // Prepare series with colors
  const seriesWithColors = useMemo(() => {
    return config.series.map((series, index) => ({
      ...series,
      color: series.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
    }));
  }, [config.series]);

  // Convert to percentage if needed
  const processedData = useMemo(() => {
    if (showPercentage) {
      const fields = config.series.map((s) => s.field);
      return convertToPercentage(data, fields);
    }
    return data;
  }, [data, showPercentage, config.series]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    // Calculate total
    const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-sm text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
            </div>
            <span className="font-medium text-gray-900">
              {showPercentage
                ? `${entry.value.toFixed(1)}%`
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
        {!showPercentage && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-gray-600">Total:</span>
              <span className="text-gray-900">{total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const isHorizontal = orientation === 'horizontal';
  const Chart = BarChart;

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

      <ResponsiveContainer width="100%" height={config.height || 400}>
        <Chart
          data={processedData}
          layout={isHorizontal ? 'horizontal' : 'vertical'}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          {isHorizontal ? (
            <>
              <XAxis
                type="number"
                domain={showPercentage ? [0, 100] : undefined}
                label={
                  config.yAxis?.label
                    ? {
                        value: showPercentage
                          ? 'Percentage (%)'
                          : config.yAxis.label,
                        position: 'insideBottom',
                        offset: -5
                      }
                    : undefined
                }
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey={config.xAxis?.field || 'x'}
                label={
                  config.xAxis?.label
                    ? {
                        value: config.xAxis.label,
                        angle: -90,
                        position: 'insideLeft'
                      }
                    : undefined
                }
                tick={{ fontSize: 12 }}
              />
            </>
          ) : (
            <>
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
              />
              <YAxis
                domain={showPercentage ? [0, 100] : undefined}
                label={
                  config.yAxis?.label
                    ? {
                        value: showPercentage
                          ? 'Percentage (%)'
                          : config.yAxis.label,
                        angle: -90,
                        position: 'insideLeft'
                      }
                    : undefined
                }
                tick={{ fontSize: 12 }}
              />
            </>
          )}

          <Tooltip content={<CustomTooltip />} />

          {config.legend?.show !== false && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
          )}

          {seriesWithColors.map((series) => (
            <Bar
              key={series.name}
              dataKey={series.field}
              name={series.name}
              fill={series.color}
              stackId="stack"
              onClick={(data: any) => onBarClick?.(data, series.name)}
              cursor="pointer"
            />
          ))}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}

export default StackedBarChart;
