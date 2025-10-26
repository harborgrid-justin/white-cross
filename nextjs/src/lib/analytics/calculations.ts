/**
 * Analytics Calculations
 * Business logic for calculating healthcare metrics
 */

/**
 * Medication compliance rate calculation
 */
export interface MedicationComplianceData {
  administered: number;
  missed: number;
  total: number;
}

export function calculateMedicationCompliance(data: MedicationComplianceData) {
  const { administered, missed, total } = data;
  const complianceRate = total > 0 ? (administered / total) * 100 : 0;

  return {
    complianceRate,
    administered,
    missed,
    total,
    status: getComplianceStatus(complianceRate),
  };
}

function getComplianceStatus(rate: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (rate >= 95) return 'excellent';
  if (rate >= 85) return 'good';
  if (rate >= 75) return 'fair';
  return 'poor';
}

/**
 * Health metrics aggregation
 */
export interface HealthMetric {
  studentId: string;
  date: Date;
  type: string;
  value: number;
}

export function aggregateHealthMetrics(metrics: HealthMetric[]) {
  const byType = metrics.reduce(
    (acc, metric) => {
      if (!acc[metric.type]) {
        acc[metric.type] = [];
      }
      acc[metric.type].push(metric.value);
      return acc;
    },
    {} as Record<string, number[]>
  );

  return Object.entries(byType).map(([type, values]) => ({
    type,
    count: values.length,
    average: values.reduce((sum, v) => sum + v, 0) / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    median: calculateMedian(values),
  }));
}

/**
 * Incident trend analysis
 */
export interface IncidentData {
  id: string;
  date: Date;
  type: string;
  severity: string;
  resolved: boolean;
}

export function analyzeIncidentTrends(incidents: IncidentData[], period: 'week' | 'month') {
  const now = new Date();
  const periodMs = period === 'week' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  const periodStart = new Date(now.getTime() - periodMs);

  const recentIncidents = incidents.filter((i) => new Date(i.date) >= periodStart);
  const previousPeriodStart = new Date(periodStart.getTime() - periodMs);
  const previousIncidents = incidents.filter(
    (i) =>
      new Date(i.date) >= previousPeriodStart && new Date(i.date) < periodStart
  );

  const byType = groupBy(recentIncidents, 'type');
  const bySeverity = groupBy(recentIncidents, 'severity');

  return {
    total: recentIncidents.length,
    change: recentIncidents.length - previousIncidents.length,
    changePercent:
      previousIncidents.length > 0
        ? ((recentIncidents.length - previousIncidents.length) /
            previousIncidents.length) *
          100
        : 0,
    byType: Object.entries(byType).map(([type, items]) => ({
      type,
      count: items.length,
      percentage: (items.length / recentIncidents.length) * 100,
    })),
    bySeverity: Object.entries(bySeverity).map(([severity, items]) => ({
      severity,
      count: items.length,
      percentage: (items.length / recentIncidents.length) * 100,
    })),
    resolvedRate:
      recentIncidents.length > 0
        ? (recentIncidents.filter((i) => i.resolved).length / recentIncidents.length) * 100
        : 0,
  };
}

/**
 * Appointment analytics
 */
export interface AppointmentData {
  id: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: string;
  duration: number;
}

export function calculateAppointmentMetrics(appointments: AppointmentData[]) {
  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;
  const noShow = appointments.filter((a) => a.status === 'no-show').length;

  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  const cancellationRate = total > 0 ? (cancelled / total) * 100 : 0;
  const noShowRate = total > 0 ? (noShow / total) * 100 : 0;

  const byType = groupBy(appointments, 'type');
  const averageDuration =
    appointments.reduce((sum, a) => sum + a.duration, 0) / (appointments.length || 1);

  return {
    total,
    completed,
    cancelled,
    noShow,
    completionRate,
    cancellationRate,
    noShowRate,
    averageDuration,
    byType: Object.entries(byType).map(([type, items]) => ({
      type,
      count: items.length,
      averageDuration: items.reduce((sum, a) => sum + a.duration, 0) / items.length,
    })),
  };
}

/**
 * Inventory analytics
 */
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  expirationDate: Date | null;
  category: string;
}

export function analyzeInventory(items: InventoryItem[]) {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const lowStock = items.filter((item) => item.quantity <= item.minQuantity);
  const expiringSoon = items.filter(
    (item) =>
      item.expirationDate &&
      new Date(item.expirationDate) <= thirtyDaysFromNow &&
      new Date(item.expirationDate) > now
  );
  const expired = items.filter(
    (item) => item.expirationDate && new Date(item.expirationDate) <= now
  );

  const byCategory = groupBy(items, 'category');

  return {
    total: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    lowStock: {
      count: lowStock.length,
      percentage: (lowStock.length / items.length) * 100,
      items: lowStock,
    },
    expiringSoon: {
      count: expiringSoon.length,
      percentage: (expiringSoon.length / items.length) * 100,
      items: expiringSoon,
    },
    expired: {
      count: expired.length,
      percentage: (expired.length / items.length) * 100,
      items: expired,
    },
    byCategory: Object.entries(byCategory).map(([category, categoryItems]) => ({
      category,
      count: categoryItems.length,
      totalQuantity: categoryItems.reduce((sum, item) => sum + item.quantity, 0),
      lowStockCount: categoryItems.filter((item) => item.quantity <= item.minQuantity)
        .length,
    })),
  };
}

/**
 * Statistical calculations
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;

  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.map((v) => Math.pow(v - avg, 2));
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;

  return Math.sqrt(variance);
}

export function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Utility: Group by property
 */
function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Date range utilities
 */
export function getDateRange(
  range: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom',
  customStart?: Date,
  customEnd?: Date
): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  let start = new Date(now);

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
    case 'custom':
      if (customStart && customEnd) {
        start = new Date(customStart);
        end = new Date(customEnd);
      }
      break;
  }

  return { start, end };
}

/**
 * Time-based aggregation
 */
export function aggregateByTimeInterval<T extends { date: Date }>(
  data: T[],
  interval: 'hour' | 'day' | 'week' | 'month',
  aggregator: (items: T[]) => any
) {
  const groups = new Map<string, T[]>();

  data.forEach((item) => {
    const date = new Date(item.date);
    let key: string;

    switch (interval) {
      case 'hour':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
        break;
      case 'day':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        break;
      case 'week':
        const weekNum = getWeekNumber(date);
        key = `${date.getFullYear()}-W${weekNum}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth()}`;
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

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Performance metrics
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
}

export function calculatePerformanceScore(metrics: PerformanceMetric[]): number {
  const scores = metrics.map((metric) => {
    const achievement = (metric.value / metric.target) * 100;
    return Math.min(achievement, 100);
  });

  return scores.reduce((sum, score) => sum + score, 0) / (scores.length || 1);
}

/**
 * Cohort analysis
 */
export interface CohortData {
  studentId: string;
  cohort: string;
  metric: number;
}

export function analyzeCohorts(data: CohortData[]) {
  const byCohort = groupBy(data, 'cohort');

  return Object.entries(byCohort).map(([cohort, items]) => {
    const values = items.map((i) => i.metric);

    return {
      cohort,
      count: items.length,
      average: values.reduce((sum, v) => sum + v, 0) / values.length,
      median: calculateMedian(values),
      min: Math.min(...values),
      max: Math.max(...values),
      stdDev: calculateStandardDeviation(values),
    };
  });
}
