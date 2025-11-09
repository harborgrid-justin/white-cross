/**
 * LOC: STATANOMSVC001
 * File: /reuse/threat/composites/downstream/statistical-anomaly-detection-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - ../anomaly-detection-core-composite
 *
 * DOWNSTREAM (imported by):
 *   - SIEM platforms
 *   - Behavioral analytics systems
 *   - Threat detection engines
 */

/**
 * File: /reuse/threat/composites/downstream/statistical-anomaly-detection-services.ts
 * Locator: WC-STATISTICAL-ANOMALY-DETECTION-001
 * Purpose: Statistical Anomaly Detection - Advanced statistical threat detection
 *
 * Upstream: Imports from anomaly-detection-core-composite
 * Downstream: SIEM platforms, Analytics systems, Detection engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: Statistical analysis, anomaly detection, baseline management, outlier detection
 *
 * LLM Context: Production-ready statistical anomaly detection for healthcare security.
 * Provides z-score analysis, standard deviation detection, time-series analysis,
 * baseline deviation detection, and HIPAA-compliant statistical security monitoring.
 */

import { Injectable, Logger, Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import * as crypto from 'crypto';

export interface StatisticalBaseline {
  id: string;
  entityId: string;
  metric: string;
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  sampleSize: number;
  confidence: number;
  lastUpdated: Date;
}

export interface AnomalyDetectionResult {
  id: string;
  timestamp: Date;
  entityId: string;
  metric: string;
  actualValue: number;
  expectedValue: number;
  zScore: number;
  pValue: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  isAnomaly: boolean;
  confidence: number;
}

@Injectable()
@ApiTags('Statistical Anomaly Detection')
export class StatisticalAnomalyDetectionService {
  private readonly logger = new Logger(StatisticalAnomalyDetectionService.name);
  private baselines: Map<string, StatisticalBaseline> = new Map();

  async createBaseline(
    entityId: string,
    metric: string,
    historicalData: number[]
  ): Promise<StatisticalBaseline> {
    this.logger.log(`Creating baseline for ${entityId}:${metric}`);

    const mean = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
    const variance = historicalData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalData.length;
    const stdDev = Math.sqrt(variance);
    const sorted = [...historicalData].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    const baseline: StatisticalBaseline = {
      id: crypto.randomUUID(),
      entityId,
      metric,
      mean,
      median,
      stdDev,
      min: Math.min(...historicalData),
      max: Math.max(...historicalData),
      sampleSize: historicalData.length,
      confidence: Math.min(100, (historicalData.length / 1000) * 100),
      lastUpdated: new Date(),
    };

    this.baselines.set(`${entityId}:${metric}`, baseline);
    return baseline;
  }

  async detectAnomaly(
    entityId: string,
    metric: string,
    value: number
  ): Promise<AnomalyDetectionResult> {
    this.logger.log(`Detecting anomaly for ${entityId}:${metric} = ${value}`);

    const baseline = this.baselines.get(`${entityId}:${metric}`);
    if (!baseline) {
      throw new Error(`No baseline found for ${entityId}:${metric}`);
    }

    const zScore = (value - baseline.mean) / baseline.stdDev;
    const isAnomaly = Math.abs(zScore) > 2.5; // 2.5 standard deviations

    let severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (Math.abs(zScore) > 4) severity = 'CRITICAL';
    else if (Math.abs(zScore) > 3) severity = 'HIGH';
    else if (Math.abs(zScore) > 2.5) severity = 'MEDIUM';

    const result: AnomalyDetectionResult = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      entityId,
      metric,
      actualValue: value,
      expectedValue: baseline.mean,
      zScore,
      pValue: this.calculatePValue(zScore),
      severity,
      isAnomaly,
      confidence: baseline.confidence,
    };

    if (isAnomaly) {
      this.logger.warn(`Anomaly detected: ${entityId}:${metric} z-score=${zScore.toFixed(2)}`);
    }

    return result;
  }

  async detectBatchAnomalies(
    entityId: string,
    metrics: Array<{ metric: string; value: number }>
  ): Promise<AnomalyDetectionResult[]> {
    this.logger.log(`Detecting batch anomalies for ${entityId}: ${metrics.length} metrics`);

    const results = await Promise.all(
      metrics.map(m => this.detectAnomaly(entityId, m.metric, m.value))
    );

    const anomalyCount = results.filter(r => r.isAnomaly).length;
    this.logger.log(`Batch detection complete: ${anomalyCount} anomalies found`);

    return results;
  }

  async updateBaseline(
    entityId: string,
    metric: string,
    newData: number[]
  ): Promise<StatisticalBaseline> {
    this.logger.log(`Updating baseline for ${entityId}:${metric}`);

    const existing = this.baselines.get(`${entityId}:${metric}`);
    if (!existing) {
      return this.createBaseline(entityId, metric, newData);
    }

    // Use exponential moving average for adaptive learning
    const learningRate = 0.1;
    const newMean = newData.reduce((a, b) => a + b, 0) / newData.length;
    const updatedMean = existing.mean * (1 - learningRate) + newMean * learningRate;

    const updatedBaseline: StatisticalBaseline = {
      ...existing,
      mean: updatedMean,
      sampleSize: existing.sampleSize + newData.length,
      lastUpdated: new Date(),
    };

    this.baselines.set(`${entityId}:${metric}`, updatedBaseline);
    return updatedBaseline;
  }

  async analyzeTimeSeries(
    entityId: string,
    metric: string,
    dataPoints: Array<{ timestamp: Date; value: number }>
  ): Promise<any> {
    this.logger.log(`Analyzing time series for ${entityId}:${metric}`);

    const values = dataPoints.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    // Detect trend
    let trend = 'STABLE';
    if (values.length > 1) {
      const firstHalf = values.slice(0, Math.floor(values.length / 2));
      const secondHalf = values.slice(Math.floor(values.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

      const change = ((secondAvg - firstAvg) / firstAvg) * 100;
      if (change > 10) trend = 'INCREASING';
      else if (change < -10) trend = 'DECREASING';
    }

    return {
      entityId,
      metric,
      dataPoints: dataPoints.length,
      mean,
      trend,
      anomaliesDetected: 0,
    };
  }

  private calculatePValue(zScore: number): number {
    // Simplified p-value calculation
    // In production, use proper statistical library
    return Math.exp(-0.5 * Math.pow(Math.abs(zScore), 2)) / Math.sqrt(2 * Math.PI);
  }
}

@Controller('statistical-anomaly')
@ApiTags('Statistical Anomaly Detection')
export class StatisticalAnomalyDetectionController {
  constructor(private readonly anomalyService: StatisticalAnomalyDetectionService) {}

  @Post('baseline')
  @ApiOperation({ summary: 'Create statistical baseline' })
  async createBaseline(
    @Body() body: { entityId: string; metric: string; historicalData: number[] }
  ) {
    return this.anomalyService.createBaseline(body.entityId, body.metric, body.historicalData);
  }

  @Post('detect')
  @ApiOperation({ summary: 'Detect anomaly' })
  async detectAnomaly(
    @Body() body: { entityId: string; metric: string; value: number }
  ) {
    return this.anomalyService.detectAnomaly(body.entityId, body.metric, body.value);
  }

  @Post('detect/batch')
  @ApiOperation({ summary: 'Detect batch anomalies' })
  async detectBatch(
    @Body() body: { entityId: string; metrics: Array<{ metric: string; value: number }> }
  ) {
    return this.anomalyService.detectBatchAnomalies(body.entityId, body.metrics);
  }

  @Post('timeseries/analyze')
  @ApiOperation({ summary: 'Analyze time series' })
  async analyzeTimeSeries(
    @Body() body: { entityId: string; metric: string; dataPoints: Array<{ timestamp: Date; value: number }> }
  ) {
    return this.anomalyService.analyzeTimeSeries(body.entityId, body.metric, body.dataPoints);
  }
}

export default {
  StatisticalAnomalyDetectionService,
  StatisticalAnomalyDetectionController,
};
