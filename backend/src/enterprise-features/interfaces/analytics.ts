import { TrendDirection } from './enums';

export interface DashboardMetric {
  name: string;
  value: number;
  trend: TrendDirection;
  change: number;
  changePercent: number;
  unit: string;
  period: string;
  lastUpdated: Date;
}

export interface HealthTrendData {
  period: string;
  metrics: Array<{
    name: string;
    value: number;
    previousValue: number;
    change: number;
    changePercent: number;
  }>;
  alerts: Array<{
    type: 'warning' | 'critical';
    message: string;
    metric: string;
  }>;
}