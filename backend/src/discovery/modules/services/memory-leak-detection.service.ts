import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';

export interface LeakSuspect {
  providerName: string;
  memoryGrowthRate: number; // MB per minute
  suspiciousPatterns: string[];
  confidence: number; // 0-1
  firstDetected: number;
  lastUpdated: number;
}

export interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
  providerMemoryMap: Map<string, number>;
}

/**
 * Memory Leak Detection Service
 *
 * Detects potential memory leaks using Discovery Service patterns
 */
@Injectable()
export class MemoryLeakDetectionService {
  private readonly logger = new Logger(MemoryLeakDetectionService.name);
  private monitoredProviders = new Map<string, any>();
  private memorySnapshots: MemorySnapshot[] = [];
  private leakSuspects = new Map<string, LeakSuspect>();
  private detectionInterval?: NodeJS.Timeout;
  private readonly maxSnapshots = 500;
  private isMonitoring = false;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Add a provider to monitor for memory leaks
   */
  addMonitoredProvider(providerName: string, metadata: any): void {
    this.monitoredProviders.set(providerName, {
      ...metadata,
      addedAt: Date.now(),
      memoryHistory: [],
    });

    this.logger.log(`Added provider to leak monitoring: ${providerName}`, {
      alertThreshold: metadata.alertThreshold,
      monitoring: metadata.monitoring,
    });
  }

  /**
   * Start memory leak detection
   */
  startMonitoring(intervalMs: number = 60000): void {
    // Default 1 minute
    if (this.isMonitoring) {
      this.logger.warn('Memory leak detection already started');
      return;
    }

    this.isMonitoring = true;
    this.logger.log(
      `Starting memory leak detection with ${intervalMs}ms interval`,
    );

    this.detectionInterval = setInterval(async () => {
      await this.detectMemoryLeaks();
    }, intervalMs);
  }

  /**
   * Stop memory leak detection
   */
  stopMonitoring(): void {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = undefined;
    }

    this.isMonitoring = false;
    this.logger.log('Memory leak detection stopped');
  }

  /**
   * Detect memory leaks
   */
  async detectMemoryLeaks(): Promise<void> {
    try {
      // Take memory snapshot
      const snapshot = await this.takeMemorySnapshot();
      this.memorySnapshots.push(snapshot);

      // Keep snapshots within limit
      if (this.memorySnapshots.length > this.maxSnapshots) {
        this.memorySnapshots = this.memorySnapshots.slice(-this.maxSnapshots);
      }

      // Analyze memory patterns
      await this.analyzeMemoryPatterns();

      // Update leak suspects
      await this.updateLeakSuspects();

      // Log significant findings
      const criticalLeaks = Array.from(this.leakSuspects.values()).filter(
        (suspect) => suspect.confidence > 0.8,
      );

      if (criticalLeaks.length > 0) {
        this.logger.warn(
          `Detected ${criticalLeaks.length} potential memory leaks:`,
          criticalLeaks.map((leak) => ({
            provider: leak.providerName,
            growthRate: `${leak.memoryGrowthRate.toFixed(2)}MB/min`,
            confidence: `${(leak.confidence * 100).toFixed(1)}%`,
          })),
        );
      }
    } catch (error) {
      this.logger.error('Memory leak detection failed:', error);
    }
  }

  /**
   * Get current leak suspects
   */
  getLeakSuspects(): LeakSuspect[] {
    return Array.from(this.leakSuspects.values()).sort(
      (a, b) => b.confidence - a.confidence,
    );
  }

  /**
   * Get memory leak report
   */
  getLeakReport(): {
    summary: string;
    totalSuspects: number;
    criticalLeaks: LeakSuspect[];
    memoryTrend: 'increasing' | 'decreasing' | 'stable';
    recommendations: string[];
  } {
    const suspects = this.getLeakSuspects();
    const criticalLeaks = suspects.filter((s) => s.confidence > 0.8);
    const memoryTrend = this.calculateMemoryTrend();

    const recommendations: string[] = [];

    if (criticalLeaks.length > 0) {
      recommendations.push(
        `Investigate ${criticalLeaks.length} critical memory leaks immediately`,
      );
      recommendations.push(
        'Review event listeners, timers, and cache cleanup in affected providers',
      );
    }

    if (memoryTrend === 'increasing') {
      recommendations.push(
        'Monitor memory growth - consider implementing more aggressive cleanup',
      );
    }

    if (suspects.length > 5) {
      recommendations.push(
        'High number of leak suspects - review overall memory management strategy',
      );
    }

    const summary = [
      `Suspects: ${suspects.length}`,
      `Critical: ${criticalLeaks.length}`,
      `Trend: ${memoryTrend}`,
      `Memory: ${this.getCurrentMemoryMB().toFixed(1)}MB`,
    ].join(' | ');

    return {
      summary,
      totalSuspects: suspects.length,
      criticalLeaks,
      memoryTrend,
      recommendations,
    };
  }

  /**
   * Get memory growth analysis for a specific provider
   */
  getProviderMemoryAnalysis(providerName: string): {
    growthRate: number;
    patterns: string[];
    recommendation: string;
  } | null {
    const suspect = this.leakSuspects.get(providerName);
    if (!suspect) {
      return null;
    }

    let recommendation = 'No specific issues detected';

    if (suspect.confidence > 0.8) {
      recommendation = 'Critical: Immediate investigation required';
    } else if (suspect.confidence > 0.6) {
      recommendation = 'Warning: Monitor closely and consider optimization';
    } else if (suspect.confidence > 0.4) {
      recommendation = 'Caution: Review memory usage patterns';
    }

    return {
      growthRate: suspect.memoryGrowthRate,
      patterns: suspect.suspiciousPatterns,
      recommendation,
    };
  }

  /**
   * Clear leak suspects (useful after fixes are applied)
   */
  clearLeakSuspects(): void {
    this.leakSuspects.clear();
    this.logger.log('Cleared all leak suspects');
  }

  /**
   * Take a memory snapshot
   */
  private async takeMemorySnapshot(): Promise<MemorySnapshot> {
    const memoryUsage = process.memoryUsage();
    const providerMemoryMap = new Map<string, number>();

    // Estimate memory usage per provider (simplified approach)
    // In a real implementation, you might use more sophisticated memory profiling
    const providers = this.discoveryService.getProviders();
    let totalEstimatedMemory = 0;

    for (const wrapper of providers) {
      if (!wrapper.metatype) continue;

      const providerName = wrapper.name || 'unknown';

      // Simple heuristic: estimate memory based on provider type and metadata
      let estimatedMemory = 1024 * 1024; // 1MB base

      const cacheMetadata = this.reflector.get('cacheable', wrapper.metatype);
      if (cacheMetadata?.enabled) {
        estimatedMemory += (cacheMetadata.maxSize || 100) * 10000; // Rough estimate
      }

      const poolMetadata = this.reflector.get(
        'resource-pool',
        wrapper.metatype,
      );
      if (poolMetadata?.enabled) {
        estimatedMemory += (poolMetadata.maxSize || 10) * 100000; // Rough estimate
      }

      const leakProneMetadata = this.reflector.get(
        'leak-prone',
        wrapper.metatype,
      );
      if (leakProneMetadata?.monitoring) {
        estimatedMemory *= 1.5; // Increase estimate for leak-prone providers
      }

      providerMemoryMap.set(providerName, estimatedMemory);
      totalEstimatedMemory += estimatedMemory;
    }

    return {
      timestamp: Date.now(),
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      external: memoryUsage.external,
      arrayBuffers: memoryUsage.arrayBuffers,
      providerMemoryMap,
    };
  }

  /**
   * Analyze memory patterns from snapshots
   */
  private async analyzeMemoryPatterns(): Promise<void> {
    if (this.memorySnapshots.length < 5) {
      return; // Need at least 5 snapshots for pattern analysis
    }

    const recentSnapshots = this.memorySnapshots.slice(-10);

    // Analyze overall memory trend
    const memoryGrowth = this.calculateMemoryGrowthRate(recentSnapshots);

    // Analyze per-provider patterns
    for (const [providerName, _] of this.monitoredProviders) {
      await this.analyzeProviderMemoryPattern(providerName, recentSnapshots);
    }
  }

  /**
   * Analyze memory pattern for a specific provider
   */
  private async analyzeProviderMemoryPattern(
    providerName: string,
    snapshots: MemorySnapshot[],
  ): Promise<void> {
    const providerMemoryHistory = snapshots
      .map((snapshot) => snapshot.providerMemoryMap.get(providerName) || 0)
      .filter((memory) => memory > 0);

    if (providerMemoryHistory.length < 3) {
      return; // Need at least 3 data points
    }

    const growthRate = this.calculateGrowthRate(
      providerMemoryHistory,
      snapshots,
    );
    const suspiciousPatterns = this.identifySuspiciousPatterns(
      providerMemoryHistory,
    );
    const confidence = this.calculateLeakConfidence(
      growthRate,
      suspiciousPatterns,
      providerName,
    );

    if (confidence > 0.3) {
      // Only track if there's reasonable suspicion
      const existing = this.leakSuspects.get(providerName);

      this.leakSuspects.set(providerName, {
        providerName,
        memoryGrowthRate: growthRate,
        suspiciousPatterns,
        confidence,
        firstDetected: existing?.firstDetected || Date.now(),
        lastUpdated: Date.now(),
      });
    }
  }

  /**
   * Calculate memory growth rate in MB per minute
   */
  private calculateGrowthRate(
    memoryHistory: number[],
    snapshots: MemorySnapshot[],
  ): number {
    if (memoryHistory.length < 2) return 0;

    const firstMemory = memoryHistory[0];
    const lastMemory = memoryHistory[memoryHistory.length - 1];
    const firstTime = snapshots[0].timestamp;
    const lastTime = snapshots[snapshots.length - 1].timestamp;

    const timeDiffMinutes = (lastTime - firstTime) / (1000 * 60);
    const memoryDiffMB = (lastMemory - firstMemory) / (1024 * 1024);

    return timeDiffMinutes > 0 ? memoryDiffMB / timeDiffMinutes : 0;
  }

  /**
   * Identify suspicious memory patterns
   */
  private identifySuspiciousPatterns(memoryHistory: number[]): string[] {
    const patterns: string[] = [];

    // Check for consistent growth
    let growthCount = 0;
    for (let i = 1; i < memoryHistory.length; i++) {
      if (memoryHistory[i] > memoryHistory[i - 1]) {
        growthCount++;
      }
    }

    const growthRatio = growthCount / (memoryHistory.length - 1);
    if (growthRatio > 0.8) {
      patterns.push('Consistent memory growth');
    }

    // Check for sudden spikes
    const average =
      memoryHistory.reduce((a, b) => a + b, 0) / memoryHistory.length;
    const hasSpike = memoryHistory.some((memory) => memory > average * 2);
    if (hasSpike) {
      patterns.push('Memory spikes detected');
    }

    // Check for step increases
    let stepIncreases = 0;
    for (let i = 1; i < memoryHistory.length; i++) {
      const increase = memoryHistory[i] - memoryHistory[i - 1];
      if (increase > average * 0.5) {
        stepIncreases++;
      }
    }

    if (stepIncreases > 2) {
      patterns.push('Step-wise memory increases');
    }

    return patterns;
  }

  /**
   * Calculate confidence level for leak detection
   */
  private calculateLeakConfidence(
    growthRate: number,
    patterns: string[],
    providerName: string,
  ): number {
    let confidence = 0;

    // Growth rate factor (0-0.4)
    if (growthRate > 10) {
      // > 10MB/min
      confidence += 0.4;
    } else if (growthRate > 5) {
      // > 5MB/min
      confidence += 0.3;
    } else if (growthRate > 1) {
      // > 1MB/min
      confidence += 0.2;
    } else if (growthRate > 0.1) {
      // > 0.1MB/min
      confidence += 0.1;
    }

    // Pattern factor (0-0.3)
    confidence += Math.min(patterns.length * 0.1, 0.3);

    // Provider metadata factor (0-0.3)
    const monitoredProvider = this.monitoredProviders.get(providerName);
    if (monitoredProvider) {
      if (monitoredProvider.alertThreshold && growthRate > 0) {
        confidence += 0.1;
      }
      if (monitoredProvider.knownLeakProne) {
        confidence += 0.2;
      }
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Update leak suspects based on recent analysis
   */
  private async updateLeakSuspects(): Promise<void> {
    const now = Date.now();
    const staleThreshold = 10 * 60 * 1000; // 10 minutes

    // Remove stale suspects
    for (const [providerName, suspect] of this.leakSuspects.entries()) {
      if (now - suspect.lastUpdated > staleThreshold) {
        this.leakSuspects.delete(providerName);
        this.logger.log(`Removed stale leak suspect: ${providerName}`);
      }
    }
  }

  /**
   * Calculate overall memory trend
   */
  private calculateMemoryTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.memorySnapshots.length < 5) {
      return 'stable';
    }

    const recent = this.memorySnapshots.slice(-5);
    const memoryValues = recent.map((s) => s.heapUsed);
    const slope = this.calculateSlope(memoryValues);

    const threshold = 1024 * 1024; // 1MB
    if (slope > threshold) {
      return 'increasing';
    } else if (slope < -threshold) {
      return 'decreasing';
    } else {
      return 'stable';
    }
  }

  /**
   * Calculate slope for trend analysis
   */
  private calculateSlope(values: number[]): number {
    const n = values.length;
    if (n < 2) return 0;

    const xMean = (n - 1) / 2;
    const yMean = values.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = i - xMean;
      const yDiff = values[i] - yMean;
      numerator += xDiff * yDiff;
      denominator += xDiff * xDiff;
    }

    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Get current memory in MB
   */
  private getCurrentMemoryMB(): number {
    return process.memoryUsage().heapUsed / (1024 * 1024);
  }

  /**
   * Calculate memory growth rate from snapshots
   */
  private calculateMemoryGrowthRate(snapshots: MemorySnapshot[]): number {
    if (snapshots.length < 2) return 0;

    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];

    const timeDiffMinutes = (last.timestamp - first.timestamp) / (1000 * 60);
    const memoryDiffMB = (last.heapUsed - first.heapUsed) / (1024 * 1024);

    return timeDiffMinutes > 0 ? memoryDiffMB / timeDiffMinutes : 0;
  }
}
