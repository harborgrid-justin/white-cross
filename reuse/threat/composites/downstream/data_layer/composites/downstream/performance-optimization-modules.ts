/**
 * LOC: PERFOPT001
 * File: performance-optimization-modules.ts
 * Purpose: Query performance optimization, caching strategies, and load optimization
 */

import { Injectable, Logger } from "@nestjs/common";
import { QueryOptimizationService } from "../query-optimization-kit";

export interface IPerformanceMetrics {
  queryTime: number;
  cacheHitRate: number;
  throughput: number;
  latency: { p50: number; p95: number; p99: number };
}

export interface IOptimizationRecommendation {
  type: "index" | "cache" | "query_rewrite" | "schema";
  severity: "high" | "medium" | "low";
  description: string;
  expectedImprovement: string;
  implementation: string;
}

@Injectable()
export class PerformanceOptimizationService {
  private readonly logger = new Logger(PerformanceOptimizationService.name);
  private readonly queryMetrics: Map<string, number[]> = new Map();

  constructor(private readonly queryOptService: QueryOptimizationService) {}

  async analyzeQueryPerformance(model: string, query: any): Promise<{
    executionTime: number;
    recommendations: IOptimizationRecommendation[];
  }> {
    const start = Date.now();
    
    // Analyze query structure
    const analysis = await this.queryOptService.analyzeQuery(model, query);
    const executionTime = Date.now() - start;

    // Generate recommendations
    const recommendations = this.generateRecommendations(analysis);

    // Track metrics
    this.trackQueryMetric(model, executionTime);

    return { executionTime, recommendations };
  }

  async optimizeQuery(model: string, query: any): Promise<any> {
    this.logger.log(`Optimizing query for ${model}`);
    
    // Apply optimization strategies
    const optimized = await this.queryOptService.optimizeQuery(model, query);
    
    // Add intelligent caching
    if (this.shouldCache(model, query)) {
      optimized.cache = { ttl: 300, key: this.generateCacheKey(model, query) };
    }

    return optimized;
  }

  getPerformanceMetrics(model: string): IPerformanceMetrics {
    const metrics = this.queryMetrics.get(model) || [];
    
    return {
      queryTime: this.calculateAverage(metrics),
      cacheHitRate: 0.75, // Would be calculated from actual cache hits
      throughput: 1000, // Queries per second
      latency: {
        p50: this.calculatePercentile(metrics, 50),
        p95: this.calculatePercentile(metrics, 95),
        p99: this.calculatePercentile(metrics, 99),
      },
    };
  }

  async identifySlowQueries(thresholdMs: number = 1000): Promise<Array<{ model: string; avgTime: number }>> {
    const slowQueries: Array<{ model: string; avgTime: number }> = [];

    for (const [model, times] of this.queryMetrics) {
      const avgTime = this.calculateAverage(times);
      if (avgTime > thresholdMs) {
        slowQueries.push({ model, avgTime });
      }
    }

    return slowQueries.sort((a, b) => b.avgTime - a.avgTime);
  }

  private generateRecommendations(analysis: any): IOptimizationRecommendation[] {
    const recommendations: IOptimizationRecommendation[] = [];

    if (analysis.missingIndexes && analysis.missingIndexes.length > 0) {
      recommendations.push({
        type: "index",
        severity: "high",
        description: `Missing indexes on columns: ${analysis.missingIndexes.join(", ")}`,
        expectedImprovement: "50-80% query time reduction",
        implementation: `CREATE INDEX idx_name ON table_name (${analysis.missingIndexes.join(", ")})`,
      });
    }

    if (analysis.fullTableScan) {
      recommendations.push({
        type: "query_rewrite",
        severity: "high",
        description: "Query performing full table scan",
        expectedImprovement: "90% query time reduction",
        implementation: "Add WHERE clause with indexed column or rewrite query",
      });
    }

    return recommendations;
  }

  private shouldCache(model: string, query: any): boolean {
    // Implement caching logic - cache reads, not writes
    return !query.update && !query.delete && !query.insert;
  }

  private generateCacheKey(model: string, query: any): string {
    return `${model}:${JSON.stringify(query)}`;
  }

  private trackQueryMetric(model: string, time: number): void {
    if (!this.queryMetrics.has(model)) {
      this.queryMetrics.set(model, []);
    }
    
    const metrics = this.queryMetrics.get(model)!;
    metrics.push(time);
    
    // Keep only last 1000 metrics
    if (metrics.length > 1000) {
      metrics.shift();
    }
  }

  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }
}

export { PerformanceOptimizationService };
