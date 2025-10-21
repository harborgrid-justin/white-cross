/**
 * LOC: B2A0B351E1
 * WC-GEN-236 | checklistService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/compliance/index.ts)
 */

/**
 * WC-GEN-236 | checklistService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: ../../utils/logger, ../../database/models, ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { logger } from '../../utils/logger';
import {
  ComplianceChecklistItem,
  ComplianceReport
} from '../../database/models';
import {
  ChecklistItemStatus
} from '../../database/types/enums';
import {
  CreateChecklistItemData,
  UpdateChecklistItemData
} from './types';

export class ChecklistService {
  /**
   * Add checklist item to report
   */
  static async addChecklistItem(data: CreateChecklistItemData): Promise<ComplianceChecklistItem> {
    try {
      // Verify report exists if reportId is provided
      if (data.reportId) {
        const report = await ComplianceReport.findByPk(data.reportId);
        if (!report) {
          throw new Error('Compliance report not found');
        }
      }

      const item = await ComplianceChecklistItem.create({
        requirement: data.requirement,
        description: data.description,
        category: data.category,
        status: ChecklistItemStatus.PENDING,
        dueDate: data.dueDate,
        reportId: data.reportId
      });

      logger.info(`Created checklist item: ${item.id} - ${item.requirement}`);
      return item;
    } catch (error) {
      logger.error('Error creating checklist item:', error);
      throw error;
    }
  }

  /**
   * Update checklist item
   */
  static async updateChecklistItem(
    id: string,
    data: UpdateChecklistItemData
  ): Promise<ComplianceChecklistItem> {
    try {
      const existingItem = await ComplianceChecklistItem.findByPk(id);

      if (!existingItem) {
        throw new Error('Checklist item not found');
      }

      const updateData: any = {};
      if (data.status) updateData.status = data.status;
      if (data.evidence !== undefined) updateData.evidence = data.evidence;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.completedBy) updateData.completedBy = data.completedBy;

      // Automatically set completion timestamp when status changes to COMPLETED
      if (data.status === ChecklistItemStatus.COMPLETED && !existingItem.completedAt) {
        updateData.completedAt = new Date();
      }

      await existingItem.update(updateData);

      logger.info(`Updated checklist item: ${id}`);
      return existingItem;
    } catch (error) {
      logger.error(`Error updating checklist item ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get checklist item by ID
   */
  static async getChecklistItemById(id: string): Promise<ComplianceChecklistItem> {
    try {
      const item = await ComplianceChecklistItem.findByPk(id);

      if (!item) {
        throw new Error('Checklist item not found');
      }

      logger.info(`Retrieved checklist item: ${id}`);
      return item;
    } catch (error) {
      logger.error(`Error getting checklist item ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete checklist item
   */
  static async deleteChecklistItem(id: string): Promise<{ success: boolean }> {
    try {
      const item = await ComplianceChecklistItem.findByPk(id);

      if (!item) {
        throw new Error('Checklist item not found');
      }

      await item.destroy();

      logger.info(`Deleted checklist item: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error deleting checklist item ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get checklist items by report ID
   */
  static async getChecklistItemsByReportId(reportId: string): Promise<ComplianceChecklistItem[]> {
    try {
      const items = await ComplianceChecklistItem.findAll({
        where: { reportId },
        order: [['createdAt', 'ASC']]
      });

      logger.info(`Retrieved ${items.length} checklist items for report ${reportId}`);
      return items;
    } catch (error) {
      logger.error(`Error getting checklist items for report ${reportId}:`, error);
      throw error;
    }
  }
}
