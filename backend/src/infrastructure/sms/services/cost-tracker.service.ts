/**
 * @fileoverview Cost Tracker Service
 * @module infrastructure/sms/services/cost-tracker.service
 * @description Tracks SMS costs and provides analytics for budget management
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  SmsCostEntryDto,
  SmsCostAnalyticsDto,
  CostAnalyticsQueryDto,
} from '../dto/cost-tracking.dto';

/**
 * Cost entry with internal tracking
 */
interface CostEntry extends SmsCostEntryDto {
  id: string;
  date: Date;
}

/**
 * Cost Tracker Service
 * Tracks SMS costs for analytics and budget monitoring
 * In production, this should persist to a database (PostgreSQL, MongoDB, etc.)
 */
@Injectable()
export class CostTrackerService {
  private readonly logger = new Logger(CostTrackerService.name);

  // In-memory storage for cost entries
  // In production, replace with database persistence
  private readonly costEntries: CostEntry[] = [];

  private totalCost = 0;
  private totalMessages = 0;

  constructor() {
    this.logger.log('Cost tracker service initialized');
  }

  /**
   * Record SMS cost entry
   *
   * @param entry - Cost entry data
   * @returns Recorded entry with ID
   *
   * @example
   * ```typescript
   * await costTracker.recordCost({
   *   to: '+15551234567',
   *   countryCode: 'US',
   *   segmentCount: 1,
   *   costPerSegment: 0.0079,
   *   totalCost: 0.0079,
   *   timestamp: new Date().toISOString(),
   *   messageId: 'SM1234567890'
   * });
   * ```
   */
  async recordCost(entry: SmsCostEntryDto): Promise<CostEntry> {
    const costEntry: CostEntry = {
      ...entry,
      id: this.generateId(),
      date: new Date(entry.timestamp),
    };

    this.costEntries.push(costEntry);

    // Update totals
    this.totalCost += entry.totalCost;
    this.totalMessages += 1;

    this.logger.debug(
      `Recorded SMS cost: ${entry.to} (${entry.countryCode}) - $${entry.totalCost.toFixed(4)}`,
    );

    return costEntry;
  }

  /**
   * Get cost analytics for a date range
   *
   * @param query - Analytics query parameters
   * @returns Cost analytics summary
   *
   * @example
   * ```typescript
   * const analytics = await costTracker.getAnalytics({
   *   startDate: '2025-10-01T00:00:00Z',
   *   endDate: '2025-10-31T23:59:59Z',
   *   countryCode: 'US'
   * });
   * console.log(`Total cost: $${analytics.totalCost}`);
   * ```
   */
  async getAnalytics(
    query: CostAnalyticsQueryDto,
  ): Promise<SmsCostAnalyticsDto> {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    // Filter entries by date range and optional country code
    let filteredEntries = this.costEntries.filter((entry) => {
      const entryDate = entry.date;
      return entryDate >= startDate && entryDate <= endDate;
    });

    if (query.countryCode) {
      filteredEntries = filteredEntries.filter(
        (entry) => entry.countryCode === query.countryCode,
      );
    }

    // Calculate totals
    const totalMessages = filteredEntries.length;
    const totalCost = filteredEntries.reduce(
      (sum, entry) => sum + entry.totalCost,
      0,
    );
    const averageCostPerMessage =
      totalMessages > 0 ? totalCost / totalMessages : 0;

    // Calculate cost breakdown by country
    const costByCountry: Record<string, { messages: number; cost: number }> =
      {};

    filteredEntries.forEach((entry) => {
      if (!costByCountry[entry.countryCode]) {
        costByCountry[entry.countryCode] = { messages: 0, cost: 0 };
      }

      costByCountry[entry.countryCode].messages += 1;
      costByCountry[entry.countryCode].cost += entry.totalCost;
    });

    // Round cost values for display
    Object.keys(costByCountry).forEach((country) => {
      costByCountry[country].cost = parseFloat(
        costByCountry[country].cost.toFixed(4),
      );
    });

    return {
      totalMessages,
      totalCost: parseFloat(totalCost.toFixed(4)),
      averageCostPerMessage: parseFloat(averageCostPerMessage.toFixed(6)),
      costByCountry,
      startDate: query.startDate,
      endDate: query.endDate,
    };
  }

  /**
   * Get total costs (all time)
   *
   * @returns Total cost and message count
   */
  async getTotalCosts(): Promise<{ totalCost: number; totalMessages: number }> {
    return {
      totalCost: parseFloat(this.totalCost.toFixed(4)),
      totalMessages: this.totalMessages,
    };
  }

  /**
   * Get cost entries for a phone number
   *
   * @param phoneNumber - Phone number to query
   * @param limit - Maximum number of entries to return
   * @returns Array of cost entries
   */
  async getCostsByPhoneNumber(
    phoneNumber: string,
    limit = 100,
  ): Promise<CostEntry[]> {
    return this.costEntries
      .filter((entry) => entry.to === phoneNumber)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }

  /**
   * Get recent cost entries
   *
   * @param limit - Maximum number of entries to return
   * @returns Array of recent cost entries
   */
  async getRecentCosts(limit = 100): Promise<CostEntry[]> {
    return this.costEntries
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }

  /**
   * Get daily cost summary for a date range
   *
   * @param startDate - Start date (ISO 8601)
   * @param endDate - End date (ISO 8601)
   * @returns Daily cost breakdown
   */
  async getDailyCosts(
    startDate: string,
    endDate: string,
  ): Promise<Array<{ date: string; messages: number; cost: number }>> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredEntries = this.costEntries.filter((entry) => {
      return entry.date >= start && entry.date <= end;
    });

    // Group by date
    const dailyCosts: Record<string, { messages: number; cost: number }> = {};

    filteredEntries.forEach((entry) => {
      const dateKey = entry.date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!dailyCosts[dateKey]) {
        dailyCosts[dateKey] = { messages: 0, cost: 0 };
      }

      dailyCosts[dateKey].messages += 1;
      dailyCosts[dateKey].cost += entry.totalCost;
    });

    // Convert to array and sort by date
    return Object.entries(dailyCosts)
      .map(([date, data]) => ({
        date,
        messages: data.messages,
        cost: parseFloat(data.cost.toFixed(4)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Check if cost budget is exceeded
   *
   * @param budgetAmount - Budget amount in USD
   * @param periodStart - Period start date (ISO 8601)
   * @param periodEnd - Period end date (ISO 8601)
   * @returns Budget status
   */
  async checkBudget(
    budgetAmount: number,
    periodStart: string,
    periodEnd: string,
  ): Promise<{
    isExceeded: boolean;
    totalCost: number;
    budgetAmount: number;
    remainingBudget: number;
    percentUsed: number;
  }> {
    const analytics = await this.getAnalytics({
      startDate: periodStart,
      endDate: periodEnd,
    });

    const totalCost = analytics.totalCost;
    const remainingBudget = Math.max(0, budgetAmount - totalCost);
    const percentUsed = budgetAmount > 0 ? (totalCost / budgetAmount) * 100 : 0;

    return {
      isExceeded: totalCost > budgetAmount,
      totalCost,
      budgetAmount,
      remainingBudget: parseFloat(remainingBudget.toFixed(4)),
      percentUsed: parseFloat(percentUsed.toFixed(2)),
    };
  }

  /**
   * Clear all cost entries (use with caution)
   * In production, this should archive data instead of deleting
   */
  async clearAllCosts(): Promise<void> {
    const count = this.costEntries.length;
    this.costEntries.length = 0;
    this.totalCost = 0;
    this.totalMessages = 0;

    this.logger.warn(`Cleared ${count} cost entries`);
  }

  // ==================== Private Helper Methods ====================

  /**
   * Generate unique ID for cost entry
   *
   * @returns Unique ID string
   * @private
   */
  private generateId(): string {
    return `cost_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
