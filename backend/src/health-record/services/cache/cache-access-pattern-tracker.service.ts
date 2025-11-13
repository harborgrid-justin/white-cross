/**
 * @fileoverview Cache Access Pattern Tracker Service
 * @module health-record/services/cache
 * @description Tracks and analyzes cache access patterns for optimization
 */

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  AccessPattern,
  AccessFrequency,
  PredictiveCacheRecommendation,
  CacheAccessEvent,
} from './cache-interfaces';
import { CACHE_CONSTANTS, CACHE_EVENTS } from './cache-constants';

import { BaseService } from '../../../common/base';
@Injectable()
export class CacheAccessPatternTrackerService extends BaseService {
  private readonly accessPatterns = new Map<string, AccessPattern>();
  private readonly frequencyMap = new Map<string, AccessFrequency>();
  private readonly maxTrackedPatterns = CACHE_CONSTANTS.METRICS.MAX_TRACKED_PATTERNS;

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.setupEventListeners();
  }

  recordAccess(key: string, hit: boolean, responseTime: number, tier: string): void {
    try {
      this.updateAccessPattern(key, hit, responseTime, tier);
      this.updateFrequencyMap(key, hit);

      // Emit access event for monitoring
      this.eventEmitter.emit(CACHE_EVENTS.ACCESS_RECORDED, {
        key,
        hit,
        responseTime,
        tier,
        timestamp: new Date(),
      } as CacheAccessEvent);
    } catch (error) {
      this.logError(`Failed to record access for key ${key}:`, error);
    }
  }

  getAccessPattern(key: string): AccessPattern | null {
    return this.accessPatterns.get(key) || null;
  }

  getTopAccessedKeys(limit: number = 10): Array<{ key: string; pattern: AccessPattern }> {
    return Array.from(this.accessPatterns.entries())
      .sort(([, a], [, b]) => b.totalAccesses - a.totalAccesses)
      .slice(0, limit)
      .map(([key, pattern]) => ({ key, pattern }));
  }

  getPredictiveRecommendations(): PredictiveCacheRecommendation[] {
    const recommendations: PredictiveCacheRecommendation[] = [];

    for (const [key, pattern] of this.accessPatterns.entries()) {
      if (this.shouldPromoteToHigherTier(pattern)) {
        recommendations.push({
          key,
          action: 'promote',
          reason: 'High access frequency and hit rate',
          confidence: this.calculatePromotionConfidence(pattern),
          estimatedBenefit: this.calculateEstimatedBenefit(pattern),
        });
      } else if (this.shouldDemoteToLowerTier(pattern)) {
        recommendations.push({
          key,
          action: 'demote',
          reason: 'Low access frequency',
          confidence: this.calculateDemotionConfidence(pattern),
          estimatedBenefit: this.calculateEstimatedBenefit(pattern),
        });
      }
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  getAccessStats(): {
    totalKeys: number;
    totalAccesses: number;
    averageHitRate: number;
    topKeysByAccess: string[];
    patternsByFrequency: Record<string, number>;
  } {
    const totalAccesses = Array.from(this.accessPatterns.values())
      .reduce((sum, pattern) => sum + pattern.totalAccesses, 0);

    const totalHits = Array.from(this.accessPatterns.values())
      .reduce((sum, pattern) => sum + pattern.hits, 0);

    const averageHitRate = totalAccesses > 0 ? totalHits / totalAccesses : 0;

    const topKeysByAccess = this.getTopAccessedKeys(5).map(item => item.key);

    const patternsByFrequency = this.categorizePatternsByFrequency();

    return {
      totalKeys: this.accessPatterns.size,
      totalAccesses,
      averageHitRate,
      topKeysByAccess,
      patternsByFrequency,
    };
  }

  cleanupOldPatterns(maxAge: number = CACHE_CONSTANTS.METRICS.MAX_AGE): number {
    const cutoffTime = Date.now() - maxAge;
    let removedCount = 0;

    for (const [key, pattern] of this.accessPatterns.entries()) {
      if (pattern.lastAccessed.getTime() < cutoffTime) {
        this.accessPatterns.delete(key);
        this.frequencyMap.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      this.logInfo(`Cleaned up ${removedCount} old access patterns`);
    }

    return removedCount;
  }

  reset(): void {
    this.accessPatterns.clear();
    this.frequencyMap.clear();
    this.logInfo('Access pattern tracking reset');
  }

  private setupEventListeners(): void {
    // Listen for cache invalidation events to update patterns
    this.eventEmitter.on(CACHE_EVENTS.INVALIDATED, (data: { key: string }) => {
      const pattern = this.accessPatterns.get(data.key);
      if (pattern) {
        pattern.invalidations++;
        pattern.lastInvalidated = new Date();
      }
    });

    // Listen for cache warming events
    this.eventEmitter.on(CACHE_EVENTS.WARMED, (data: { key: string; success: boolean }) => {
      const pattern = this.accessPatterns.get(data.key);
      if (pattern) {
        pattern.warmingAttempts++;
        if (data.success) {
          pattern.successfulWarmings++;
        }
      }
    });
  }

  private updateAccessPattern(key: string, hit: boolean, responseTime: number, tier: string): void {
    let pattern = this.accessPatterns.get(key);

    if (!pattern) {
      if (this.accessPatterns.size >= this.maxTrackedPatterns) {
        this.evictLeastImportantPattern();
      }

      pattern = {
        key,
        totalAccesses: 0,
        hits: 0,
        misses: 0,
        averageResponseTime: 0,
        lastAccessed: new Date(),
        firstAccessed: new Date(),
        accessFrequency: 'low',
        tier,
        invalidations: 0,
        warmingAttempts: 0,
        successfulWarmings: 0,
        lastInvalidated: null,
      };
      this.accessPatterns.set(key, pattern);
    }

    pattern.totalAccesses++;
    if (hit) {
      pattern.hits++;
    } else {
      pattern.misses++;
    }

    // Update rolling average response time
    pattern.averageResponseTime = (
      (pattern.averageResponseTime * (pattern.totalAccesses - 1)) + responseTime
    ) / pattern.totalAccesses;

    pattern.lastAccessed = new Date();
    pattern.tier = tier;
    pattern.accessFrequency = this.calculateAccessFrequency(pattern);
  }

  private updateFrequencyMap(key: string, hit: boolean): void {
    let frequency = this.frequencyMap.get(key);

    if (!frequency) {
      frequency = {
        key,
        hourlyAccesses: 0,
        dailyAccesses: 0,
        weeklyAccesses: 0,
        lastHourAccesses: 0,
        lastDayAccesses: 0,
        lastWeekAccesses: 0,
        hitRate: 0,
        lastUpdated: new Date(),
      };
      this.frequencyMap.set(key, frequency);
    }

    frequency.hourlyAccesses++;
    frequency.dailyAccesses++;
    frequency.lastHourAccesses++;
    frequency.lastDayAccesses++;
    frequency.lastWeekAccesses++;

    // Update hit rate
    const pattern = this.accessPatterns.get(key);
    if (pattern) {
      frequency.hitRate = pattern.hits / pattern.totalAccesses;
    }

    frequency.lastUpdated = new Date();
  }

  private calculateAccessFrequency(pattern: AccessPattern): 'low' | 'medium' | 'high' | 'very_high' {
    const accessesPerHour = pattern.totalAccesses / 
      Math.max(1, (Date.now() - pattern.firstAccessed.getTime()) / (1000 * 60 * 60));

    if (accessesPerHour >= CACHE_CONSTANTS.METRICS.FREQUENCY_THRESHOLDS.VERY_HIGH) return 'very_high';
    if (accessesPerHour >= CACHE_CONSTANTS.METRICS.FREQUENCY_THRESHOLDS.HIGH) return 'high';
    if (accessesPerHour >= CACHE_CONSTANTS.METRICS.FREQUENCY_THRESHOLDS.MEDIUM) return 'medium';
    return 'low';
  }

  private shouldPromoteToHigherTier(pattern: AccessPattern): boolean {
    const hitRate = pattern.hits / pattern.totalAccesses;
    return (
      pattern.accessFrequency === 'high' || pattern.accessFrequency === 'very_high'
    ) && hitRate > CACHE_CONSTANTS.METRICS.PROMOTION_HIT_RATE_THRESHOLD
      && pattern.averageResponseTime > CACHE_CONSTANTS.METRICS.PROMOTION_RESPONSE_TIME_THRESHOLD;
  }

  private shouldDemoteToLowerTier(pattern: AccessPattern): boolean {
    const timeSinceLastAccess = Date.now() - pattern.lastAccessed.getTime();
    return timeSinceLastAccess > CACHE_CONSTANTS.METRICS.DEMOTION_TIME_THRESHOLD
      && pattern.accessFrequency === 'low';
  }

  private calculatePromotionConfidence(pattern: AccessPattern): number {
    const hitRate = pattern.hits / pattern.totalAccesses;
    const frequencyScore = pattern.accessFrequency === 'very_high' ? 1 : 
                          pattern.accessFrequency === 'high' ? 0.8 : 0.6;
    const hitRateScore = Math.min(hitRate / 0.9, 1); // Max confidence at 90% hit rate
    return (frequencyScore + hitRateScore) / 2;
  }

  private calculateDemotionConfidence(pattern: AccessPattern): number {
    const timeSinceLastAccess = Date.now() - pattern.lastAccessed.getTime();
    const timeScore = Math.min(timeSinceLastAccess / (7 * 24 * 60 * 60 * 1000), 1); // Max at 1 week
    const frequencyScore = pattern.accessFrequency === 'low' ? 1 : 0.5;
    return (timeScore + frequencyScore) / 2;
  }

  private calculateEstimatedBenefit(pattern: AccessPattern): number {
    // Rough estimation of performance benefit in milliseconds saved per access
    return pattern.averageResponseTime * (pattern.hits / pattern.totalAccesses) * pattern.totalAccesses;
  }

  private categorizePatternsByFrequency(): Record<string, number> {
    const categories = {
      very_high: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const pattern of this.accessPatterns.values()) {
      categories[pattern.accessFrequency]++;
    }

    return categories;
  }

  private evictLeastImportantPattern(): void {
    if (this.accessPatterns.size === 0) return;

    let leastImportantKey: string | null = null;
    let lowestScore = Infinity;

    for (const [key, pattern] of this.accessPatterns.entries()) {
      const score = this.calculatePatternImportanceScore(pattern);
      if (score < lowestScore) {
        lowestScore = score;
        leastImportantKey = key;
      }
    }

    if (leastImportantKey) {
      this.accessPatterns.delete(leastImportantKey);
      this.frequencyMap.delete(leastImportantKey);
    }
  }

  private calculatePatternImportanceScore(pattern: AccessPattern): number {
    const recencyScore = Date.now() - pattern.lastAccessed.getTime();
    const frequencyScore = pattern.totalAccesses;
    const hitRateScore = pattern.hits / pattern.totalAccesses;

    // Lower score = less important (more likely to be evicted)
    return recencyScore / (frequencyScore * hitRateScore + 1);
  }
}
