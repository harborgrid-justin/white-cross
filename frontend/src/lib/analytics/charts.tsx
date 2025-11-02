/**
 * Analytics Chart Configurations
 * Provides reusable chart configurations for Recharts
 */

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  gray: '#6b7280',
  purple: '#a855f7',
  pink: '#ec4899',
  indigo: '#6366f1',
} as const;

export const CHART_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.info,
  CHART_COLORS.purple,
  CHART_COLORS.pink,
  CHART_COLORS.indigo,
] as const;

export const DEFAULT_CHART_MARGIN = {
  top: 20,
  right: 30,
  left: 20,
  bottom: 20,
} as const;

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  padding: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
} as const;

export const CHART_LEGEND_STYLE = {
  wrapperStyle: {
    paddingTop: '20px',
  },
  iconSize: 14,
} as const;

/**
 * Chart type definitions
 */
export type ChartType =
  | 'line'
  | 'bar'
  | 'area'
  | 'pie'
  | 'scatter'
  | 'radar'
  | 'composed';

export type TimeGranularity = 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

/**
 * Get chart configuration by type
 */
export function getChartConfig(type: ChartType) {
  const configs = {
    line: {
      strokeWidth: 2,
      dot: { r: 4 },
      activeDot: { r: 6 },
    },
    bar: {
      barSize: 40,
      radius: [8, 8, 0, 0],
    },
    area: {
      strokeWidth: 2,
      fillOpacity: 0.6,
    },
    pie: {
      innerRadius: 60,
      outerRadius: 120,
      paddingAngle: 2,
    },
    scatter: {
      fillOpacity: 0.6,
    },
    radar: {
      strokeWidth: 2,
      fillOpacity: 0.3,
    },
    composed: {
      strokeWidth: 2,
      barSize: 30,
    },
  };

  return configs[type];
}

/**
 * Format data for time-based charts
 */
export function formatTimeSeriesData(
  data: Array<{ date: string | Date; value: number }>,
  granularity: TimeGranularity = 'day'
) {
  return data.map((item) => {
    const date = new Date(item.date);
    let formattedDate: string;

    switch (granularity) {
      case 'hour':
        formattedDate = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        });
        break;
      case 'day':
        formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        break;
      case 'week':
        formattedDate = `Week ${getWeekNumber(date)}`;
        break;
      case 'month':
        formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
        break;
      case 'quarter':
        formattedDate = `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
        break;
      case 'year':
        formattedDate = date.getFullYear().toString();
        break;
      default:
        formattedDate = date.toLocaleDateString();
    }

    return {
      ...item,
      date: formattedDate,
      timestamp: date.getTime(),
    };
  });
}

/**
 * Get week number for a date
 */
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Calculate percentage for pie chart
 */
export function calculatePiePercentages<T extends { value: number }>(
  data: T[]
): Array<T & { percentage: number }> {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return data.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
  }));
}

/**
 * Custom label for pie charts
 */
export function renderPieLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

/**
 * Custom tooltip renderer
 */
export function customTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  formatter?: (value: number) => string;
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return {
    contentStyle: CHART_TOOLTIP_STYLE,
    labelStyle: { fontWeight: 600, marginBottom: 8 },
    formatter: formatter || ((value: number) => value.toLocaleString()),
  };
}

/**
 * Trend calculation
 */
export interface TrendData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
}

export function calculateTrend(current: number, previous: number): TrendData {
  const change = current - previous;
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0;

  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (Math.abs(changePercent) > 0.1) {
    trend = changePercent > 0 ? 'up' : 'down';
  }

  return {
    current,
    previous,
    change,
    changePercent,
    trend,
  };
}

/**
 * Group data by time period
 */
export function groupByTimePeriod<T extends { date: string | Date; [key: string]: any }>(
  data: T[],
  granularity: TimeGranularity,
  aggregator: (items: T[]) => Record<string, any>
) {
  const groups = new Map<string, T[]>();

  data.forEach((item) => {
    const date = new Date(item.date);
    let key: string;

    switch (granularity) {
      case 'hour':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
        break;
      case 'day':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        break;
      case 'week':
        key = `${date.getFullYear()}-W${getWeekNumber(date)}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth()}`;
        break;
      case 'quarter':
        key = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3)}`;
        break;
      case 'year':
        key = `${date.getFullYear()}`;
        break;
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  });

  return Array.from(groups.entries()).map(([key, items]) => ({
    key,
    date: items[0].date,
    ...aggregator(items),
  }));
}

/**
 * Moving average calculation
 */
export function calculateMovingAverage(
  data: Array<{ value: number }>,
  period: number
): Array<{ value: number; average: number }> {
  return data.map((item, index) => {
    const start = Math.max(0, index - period + 1);
    const subset = data.slice(start, index + 1);
    const average = subset.reduce((sum, d) => sum + d.value, 0) / subset.length;

    return {
      ...item,
      average,
    };
  });
}

/**
 * Chart responsive container props
 */
export const RESPONSIVE_CONTAINER_PROPS = {
  width: '100%',
  height: 300,
  minHeight: 250,
};

/**
 * Axis configuration
 */
export const AXIS_CONFIG = {
  tick: { fontSize: 12 },
  tickLine: { stroke: '#e5e7eb' },
  axisLine: { stroke: '#e5e7eb' },
};

/**
 * Grid configuration
 */
export const GRID_CONFIG = {
  strokeDasharray: '3 3',
  stroke: '#f3f4f6',
};
