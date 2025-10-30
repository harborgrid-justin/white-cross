import { Injectable, Logger } from '@nestjs/common';
import { MetricsSnapshot, MetricLabels, HistogramEntry } from '../interfaces/metrics.interface';

@Injectable()
export class DiscoveryMetricsService {
  private readonly logger = new Logger(DiscoveryMetricsService.name);
  private counters = new Map<string, Map<string, number>>();
  private histograms = new Map<string, Array<HistogramEntry>>();
  private gauges = new Map<string, { value: number; labels: Record<string, string>; timestamp: number }>();
  private readonly maxHistogramEntries = 1000;

  /**
   * Increment a counter metric
   */
  incrementCounter(name: string, labels: Record<string, string> = {}) {
    const labelKey = this.createLabelKey(labels);
    
    if (!this.counters.has(name)) {
      this.counters.set(name, new Map());
    }
    
    const counter = this.counters.get(name)!;
    const currentValue = counter.get(labelKey) || 0;
    counter.set(labelKey, currentValue + 1);
  }

  /**
   * Record a histogram value (for timing, sizes, etc.)
   */
  recordHistogram(name: string, value: number, labels: Record<string, string> = {}) {
    if (!this.histograms.has(name)) {
      this.histograms.set(name, []);
    }
    
    const histogram = this.histograms.get(name)!;
    histogram.push({
      value,
      labels,
      timestamp: Date.now(),
    });
    
    // Keep only the most recent entries to prevent memory leaks
    if (histogram.length > this.maxHistogramEntries) {
      histogram.splice(0, histogram.length - this.maxHistogramEntries);
    }
  }

  /**
   * Set a gauge value (for current state measurements)
   */
  recordGauge(name: string, value: number, labels: Record<string, string> = {}) {
    this.gauges.set(name, {
      value,
      labels,
      timestamp: Date.now(),
    });
  }

  /**
   * Get all metrics as a snapshot
   */
  getMetrics(): MetricsSnapshot {
    return {
      counters: this.serializeCounters(),
      histograms: this.serializeHistograms(),
      gauges: this.serializeGauges(),
      timestamp: Date.now(),
    };
  }

  /**
   * Calculate average response times from histogram data
   */
  calculateAverageResponseTimes(timeWindowMs: number = 300000): Record<string, number> { // 5 minutes default
    const averages: Record<string, number> = {};
    const cutoff = Date.now() - timeWindowMs;

    for (const [name, entries] of this.histograms.entries()) {
      if (name.includes('duration')) {
        const recentEntries = entries.filter(entry => entry.timestamp > cutoff);
        
        if (recentEntries.length > 0) {
          const sum = recentEntries.reduce((total, entry) => total + entry.value, 0);
          averages[name] = sum / recentEntries.length;
        }
      }
    }

    return averages;
  }

  /**
   * Calculate error rates from counter data
   */
  calculateErrorRates(timeWindowMs: number = 300000): Record<string, number> {
    const errorRates: Record<string, number> = {};
    
    // This would need to be enhanced based on how errors are tracked
    // For now, return basic error rate calculation
    const errorCounter = this.counters.get('discovery_errors_total');
    const requestCounter = this.counters.get('discovery_requests_total');
    
    if (errorCounter && requestCounter) {
      const totalErrors = Array.from(errorCounter.values()).reduce((sum, count) => sum + count, 0);
      const totalRequests = Array.from(requestCounter.values()).reduce((sum, count) => sum + count, 0);
      
      if (totalRequests > 0) {
        errorRates['overall'] = (totalErrors / totalRequests) * 100;
      }
    }
    
    return errorRates;
  }

  /**
   * Export metrics in Prometheus format
   */
  async exportPrometheusMetrics(): Promise<string> {
    let prometheusOutput = '';
    const timestamp = Date.now();

    // Export counters
    for (const [name, counterMap] of this.counters.entries()) {
      prometheusOutput += `# HELP ${name} Counter metric\n`;
      prometheusOutput += `# TYPE ${name} counter\n`;
      
      for (const [labelKey, value] of counterMap.entries()) {
        const labels = this.parseLabelKey(labelKey);
        const labelString = this.formatPrometheusLabels(labels);
        prometheusOutput += `${name}${labelString} ${value} ${timestamp}\n`;
      }
    }

    // Export gauges
    for (const [name, gauge] of this.gauges.entries()) {
      prometheusOutput += `# HELP ${name} Gauge metric\n`;
      prometheusOutput += `# TYPE ${name} gauge\n`;
      
      const labelString = this.formatPrometheusLabels(gauge.labels);
      prometheusOutput += `${name}${labelString} ${gauge.value} ${gauge.timestamp}\n`;
    }

    // Export histograms (simplified as summaries for now)
    for (const [name, entries] of this.histograms.entries()) {
      if (entries.length === 0) continue;
      
      prometheusOutput += `# HELP ${name} Histogram metric\n`;
      prometheusOutput += `# TYPE ${name} histogram\n`;
      
      // Calculate percentiles
      const values = entries.map(e => e.value).sort((a, b) => a - b);
      const percentiles = [0.5, 0.95, 0.99];
      
      for (const p of percentiles) {
        const index = Math.floor(values.length * p);
        const value = values[index] || 0;
        prometheusOutput += `${name}{quantile="${p}"} ${value} ${timestamp}\n`;
      }
      
      // Count and sum
      prometheusOutput += `${name}_count ${values.length} ${timestamp}\n`;
      prometheusOutput += `${name}_sum ${values.reduce((sum, v) => sum + v, 0)} ${timestamp}\n`;
    }

    return prometheusOutput;
  }

  /**
   * Clear all metrics (useful for testing or reset)
   */
  clearMetrics(): void {
    this.counters.clear();
    this.histograms.clear();
    this.gauges.clear();
    this.logger.log('All metrics cleared');
  }

  /**
   * Get basic statistics about metrics collection
   */
  getMetricsStats(): {
    counters: number;
    histograms: number;
    gauges: number;
    totalHistogramEntries: number;
  } {
    const totalHistogramEntries = Array.from(this.histograms.values())
      .reduce((total, entries) => total + entries.length, 0);

    return {
      counters: this.counters.size,
      histograms: this.histograms.size,
      gauges: this.gauges.size,
      totalHistogramEntries,
    };
  }

  private createLabelKey(labels: Record<string, string>): string {
    return JSON.stringify(labels);
  }

  private parseLabelKey(labelKey: string): Record<string, string> {
    try {
      return JSON.parse(labelKey);
    } catch {
      return {};
    }
  }

  private formatPrometheusLabels(labels: Record<string, string>): string {
    const labelPairs = Object.entries(labels)
      .map(([key, value]) => `${key}="${value}"`)
      .join(',');
    
    return labelPairs ? `{${labelPairs}}` : '';
  }

  private serializeCounters(): Record<string, Record<string, number>> {
    const result: Record<string, Record<string, number>> = {};
    
    for (const [name, counterMap] of this.counters.entries()) {
      result[name] = Object.fromEntries(counterMap.entries());
    }
    
    return result;
  }

  private serializeHistograms(): Record<string, Array<HistogramEntry>> {
    return Object.fromEntries(this.histograms.entries());
  }

  private serializeGauges(): Record<string, { value: number; labels: Record<string, string>; timestamp: number }> {
    return Object.fromEntries(this.gauges.entries());
  }
}
