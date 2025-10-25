/**
 * TrendAnalysis Component
 *
 * Production-grade line chart showing incident trends over time.
 * Supports multiple series and date range selection.
 *
 * @example
 * ```tsx
 * <TrendAnalysis
 *   dateRange={{ start: '2025-01-01', end: '2025-01-31' }}
 * />
 * ```
 */

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO, eachDayOfInterval, subDays } from 'date-fns';
import { incidentsApi } from '@/services/modules/incidentsApi';
import { IncidentSeverity } from '@/types/incidents';

interface TrendAnalysisProps {
  dateRange?: { start: string; end: string };
  className?: string;
}

interface TrendDataPoint {
  date: string;
  total: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

const SEVERITY_COLORS = {
  total: '#3B82F6',    // blue-500
  low: '#10B981',      // green-500
  medium: '#F59E0B',   // amber-500
  high: '#EF4444',     // red-500
  critical: '#991B1B', // red-800
};

/**
 * Custom tooltip for trend chart
 */
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
      <p className="text-sm font-semibold text-gray-900 mb-2">
        {format(parseISO(label), 'MMM dd, yyyy')}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}:
          </span>
          <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * TrendAnalysis component - Line chart showing trends over time
 *
 * Features:
 * - Multi-series line chart (total, by severity)
 * - Date range selector
 * - TanStack Query integration
 * - Responsive design
 * - Custom tooltips
 * - Loading and error states
 * - Empty state handling
 */
const TrendAnalysis: React.FC<TrendAnalysisProps> = React.memo(({
  dateRange: propDateRange,
  className = ''
}) => {
  // Default to last 30 days if no date range provided
  const defaultDateRange = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 30);
    return {
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd')
    };
  }, []);

  const [dateRange] = useState(propDateRange || defaultDateRange);

  // Fetch all incidents for the date range
  const { data: incidentsResponse, isLoading, error } = useQuery({
    queryKey: ['incidents', 'list', dateRange],
    queryFn: () => incidentsApi.getAll({
      dateFrom: dateRange.start,
      dateTo: dateRange.end,
      limit: 1000 // Get all incidents for trend analysis
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform incidents into trend data
  const trendData: TrendDataPoint[] = useMemo(() => {
    if (!incidentsResponse?.reports) return [];

    const incidents = incidentsResponse.reports;

    // Get all dates in range
    const dates = eachDayOfInterval({
      start: parseISO(dateRange.start),
      end: parseISO(dateRange.end)
    });

    // Initialize data points for each date
    const dataByDate = dates.map(date => ({
      date: format(date, 'yyyy-MM-dd'),
      total: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    }));

    // Count incidents per day
    incidents.forEach(incident => {
      const incidentDate = format(parseISO(incident.occurredAt), 'yyyy-MM-dd');
      const dataPoint = dataByDate.find(d => d.date === incidentDate);

      if (dataPoint) {
        dataPoint.total++;

        switch (incident.severity) {
          case IncidentSeverity.LOW:
            dataPoint.low++;
            break;
          case IncidentSeverity.MEDIUM:
            dataPoint.medium++;
            break;
          case IncidentSeverity.HIGH:
            dataPoint.high++;
            break;
          case IncidentSeverity.CRITICAL:
            dataPoint.critical++;
            break;
        }
      }
    });

    return dataByDate;
  }, [incidentsResponse, dateRange]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`trend-analysis ${className}`}>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Incident Trends
          </h3>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Loading trend data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`trend-analysis ${className}`}>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Incident Trends
          </h3>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-red-600">
              <p className="font-medium">Error loading trend data</p>
              <p className="text-sm text-gray-600 mt-1">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!trendData || trendData.length === 0) {
    return (
      <div className={`trend-analysis ${className}`}>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Incident Trends
          </h3>
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
              <p className="mt-2 text-sm">No trend data available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`trend-analysis ${className}`}>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Incident Trends
          </h3>
          <span className="text-sm text-gray-500">
            {format(parseISO(dateRange.start), 'MMM dd')} - {format(parseISO(dateRange.end), 'MMM dd, yyyy')}
          </span>
        </div>

        <div className="h-80" role="img" aria-label="Line chart showing incident trends over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                tickFormatter={(date) => format(parseISO(date), 'MM/dd')}
              />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                name="Total"
                stroke={SEVERITY_COLORS.total}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="critical"
                name="Critical"
                stroke={SEVERITY_COLORS.critical}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="high"
                name="High"
                stroke={SEVERITY_COLORS.high}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="medium"
                name="Medium"
                stroke={SEVERITY_COLORS.medium}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="low"
                name="Low"
                stroke={SEVERITY_COLORS.low}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

TrendAnalysis.displayName = 'TrendAnalysis';

export default TrendAnalysis;
