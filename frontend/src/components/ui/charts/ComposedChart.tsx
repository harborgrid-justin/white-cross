'use client';

/**
 * ComposedChart Component - Multi-Series Visualization
 *
 * A reusable composed chart component using recharts for visualizing multiple data types.
 * Supports combining line, bar, and area charts in a single visualization.
 *
 * @module components/ui/charts/ComposedChart
 */

import React, { useMemo } from 'react';
import {
  ComposedChart as RechartsComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ============================================================================
// TYPES
// ============================================================================

export interface ComposedChartDataPoint {
  [key: string]: string | number;
}

export interface ComposedChartSeries {
  dataKey: string;
  name: string;
  type: 'line' | 'bar' | 'area';
  color: string;
  strokeWidth?: number;
  fillOpacity?: number;
}

export interface ComposedChartProps {
  data: ComposedChartDataPoint[];
  series: ComposedChartSeries[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  curved?: boolean;
  darkMode?: boolean;
  className?: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 border rounded-lg shadow-lg bg-white border-gray-200">
        <p className="font-medium mb-2">{`Value: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ComposedChart component for displaying multi-series data with different chart types
 */
export const ComposedChart: React.FC<ComposedChartProps> = ({
  data,
  series,
  xAxisKey,
  height = 400,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  curved = false,
  darkMode = false,
  className = ''
}) => {
  // Memoize chart elements to prevent unnecessary re-renders
  const chartElements = useMemo(() => {
    return series.map((item) => {
      const commonProps = {
        key: item.dataKey,
        dataKey: item.dataKey,
        name: item.name,
        stroke: item.color,
        fill: item.color,
        strokeWidth: item.strokeWidth || 2,
      };

      switch (item.type) {
        case 'line':
          return (
            <Line
              {...commonProps}
              stroke={item.color}
              strokeWidth={item.strokeWidth || 2}
              dot={{ fill: item.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: item.color, strokeWidth: 2 }}
              type={curved ? 'monotone' : 'linear'}
            />
          );
        case 'bar':
          return (
            <Bar
              {...commonProps}
              fill={item.color}
              fillOpacity={item.fillOpacity || 0.8}
            />
          );
        case 'area':
          return (
            <Area
              {...commonProps}
              fill={item.color}
              fillOpacity={item.fillOpacity || 0.3}
              stroke={item.color}
              strokeWidth={item.strokeWidth || 1}
              type={curved ? 'monotone' : 'linear'}
            />
          );
        default:
          return null;
      }
    });
  }, [series, curved]);

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, darkMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-3 border rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'
      }`}>
        <p className="font-medium mb-2">{`Value: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsComposedChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? '#374151' : '#e5e7eb'}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            fontSize={12}
          />
          <YAxis
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            fontSize={12}
          />
          {showTooltip && <Tooltip content={CustomTooltip} />}
          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
              }}
            />
          )}
          {chartElements}
        </RechartsComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComposedChart;