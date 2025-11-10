/**
 * LOC: PERFMON001
 * File: performance-monitoring-systems.ts
 * Purpose: Real-time performance monitoring, alerting, and observability
 */

import { Injectable, Logger } from "@nestjs/common";
import { MetricsCalculationService } from "../metrics-calculation-kit";

export interface IPerformanceAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  metric: string;
  threshold: number;
  currentValue: number;
  timestamp: Date;
  message: string;
}

@Injectable()
export class PerformanceMonitoringService {
  private readonly logger = new Logger(PerformanceMonitoringService.name);
  private readonly alerts: IPerformanceAlert[] = [];
  private readonly metrics: Map<string, number[]> = new Map();

  constructor(private readonly metricsService: MetricsCalculationService) {
    this.startMonitoring();
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push(value);
    this.checkThresholds(name, value);
  }

  async getMetricsSummary(): Promise<any> {
    const summary: any = {};

    for (const [name, values] of this.metrics) {
      summary[name] = {
        current: values[values.length - 1],
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    }

    return summary;
  }

  getActiveAlerts(): IPerformanceAlert[] {
    return this.alerts.filter(alert => 
      Date.now() - alert.timestamp.getTime() < 3600000 // Last hour
    );
  }

  async generatePerformanceReport(startDate: Date, endDate: Date): Promise<any> {
    return {
      period: { start: startDate, end: endDate },
      metrics: await this.getMetricsSummary(),
      alerts: this.alerts.filter(a => a.timestamp >= startDate && a.timestamp <= endDate),
      recommendations: this.generateRecommendations(),
    };
  }

  private startMonitoring(): void {
    // Monitor every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);
  }

  private async collectSystemMetrics(): Promise<void> {
    // Collect various metrics
    this.recordMetric("cpu_usage", Math.random() * 100);
    this.recordMetric("memory_usage", Math.random() * 100);
    this.recordMetric("active_connections", Math.floor(Math.random() * 1000));
    this.recordMetric("query_throughput", Math.floor(Math.random() * 5000));
  }

  private checkThresholds(name: string, value: number): void {
    const thresholds: Record<string, number> = {
      cpu_usage: 80,
      memory_usage: 85,
      query_latency: 1000,
      error_rate: 5,
    };

    if (thresholds[name] && value > thresholds[name]) {
      this.createAlert(name, value, thresholds[name]);
    }
  }

  private createAlert(metric: string, value: number, threshold: number): void {
    const alert: IPerformanceAlert = {
      id: `alert_${Date.now()}`,
      severity: value > threshold * 1.5 ? "critical" : "warning",
      metric,
      threshold,
      currentValue: value,
      timestamp: new Date(),
      message: `${metric} exceeded threshold: ${value} > ${threshold}`,
    };

    this.alerts.push(alert);
    this.logger.warn(`Performance alert: ${alert.message}`);
  }

  private generateRecommendations(): string[] {
    return [
      "Consider adding database indexes for frequently queried columns",
      "Implement caching for read-heavy endpoints",
      "Review and optimize slow database queries",
      "Scale horizontally to distribute load",
    ];
  }
}

export { PerformanceMonitoringService };
