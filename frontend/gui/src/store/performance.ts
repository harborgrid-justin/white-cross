/**
 * Performance Monitoring Middleware
 *
 * Tracks state update performance, provides optimization suggestions,
 * and monitors memory usage for the page builder.
 */

import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

export interface PerformanceMetrics {
  actionName: string;
  duration: number;
  timestamp: number;
  stateSize: number;
  memoryUsage?: number;
}

export interface PerformanceStats {
  totalActions: number;
  averageDuration: number;
  slowestAction: PerformanceMetrics | null;
  fastestAction: PerformanceMetrics | null;
  recentActions: PerformanceMetrics[];
  warnings: PerformanceWarning[];
}

export interface PerformanceWarning {
  type: 'slow-action' | 'large-state' | 'memory-pressure' | 'excessive-updates';
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
  suggestion?: string;
}

export interface PerformanceConfig {
  enabled: boolean;
  slowActionThreshold: number;
  largeStateThreshold: number;
  maxHistorySize: number;
  enableMemoryTracking: boolean;
  logToConsole: boolean;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private warnings: PerformanceWarning[] = [];
  private config: PerformanceConfig;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enabled: process.env.NODE_ENV === 'development',
      slowActionThreshold: 16,
      largeStateThreshold: 1024 * 100,
      maxHistorySize: 100,
      enableMemoryTracking: true,
      logToConsole: true,
      ...config,
    };
  }

  trackAction(actionName: string, duration: number, state: any): void {
    if (!this.config.enabled) return;

    const metric: PerformanceMetrics = {
      actionName,
      duration,
      timestamp: Date.now(),
      stateSize: this.calculateStateSize(state),
      memoryUsage: this.config.enableMemoryTracking ? this.getMemoryUsage() : undefined,
    };

    this.metrics.push(metric);
    if (this.metrics.length > this.config.maxHistorySize) {
      this.metrics.shift();
    }

    this.checkForWarnings(metric);
    if (this.config.logToConsole) {
      this.logMetric(metric);
    }
  }

  private calculateStateSize(state: any): number {
    try {
      return JSON.stringify(state).length;
    } catch (error) {
      return 0;
    }
  }

  private getMemoryUsage(): number | undefined {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  private checkForWarnings(metric: PerformanceMetrics): void {
    if (metric.duration > this.config.slowActionThreshold) {
      this.addWarning({
        type: 'slow-action',
        message: 'Action "' + metric.actionName + '" took ' + metric.duration.toFixed(2) + 'ms',
        timestamp: metric.timestamp,
        severity: metric.duration > this.config.slowActionThreshold * 2 ? 'high' : 'medium',
        suggestion: 'Consider optimizing this action or using debouncing',
      });
    }

    if (metric.stateSize > this.config.largeStateThreshold) {
      this.addWarning({
        type: 'large-state',
        message: 'State size is large',
        timestamp: metric.timestamp,
        severity: 'medium',
        suggestion: 'Consider normalizing data',
      });
    }
  }

  private addWarning(warning: PerformanceWarning): void {
    this.warnings.push(warning);
    if (this.warnings.length > 50) {
      this.warnings.shift();
    }
  }

  private logMetric(metric: PerformanceMetrics): void {
    const color = metric.duration > this.config.slowActionThreshold ? 'red' : 'green';
    console.log('[Perf] ' + metric.actionName + ' - ' + metric.duration.toFixed(2) + 'ms');
  }

  getStats(): PerformanceStats {
    if (this.metrics.length === 0) {
      return {
        totalActions: 0,
        averageDuration: 0,
        slowestAction: null,
        fastestAction: null,
        recentActions: [],
        warnings: this.warnings,
      };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    return {
      totalActions: this.metrics.length,
      averageDuration: totalDuration / this.metrics.length,
      slowestAction: this.metrics.reduce((s, c) => c.duration > s.duration ? c : s),
      fastestAction: this.metrics.reduce((f, c) => c.duration < f.duration ? c : f),
      recentActions: this.metrics.slice(-20),
      warnings: this.warnings,
    };
  }

  clearMetrics(): void {
    this.metrics = [];
    this.warnings = [];
  }
}

const globalMonitor = new PerformanceMonitor();

export function getPerformanceMonitor(): PerformanceMonitor {
  return globalMonitor;
}

export function usePerformanceStats(): PerformanceStats {
  return globalMonitor.getStats();
}

export function measureAction<T>(actionName: string, action: () => T): T {
  const start = performance.now();
  const result = action();
  const duration = performance.now() - start;
  if (duration > 16) {
    console.warn('Slow action:', actionName, duration + 'ms');
  }
  return result;
}
