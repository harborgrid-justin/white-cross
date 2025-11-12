/**
 * @fileoverview N+1 Query Detector Service
 * @module infrastructure/monitoring/services
 * @description Service for detecting N+1 query patterns in database operations
 */

import { Injectable, Logger } from '@nestjs/common';
import { N1QueryDetection, PerformanceAlert, QueryExecution } from '../types/query-monitor.types';

@Injectable()
export class N1QueryDetectorService {
  private readonly logger = new Logger(N1QueryDetectorService.name);

  // Configuration
  private readonly N1_DETECTION_WINDOW = 1000; // 1 second
  private readonly N1_OCCURRENCE_THRESHOLD = 5;

  // Storage
  private n1Detections: N1QueryDetection[] = [];
  private alerts: PerformanceAlert[] = [];

  constructor() {}

  /**
   * Analyze query executions for N+1 patterns
   */
  analyzeForN1Queries(queryExecutions: QueryExecution[], model?: string): void {
    const now = Date.now();

    // Group executions by signature within the detection window
    const recentExecutions = queryExecutions.filter(
      exec => now - exec.timestamp.getTime() < this.N1_DETECTION_WINDOW,
    );

    const signatureGroups = new Map<string, QueryExecution[]>();
    recentExecutions.forEach(exec => {
      if (!signatureGroups.has(exec.signature)) {
        signatureGroups.set(exec.signature, []);
      }
      signatureGroups.get(exec.signature)!.push(exec);
    });

    // Check each signature group for N+1 patterns
    signatureGroups.forEach((executions, signature) => {
      if (executions.length >= this.N1_OCCURRENCE_THRESHOLD) {
        this.detectAndRecordN1Pattern(signature, executions, model);
      }
    });
  }

  /**
   * Detect and record N+1 query pattern
   */
  private detectAndRecordN1Pattern(
    signature: string,
    executions: QueryExecution[],
    model?: string,
  ): void {
    const now = Date.now();

    // Check if this N+1 pattern was already detected recently
    const existingDetection = this.n1Detections.find(
      detection =>
        detection.pattern === signature &&
        now - detection.timestamp.getTime() < 60000, // Within last minute
    );

    if (existingDetection) {
      // Update existing detection
      existingDetection.occurrences = Math.max(existingDetection.occurrences, executions.length);
      return;
    }

    // Create new detection
    const detection: N1QueryDetection = {
      pattern: signature.substring(0, 200),
      occurrences: executions.length,
      withinTimeWindow: this.N1_DETECTION_WINDOW,
      likelyN1: true,
      affectedModel: model,
      timestamp: new Date(),
    };

    this.n1Detections.push(detection);

    // Trim detection history
    if (this.n1Detections.length > 50) {
      this.n1Detections.shift();
    }

    // Create alert
    this.createAlert(detection);

    this.logger.error(`N+1 QUERY DETECTED:`, {
      model,
      occurrences: executions.length,
      pattern: signature.substring(0, 200),
    });
  }

  /**
   * Create performance alert for N+1 detection
   */
  private createAlert(detection: N1QueryDetection): void {
    const alert: PerformanceAlert = {
      type: 'n1_detected',
      severity: 'critical',
      message: `N+1 query pattern detected: ${detection.occurrences} similar queries in ${detection.withinTimeWindow}ms`,
      details: detection,
      timestamp: new Date(),
    };

    this.alerts.push(alert);

    // Trim alert history
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }
  }

  /**
   * Get all N+1 detections
   */
  getN1Detections(limit: number = 10): N1QueryDetection[] {
    return [...this.n1Detections].slice(-limit);
  }

  /**
   * Get N+1 detections within time range
   */
  getN1DetectionsInRange(startTime: Date, endTime: Date): N1QueryDetection[] {
    return this.n1Detections.filter(
      detection => detection.timestamp >= startTime && detection.timestamp <= endTime,
    );
  }

  /**
   * Get recent N+1 detections by model
   */
  getN1DetectionsByModel(model: string, limit: number = 10): N1QueryDetection[] {
    return this.n1Detections
      .filter(detection => detection.affectedModel === model)
      .slice(-limit);
  }

  /**
   * Get N+1 detection count
   */
  getN1DetectionCount(): number {
    return this.n1Detections.length;
  }

  /**
   * Get total N+1 occurrences across all detections
   */
  getTotalN1Occurrences(): number {
    return this.n1Detections.reduce((total, detection) => total + detection.occurrences, 0);
  }

  /**
   * Get recent alerts
   */
  getAlerts(limit: number = 20): PerformanceAlert[] {
    return [...this.alerts].slice(-limit);
  }

  /**
   * Check if there are active N+1 patterns
   */
  hasActiveN1Patterns(): boolean {
    const now = Date.now();
    return this.n1Detections.some(
      detection => now - detection.timestamp.getTime() < 300000, // Within last 5 minutes
    );
  }

  /**
   * Get N+1 detection statistics
   */
  getN1Stats() {
    const detections = this.n1Detections;
    const total = detections.length;

    if (total === 0) {
      return {
        total: 0,
        totalOccurrences: 0,
        averageOccurrences: 0,
        modelsAffected: 0,
      };
    }

    const totalOccurrences = detections.reduce((sum, d) => sum + d.occurrences, 0);
    const averageOccurrences = totalOccurrences / total;
    const modelsAffected = new Set(detections.map(d => d.affectedModel)).size;

    return {
      total,
      totalOccurrences,
      averageOccurrences,
      modelsAffected,
    };
  }

  /**
   * Get most problematic N+1 patterns
   */
  getMostProblematicPatterns(limit: number = 5): N1QueryDetection[] {
    return [...this.n1Detections]
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, limit);
  }

  /**
   * Reset N+1 detection data
   */
  reset(): void {
    this.n1Detections = [];
    this.alerts = [];
    this.logger.log('N+1 query detector reset');
  }
}
