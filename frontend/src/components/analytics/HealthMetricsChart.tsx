/**
 * Health Metrics Chart Component
 * Displays health metrics with interactive charts
 */

'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  CHART_COLORS,
  CHART_TOOLTIP_STYLE,
  AXIS_CONFIG,
  GRID_CONFIG,
  DEFAULT_CHART_MARGIN,
} from '@/lib/analytics/charts';

interface HealthMetric {
  date: string;
  bloodPressure?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  bmi?: number;
}

interface HealthMetricsChartProps {
  data: HealthMetric[];
  metrics: string[];
  chartType?: 'line' | 'bar';
  title?: string;
  showLegend?: boolean;
}

export const HealthMetricsChart = React.memo(function HealthMetricsChart({
  data,
  metrics,
  chartType = 'line',
  title,
  showLegend = true,
}: HealthMetricsChartProps) {
  const ChartComponent = chartType === 'line' ? LineChart : BarChart;
  const DataComponent = chartType === 'line' ? Line : Bar;

  const metricConfig: Record<
    string,
    { label: string; color: string; unit: string }
  > = {
    bloodPressure: {
      label: 'Blood Pressure',
      color: CHART_COLORS.danger,
      unit: 'mmHg',
    },
    heartRate: { label: 'Heart Rate', color: CHART_COLORS.primary, unit: 'bpm' },
    temperature: {
      label: 'Temperature',
      color: CHART_COLORS.warning,
      unit: '°F',
    },
    weight: { label: 'Weight', color: CHART_COLORS.success, unit: 'lbs' },
    height: { label: 'Height', color: CHART_COLORS.info, unit: 'in' },
    bmi: { label: 'BMI', color: CHART_COLORS.purple, unit: '' },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div
        className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
        style={CHART_TOOLTIP_STYLE}
      >
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          const config = metricConfig[entry.dataKey];
          return (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {config.label}: {entry.value}
              {config.unit && ` ${config.unit}`}
            </p>
          );
        })}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No health metrics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}

      <ResponsiveContainer width="100%" height={350}>
        <ChartComponent data={data} margin={DEFAULT_CHART_MARGIN}>
          <CartesianGrid {...GRID_CONFIG} />
          <XAxis
            dataKey="date"
            {...AXIS_CONFIG}
            tick={{ fontSize: 11 }}
          />
          <YAxis {...AXIS_CONFIG} />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}

          {metrics.map((metric) => {
            const config = metricConfig[metric];
            if (!config) return null;

            return (
              <DataComponent
                key={metric}
                dataKey={metric}
                stroke={config.color}
                fill={config.color}
                name={config.label}
                strokeWidth={2}
                dot={chartType === 'line' ? { r: 4 } : undefined}
                activeDot={chartType === 'line' ? { r: 6 } : undefined}
                radius={chartType === 'bar' ? [8, 8, 0, 0] : undefined}
              />
            );
          })}
        </ChartComponent>
      </ResponsiveContainer>

      {/* Metric Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {metrics.map((metric) => {
          const config = metricConfig[metric];
          if (!config) return null;

          const values = data
            .map((d) => d[metric as keyof HealthMetric])
            .filter((v): v is number => typeof v === 'number');

          if (values.length === 0) return null;

          const latest = values[values.length - 1];
          const average = values.reduce((sum, v) => sum + v, 0) / values.length;
          const min = Math.min(...values);
          const max = Math.max(...values);

          return (
            <div
              key={metric}
              className="bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {config.label}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Latest:</span>
                  <span className="font-semibold">
                    {latest.toFixed(1)}
                    {config.unit}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Avg:</span>
                  <span className="font-semibold">
                    {average.toFixed(1)}
                    {config.unit}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Range:</span>
                  <span className="font-semibold">
                    {min.toFixed(1)} - {max.toFixed(1)}
                    {config.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
