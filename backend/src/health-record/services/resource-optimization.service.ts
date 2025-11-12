/**
 * @fileoverview Resource Optimization Service (Refactored)
 * @description Orchestrates resource optimization using smaller, focused services
 * @module health-record/services
 * HIPAA CRITICAL - This service optimizes PHI processing resources while maintaining compliance
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ResourceMetricsCollector, ResourceMetrics } from './resource-metrics-collector.service';
import { ResourceMonitor, ResourceAlert } from './resource-monitor.service';
import { ResourceOptimizationEngine, OptimizationRecommendation } from './resource-optimization-engine.service';
import { ResourceReporter } from './resource-reporter.service';

export interface ResourceOptimizationPlan {
  planId: string;
  name: string;
  description: string;
  targetResources: string[];
  recommendations: OptimizationRecommendation[];
  estimatedBenefits: Record<string, number>;
  implementationPhases: any[];
  complianceImpact: any;
  createdAt: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

@Injectable()
export class ResourceOptimizationService implements OnModuleDestroy {
  private readonly logger = new Logger(ResourceOptimizationService.name);
  private resourceHistory: ResourceMetrics[] = [];
  private alerts: Map<string, ResourceAlert> = new Map();
  private recommendations: Map<string, OptimizationRecommendation> = new Map();
  private optimizationPlans: Map<string, ResourceOptimizationPlan> = new Map();
  private predictiveModels: Map<string, any> = new Map();

  constructor(
    private readonly metricsCollector: ResourceMetricsCollector,
    private readonly resourceMonitor: ResourceMonitor,
    private readonly optimizationEngine: ResourceOptimizationEngine,
    private readonly resourceReporter: ResourceReporter,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Get current resource metrics by delegating to metrics collector
   */
  async getCurrentResourceMetrics(): Promise<ResourceMetrics> {
    return this.metricsCollector.collectResourceMetrics();
  }

  /**
   * Get active alerts by delegating to resource monitor
   */
  getActiveAlerts(): ResourceAlert[] {
    return this.resourceMonitor.getActiveAlerts();
  }

  /**
   * Generate resource report by delegating to resource reporter
   */
  async generateResourceReport(): Promise<any> {
    const currentMetrics = await this.getCurrentResourceMetrics();
    const activeAlerts = this.getActiveAlerts();
    const recommendations = this.optimizationEngine.getOptimizationRecommendations();
    
    return this.resourceReporter.generateResourceReport(
      currentMetrics,
      activeAlerts,
      recommendations,
      this.resourceHistory
    );
  }

  /**
   * Execute optimization by delegating to optimization engine
   */
  async executeOptimization(recommendationId: string): Promise<any> {
    return this.optimizationEngine.executeOptimization(recommendationId);
  }

  /**
   * Analyze for optimizations by delegating to optimization engine
   */
  async analyzeForOptimizations(): Promise<OptimizationRecommendation[]> {
    const currentMetrics = await this.getCurrentResourceMetrics();
    return this.optimizationEngine.analyzeForOptimizations(currentMetrics, this.resourceHistory);
  }

  /**
   * Get optimization recommendations by delegating to optimization engine
   */
  getOptimizationRecommendations(): OptimizationRecommendation[] {
    return this.optimizationEngine.getOptimizationRecommendations();
  }

  /**
   * Create optimization plan by delegating to optimization engine
   */
  async createOptimizationPlan(recommendations: OptimizationRecommendation[]): Promise<ResourceOptimizationPlan> {
    // Create a simple plan structure - in a real implementation this would be more complex
    const plan: ResourceOptimizationPlan = {
      planId: `plan-${Date.now()}`,
      name: 'Resource Optimization Plan',
      description: 'Automated resource optimization recommendations',
      targetResources: recommendations.map(r => r.type),
      recommendations,
      estimatedBenefits: {},
      implementationPhases: [],
      complianceImpact: {},
      createdAt: new Date(),
      status: 'PENDING'
    };
    
    this.optimizationPlans.set(plan.planId, plan);
    return plan;
  }

  /**
   * Get predictive insights by delegating to resource reporter
   */
  getPredictiveInsights(): any[] {
    // Return predictive insights from the resource reporter
    // This would need to be implemented in the reporter service
    return [];
  }

  /**
   * Calculate resource trends by delegating to resource reporter
   */
  calculateResourceTrends(): any {
    // Return trends from the resource reporter
    // This would need to be implemented in the reporter service
    return {};
  }

  /**
   * Scheduled task to collect metrics and check for alerts
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async collectMetricsAndMonitor(): Promise<void> {
    try {
      const metrics = await this.getCurrentResourceMetrics();
      this.resourceHistory.push(metrics);
      
      // Keep only last 100 metrics for trend analysis
      if (this.resourceHistory.length > 100) {
        this.resourceHistory = this.resourceHistory.slice(-100);
      }
      
      this.resourceMonitor.checkForAlerts(metrics);
    } catch (error) {
      this.logger.error('Failed to collect metrics and monitor', error);
    }
  }

  /**
   * Scheduled task to analyze for optimizations
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async analyzeAndOptimize(): Promise<void> {
    try {
      const recommendations = await this.analyzeForOptimizations();
      if (recommendations.length > 0) {
        await this.createOptimizationPlan(recommendations);
      }
    } catch (error) {
      this.logger.error('Failed to analyze and optimize', error);
    }
  }

  /**
   * Scheduled task for maintenance operations
   */
  @Cron(CronExpression.EVERY_HOUR)
  async performMaintenance(): Promise<void> {
    try {
      // Cleanup old data
      this.cleanupOldData();
    } catch (error) {
      this.logger.error('Failed to perform maintenance', error);
    }
  }

  /**
   * Cleanup old alerts and recommendations
   */
  private cleanupOldData(): void {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Cleanup old alerts
    for (const [id, alert] of Array.from(this.alerts.entries())) {
      if (alert.timestamp < oneWeekAgo) {
        this.alerts.delete(id);
      }
    }

    // Cleanup old recommendations (if they had timestamps)
    // Note: OptimizationRecommendation interface does not include createdAt
    // This cleanup would need to be implemented differently if needed
  }

  /**
   * Module destroy cleanup
   */
  onModuleDestroy(): void {
    this.resourceHistory.length = 0;
    this.alerts.clear();
    this.recommendations.clear();
    this.optimizationPlans.clear();
    this.predictiveModels.clear();

    this.logger.log('Resource Optimization Service destroyed');
  }
}
