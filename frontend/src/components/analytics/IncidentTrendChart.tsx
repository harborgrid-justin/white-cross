/**
 * Incident Trend Chart Component
 */

'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
  CHART_PALETTE,
  CHART_TOOLTIP_STYLE,
  DEFAULT_CHART_MARGIN,
} from '@/lib/analytics/charts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface IncidentTrendData {
  date: string;
  total: number;
  byType?: Record<string, number>;
  bySeverity?: Record<string, number>;
}

interface IncidentTrendChartProps {
  data: IncidentTrendData[];
  view?: 'total' | 'byType' | 'bySeverity';
  chartType?: 'line' | 'area' | 'bar';
  title?: string;
}

export const IncidentTrendChart = React.memo(function IncidentTrendChart({
  data,
  view = 'total',
  chartType = 'line',
  title = 'Incident Trends',
}: IncidentTrendChartProps) {
  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return null;

    const recent = data.slice(-7);
    const previous = data.slice(-14, -7);

    if (previous.length === 0) return null;

    const recentAvg = recent.reduce((sum, d) => sum + d.total, 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + d.total, 0) / previous.length;

    const change = recentAvg - previousAvg;
    const changePercent = previousAvg !== 0 ? (change / previousAvg) * 100 : 0;

    return { change, changePercent, trend: change > 0 ? 'up' : 'down' };
  };

  const trend = calculateTrend();

  // Get unique types and severities
  const types = Array.from(
    new Set(
      data.flatMap((d) => (d.byType ? Object.keys(d.byType) : []))
    )
  );

  const severities = Array.from(
    new Set(
      data.flatMap((d) => (d.bySeverity ? Object.keys(d.bySeverity) : []))
    )
  );

  // Prepare chart data based on view
  const chartData = data.map((d) => {
    const item: any = { date: d.date, total: d.total };

    if (view === 'byType' && d.byType) {
      Object.entries(d.byType).forEach(([type, count]) => {
        item[type] = count;
      });
    }

    if (view === 'bySeverity' && d.bySeverity) {
      Object.entries(d.bySeverity).forEach(([severity, count]) => {
        item[severity] = count;
      });
    }

    return item;
  });

  // Select chart component
  let ChartComponent;
  let DataComponent;

  if (chartType === 'line') {
    ChartComponent = LineChart;
    DataComponent = Line;
  } else if (chartType === 'area') {
    ChartComponent = AreaChart;
    DataComponent = Area;
  } else {
    ChartComponent = BarChart;
    DataComponent = Bar;
  }

  return (
    <div className="space-y-6">
      {/* Header with trend indicator */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        {trend && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              trend.trend === 'up' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {trend.trend === 'up' ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-semibold">
              {Math.abs(trend.changePercent).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Main Chart */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={350}>
          <ChartComponent data={chartData} margin={DEFAULT_CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Legend />

            {view === 'total' && (
              <DataComponent
                dataKey="total"
                stroke={CHART_COLORS.primary}
                fill={CHART_COLORS.primary}
                fillOpacity={chartType === 'area' ? 0.6 : 1}
                name="Total Incidents"
                strokeWidth={2}
                radius={chartType === 'bar' ? [8, 8, 0, 0] : undefined}
              />
            )}

            {view === 'byType' &&
              types.map((type, index) => (
                <DataComponent
                  key={type}
                  dataKey={type}
                  stroke={CHART_PALETTE[index % CHART_PALETTE.length]}
                  fill={CHART_PALETTE[index % CHART_PALETTE.length]}
                  fillOpacity={chartType === 'area' ? 0.6 : 1}
                  name={type}
                  strokeWidth={2}
                  stackId={chartType === 'area' || chartType === 'bar' ? 'stack' : undefined}
                  radius={chartType === 'bar' ? [8, 8, 0, 0] : undefined}
                />
              ))}

            {view === 'bySeverity' &&
              severities.map((severity, index) => (
                <DataComponent
                  key={severity}
                  dataKey={severity}
                  stroke={CHART_PALETTE[index % CHART_PALETTE.length]}
                  fill={CHART_PALETTE[index % CHART_PALETTE.length]}
                  fillOpacity={chartType === 'area' ? 0.6 : 1}
                  name={severity}
                  strokeWidth={2}
                  stackId={chartType === 'area' || chartType === 'bar' ? 'stack' : undefined}
                  radius={chartType === 'bar' ? [8, 8, 0, 0] : undefined}
                />
              ))}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Total Incidents</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {data.reduce((sum, d) => sum + d.total, 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Last {data.length} periods
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Average per Period</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(data.reduce((sum, d) => sum + d.total, 0) / data.length).toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Mean incidents
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-gray-700">Peak Period</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.max(...data.map((d) => d.total))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Highest count
          </div>
        </div>
      </div>
    </div>
  );
});
