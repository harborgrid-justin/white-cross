/**
 * @fileoverview Email Statistics Service
 * @module infrastructure/email/services
 * @description Service for tracking email delivery statistics and metrics
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { EmailStatistics } from '../types/email.types';

@Injectable()
export class EmailStatisticsService extends BaseService {
  private stats = {
    sent: 0,
    failed: 0,
    queued: 0,
    totalDeliveryTime: 0,
  };

  private readonly startTime = Date.now();

  /**
   * Record successful email delivery
   */
  recordSent(deliveryTime: number): void {
    this.stats.sent++;
    this.stats.totalDeliveryTime += deliveryTime;
  }

  /**
   * Record failed email delivery
   */
  recordFailed(): void {
    this.stats.failed++;
  }

  /**
   * Record queued email
   */
  recordQueued(): void {
    this.stats.queued++;
  }

  /**
   * Get current email statistics
   */
  getStatistics(): EmailStatistics {
    const total = this.stats.sent + this.stats.failed;
    const successRate = total > 0 ? (this.stats.sent / total) * 100 : 0;
    const avgDeliveryTime =
      this.stats.sent > 0 ? this.stats.totalDeliveryTime / this.stats.sent : 0;

    return {
      totalSent: this.stats.sent,
      totalFailed: this.stats.failed,
      totalQueued: this.stats.queued,
      averageDeliveryTime: avgDeliveryTime,
      successRate,
      period: {
        start: new Date(this.startTime),
        end: new Date(),
      },
    };
  }

  /**
   * Get success rate percentage
   */
  getSuccessRate(): number {
    const total = this.stats.sent + this.stats.failed;
    return total > 0 ? (this.stats.sent / total) * 100 : 0;
  }

  /**
   * Get average delivery time in milliseconds
   */
  getAverageDeliveryTime(): number {
    return this.stats.sent > 0 ? this.stats.totalDeliveryTime / this.stats.sent : 0;
  }

  /**
   * Get total emails processed
   */
  getTotalProcessed(): number {
    return this.stats.sent + this.stats.failed + this.stats.queued;
  }

  /**
   * Reset all statistics
   */
  reset(): void {
    this.stats = {
      sent: 0,
      failed: 0,
      queued: 0,
      totalDeliveryTime: 0,
    };
    this.logInfo('Email statistics reset');
  }

  /**
   * Get statistics summary as object
   */
  getStatsSummary(): {
    sent: number;
    failed: number;
    queued: number;
    totalProcessed: number;
    successRate: number;
    averageDeliveryTime: number;
  } {
    return {
      sent: this.stats.sent,
      failed: this.stats.failed,
      queued: this.stats.queued,
      totalProcessed: this.getTotalProcessed(),
      successRate: this.getSuccessRate(),
      averageDeliveryTime: this.getAverageDeliveryTime(),
    };
  }
}
