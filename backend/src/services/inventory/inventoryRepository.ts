/**
 * WC-GEN-275 | inventoryRepository.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Inventory Repository Service
 *
 * Handles basic CRUD operations for inventory items.
 * Provides data access layer for inventory management.
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { InventoryItem } from '../../database/models';
import { CreateInventoryItemData, UpdateInventoryItemData } from './types';

export class InventoryRepository {
  /**
   * Create new inventory item
   */
  static async createInventoryItem(data: CreateInventoryItemData) {
    try {
      // Check if item with same name already exists
      const existingItem = await InventoryItem.findOne({
        where: {
          name: data.name,
          isActive: true
        }
      });

      if (existingItem) {
        throw new Error('Inventory item with this name already exists');
      }

      const item = await InventoryItem.create(data);

      logger.info(`Inventory item created: ${item.name} (${item.category})`);
      return item;
    } catch (error) {
      logger.error('Error creating inventory item:', error);
      throw error;
    }
  }

  /**
   * Update inventory item
   */
  static async updateInventoryItem(id: string, data: UpdateInventoryItemData) {
    try {
      const existingItem = await InventoryItem.findByPk(id);

      if (!existingItem) {
        throw new Error('Inventory item not found');
      }

      await existingItem.update(data);

      logger.info(`Inventory item updated: ${existingItem.name}`);
      return existingItem;
    } catch (error) {
      logger.error('Error updating inventory item:', error);
      throw error;
    }
  }

  /**
   * Get single inventory item by ID
   */
  static async getInventoryItem(id: string) {
    try {
      const item = await InventoryItem.findByPk(id);

      if (!item) {
        throw new Error('Inventory item not found');
      }

      return item;
    } catch (error) {
      logger.error('Error getting inventory item:', error);
      throw error;
    }
  }

  /**
   * Delete inventory item (soft delete)
   */
  static async deleteInventoryItem(id: string) {
    try {
      const item = await InventoryItem.findByPk(id);

      if (!item) {
        throw new Error('Inventory item not found');
      }

      // Soft delete by setting isActive to false
      await item.update({ isActive: false });

      logger.info(`Inventory item deleted: ${item.name}`);
      return item;
    } catch (error) {
      logger.error('Error deleting inventory item:', error);
      throw error;
    }
  }

  /**
   * Search inventory items
   */
  static async searchInventoryItems(query: string, limit: number = 20) {
    try {
      const items = await InventoryItem.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } },
            { category: { [Op.iLike]: `%${query}%` } },
            { sku: { [Op.iLike]: `%${query}%` } },
            { supplier: { [Op.iLike]: `%${query}%` } }
          ]
        },
        limit,
        order: [['name', 'ASC']]
      });

      return items;
    } catch (error) {
      logger.error('Error searching inventory items:', error);
      throw error;
    }
  }

  /**
   * Get inventory items count
   */
  static async getInventoryItemsCount(isActive?: boolean) {
    try {
      const whereClause: any = {};

      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      return await InventoryItem.count({ where: whereClause });
    } catch (error) {
      logger.error('Error getting inventory items count:', error);
      throw error;
    }
  }
}
