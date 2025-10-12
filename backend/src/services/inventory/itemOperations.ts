/**
 * Inventory Item Operations Module
 *
 * Handles CRUD operations for inventory items including:
 * - Creating new inventory items
 * - Updating existing items
 * - Retrieving items with filters and pagination
 * - Searching items
 * - Soft deleting items
 */

import { Op, QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  InventoryItem,
  InventoryTransaction,
  MaintenanceLog,
  User,
  sequelize
} from '../../database/models';
import {
  CreateInventoryItemData,
  UpdateInventoryItemData,
  InventoryFilters,
  StockQueryResult,
  PaginatedInventoryItems
} from './types';

export class ItemOperations {
  /**
   * Get inventory items with pagination and filters
   */
  static async getInventoryItems(
    page: number = 1,
    limit: number = 20,
    filters: InventoryFilters = {}
  ): Promise<PaginatedInventoryItems> {
    try {
      const offset = (page - 1) * limit;

      // Build SQL conditions dynamically
      const conditions: string[] = ['1=1'];
      const replacements: any = { limit, offset };

      if (filters.category) {
        conditions.push('i.category = :category');
        replacements.category = filters.category;
      }

      if (filters.supplier) {
        conditions.push('i.supplier ILIKE :supplier');
        replacements.supplier = `%${filters.supplier}%`;
      }

      if (filters.location) {
        conditions.push('i.location ILIKE :location');
        replacements.location = `%${filters.location}%`;
      }

      if (filters.isActive !== undefined) {
        conditions.push('i."isActive" = :isActive');
        replacements.isActive = filters.isActive;
      }

      if (filters.lowStock) {
        conditions.push('COALESCE(stock.totalQuantity, 0) <= i."reorderLevel"');
      }

      const whereClause = conditions.join(' AND ');

      // Get items with current stock levels using raw SQL for complex aggregation
      const items = await sequelize.query<StockQueryResult>(`
        SELECT
          i.*,
          COALESCE(stock.totalQuantity, 0)::integer as "currentStock",
          CASE
            WHEN COALESCE(stock.totalQuantity, 0) <= i."reorderLevel" THEN true
            ELSE false
          END as "isLowStock",
          stock.earliestExpiration as "earliestExpiration"
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            "inventoryItemId",
            SUM(quantity)::integer as totalQuantity,
            MIN("expirationDate") as earliestExpiration
          FROM inventory_transactions
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        WHERE ${whereClause}
        ORDER BY i.name
        LIMIT :limit
        OFFSET :offset
      `, {
        replacements,
        type: QueryTypes.SELECT
      });

      // Count total for pagination
      const [countResult] = await sequelize.query<{ count: number }>(`
        SELECT COUNT(*)::integer as count
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            "inventoryItemId",
            SUM(quantity)::integer as totalQuantity
          FROM inventory_transactions
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        WHERE ${whereClause}
      `, {
        replacements,
        type: QueryTypes.SELECT
      });

      const total = countResult?.count || 0;

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching inventory items:', error);
      throw new Error('Failed to fetch inventory items');
    }
  }

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
   * Get single inventory item by ID
   */
  static async getInventoryItem(id: string) {
    try {
      const item = await InventoryItem.findByPk(id, {
        include: [
          {
            model: InventoryTransaction,
            as: 'transactions',
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [
              {
                model: User,
                as: 'performedBy',
                attributes: ['id', 'firstName', 'lastName', 'email']
              }
            ]
          },
          {
            model: MaintenanceLog,
            as: 'maintenanceLogs',
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [
              {
                model: User,
                as: 'performedBy',
                attributes: ['id', 'firstName', 'lastName', 'email']
              }
            ]
          }
        ]
      });

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
}
