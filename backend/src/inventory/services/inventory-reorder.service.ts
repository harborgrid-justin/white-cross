/**
 * Inventory Reorder Service
 *
 * Handles reorder suggestions and calculations
 * Extracted from inventory-maintenance.processor.ts for better modularity
 */
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize, QueryTypes } from 'sequelize';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from "../../common/base";
import { ReorderSuggestion } from './inventory-notification.service';

export interface UsageStatistics {
  medicationId: string;
  averageDailyUsage: number;
  usageTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
  lastOrderDate?: Date;
  lastOrderQuantity?: number;
}

/**
 * Reorder calculation constants
 */
const DEFAULT_LEAD_TIME_DAYS = 7;
const SAFETY_STOCK_PERCENTAGE = 0.2; // 20% of lead time demand
const USAGE_CALCULATION_DAYS = 30; // 30-day rolling average

@Injectable()
export class InventoryReorderService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {
    super(requestContext);
  }

  /**
   * Generate reorder suggestions based on usage patterns and stock levels
   */
  async generateReorderSuggestions(organizationId?: string): Promise<ReorderSuggestion[]> {
    try {
      this.logger.debug('Generating reorder suggestions');

      // Get current inventory status
      const inventoryItems = await this.sequelize.query<{
        medication_id: string;
        medication_name: string;
        quantity: number;
        reorder_level: number;
        organization_id: string;
      }>(
        `
        SELECT
          m.id as medication_id,
          m.name as medication_name,
          COALESCE(SUM(mi.quantity), 0) as quantity,
          COALESCE(m.reorder_level, 50) as reorder_level,
          m.organization_id
        FROM medications m
        LEFT JOIN medication_inventory mi ON m.id = mi.medication_id AND mi.quantity > 0
        WHERE m.is_active = true
          ${organizationId ? 'AND m.organization_id = :organizationId' : ''}
        GROUP BY m.id, m.name, m.reorder_level, m.organization_id
        HAVING COALESCE(SUM(mi.quantity), 0) <= COALESCE(m.reorder_level, 50) * 1.5
      `,
        {
          replacements: organizationId ? { organizationId } : {},
          type: QueryTypes.SELECT,
        },
      );

      const suggestions: ReorderSuggestion[] = [];

      for (const item of inventoryItems) {
        // Calculate usage statistics
        const usageStats = await this.getUsageStatistics(item.medication_id);

        // Calculate reorder point
        const reorderPoint = this.calculateReorderPoint(
          usageStats.averageDailyUsage,
          DEFAULT_LEAD_TIME_DAYS,
        );

        // Calculate suggested order quantity
        const suggestedOrderQuantity = this.calculateOrderQuantity(
          item.quantity,
          reorderPoint,
          usageStats.averageDailyUsage,
        );

        // Estimate days remaining
        const estimatedDaysRemaining =
          usageStats.averageDailyUsage > 0 ? item.quantity / usageStats.averageDailyUsage : 999;

        // Determine priority
        let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
        if (item.quantity === 0) {
          priority = 'CRITICAL';
        } else if (item.quantity <= item.reorder_level * 0.5) {
          priority = 'HIGH';
        } else if (item.quantity <= item.reorder_level) {
          priority = 'MEDIUM';
        } else {
          priority = 'LOW';
        }

        suggestions.push({
          medicationId: item.medication_id,
          medicationName: item.medication_name,
          currentQuantity: item.quantity,
          reorderLevel: item.reorder_level,
          reorderPoint,
          suggestedOrderQuantity,
          priority,
          estimatedDaysRemaining,
          averageDailyUsage: usageStats.averageDailyUsage,
          leadTimeDays: DEFAULT_LEAD_TIME_DAYS,
        });
      }

      // Sort by priority
      const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      this.logger.log(
        `Generated ${suggestions.length} reorder suggestions (${suggestions.filter((s) => s.priority === 'CRITICAL' || s.priority === 'HIGH').length} high priority)`,
      );

      return suggestions;
    } catch (error) {
      this.logger.error('Failed to generate reorder suggestions', error);
      return [];
    }
  }

  /**
   * Calculate reorder point based on usage and lead time
   */
  private calculateReorderPoint(averageDailyUsage: number, leadTimeDays: number): number {
    const leadTimeDemand = averageDailyUsage * leadTimeDays;
    const safetyStock = leadTimeDemand * SAFETY_STOCK_PERCENTAGE;
    return Math.ceil(leadTimeDemand + safetyStock);
  }

  /**
   * Calculate suggested order quantity
   */
  private calculateOrderQuantity(
    currentQuantity: number,
    reorderPoint: number,
    averageDailyUsage: number,
  ): number {
    // Order enough to reach reorder point plus 30 days of usage
    const targetQuantity = reorderPoint + averageDailyUsage * 30;
    const orderQuantity = Math.max(0, targetQuantity - currentQuantity);

    // Round up to nearest 10 for practical ordering
    return Math.ceil(orderQuantity / 10) * 10;
  }

  /**
   * Get usage statistics for a medication
   */
  private async getUsageStatistics(medicationId: string): Promise<UsageStatistics> {
    try {
      const usageData = await this.sequelize.query<{
        total_administered: number;
        days_with_usage: number;
        first_usage_date: Date;
        last_usage_date: Date;
      }>(
        `
        SELECT
          COUNT(*) as total_administered,
          COUNT(DISTINCT DATE(time_given)) as days_with_usage,
          MIN(time_given) as first_usage_date,
          MAX(time_given) as last_usage_date
        FROM medication_logs ml
        JOIN student_medications sm ON ml.student_medication_id = sm.id
        WHERE sm.medication_id = :medicationId
          AND ml.time_given >= NOW() - INTERVAL '${USAGE_CALCULATION_DAYS} days'
      `,
        {
          replacements: { medicationId },
          type: QueryTypes.SELECT,
        },
      );

      const data = usageData[0];

      // Calculate average daily usage
      const daysInPeriod = Math.min(USAGE_CALCULATION_DAYS, data.days_with_usage || 1);
      const averageDailyUsage = data.total_administered / daysInPeriod || 0;

      // Determine trend (simplified - could be enhanced with time-series analysis)
      const usageTrend: 'INCREASING' | 'STABLE' | 'DECREASING' = 'STABLE';

      return {
        medicationId,
        averageDailyUsage: Math.max(averageDailyUsage, 0.1), // Minimum to avoid division by zero
        usageTrend,
      };
    } catch (error) {
      this.logger.error(`Failed to get usage statistics for medication ${medicationId}`, error);
      return {
        medicationId,
        averageDailyUsage: 1, // Default fallback
        usageTrend: 'STABLE',
      };
    }
  }
}
