import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../entities/inventory-item.entity';
import { StockManagementService } from './stock-management.service';

export enum ReorderPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface ReorderRecommendation {
  itemId: string;
  itemName: string;
  priority: ReorderPriority;
  currentStock: number;
  reorderPoint: number;
  recommendedOrderQuantity: number;
  reason: string;
  daysUntilStockout?: number;
}

@Injectable()
export class ReorderAutomationService {
  private readonly logger = new Logger(ReorderAutomationService.name);
  private readonly DEFAULT_LEAD_TIME_DAYS = 7;

  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
    private readonly stockManagementService: StockManagementService,
  ) {}

  /**
   * Analyze inventory and generate reorder recommendations
   */
  async analyzeInventory(): Promise<ReorderRecommendation[]> {
    try {
      const recommendations: ReorderRecommendation[] = [];
      const items = await this.inventoryItemRepository.find({ where: { isActive: true } });

      for (const item of items) {
        const currentStock = await this.stockManagementService.getCurrentStock(item.id);

        // Check if reorder is needed
        if (currentStock <= item.reorderLevel) {
          const priority = this.determinePriority(currentStock, item.reorderLevel);
          const recommendedOrderQuantity = Math.max(
            item.reorderQuantity,
            item.reorderLevel * 2 - currentStock,
          );

          recommendations.push({
            itemId: item.id,
            itemName: item.name,
            priority,
            currentStock,
            reorderPoint: item.reorderLevel,
            recommendedOrderQuantity,
            reason: this.generateReason(currentStock, item.reorderLevel),
          });
        }
      }

      // Sort by priority
      recommendations.sort((a, b) => {
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      this.logger.log(
        `Inventory analysis completed: ${recommendations.length} items need reordering`,
      );

      return recommendations;
    } catch (error) {
      this.logger.error('Error analyzing inventory:', error);
      throw error;
    }
  }

  /**
   * Determine reorder priority based on stock level
   */
  private determinePriority(currentStock: number, reorderLevel: number): ReorderPriority {
    if (currentStock === 0) {
      return ReorderPriority.CRITICAL;
    } else if (currentStock < reorderLevel / 2) {
      return ReorderPriority.HIGH;
    } else if (currentStock <= reorderLevel) {
      return ReorderPriority.MEDIUM;
    } else {
      return ReorderPriority.LOW;
    }
  }

  /**
   * Generate reason text for reorder recommendation
   */
  private generateReason(currentStock: number, reorderLevel: number): string {
    if (currentStock === 0) {
      return 'OUT OF STOCK - Immediate reorder required';
    } else if (currentStock < reorderLevel / 2) {
      return `Below half of reorder level (${reorderLevel})`;
    } else {
      return `At or below reorder point (${reorderLevel})`;
    }
  }
}
