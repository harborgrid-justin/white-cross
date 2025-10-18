/**
 * LOC: 16161E00ED
 * WC-GEN-283 | supplierOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - types.ts (services/inventory/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-283 | supplierOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: ../../utils/logger, ../../database/models, sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Supplier/Vendor Operations Module
 *
 * Handles vendor management including:
 * - Creating vendors
 * - Updating vendor information
 * - Retrieving vendors with filters
 * - Vendor performance analytics
 */

import { logger } from '../../utils/logger';
import { Vendor, sequelize } from '../../database/models';
import { QueryTypes } from 'sequelize';
import { CreateVendorData } from './types';

export class SupplierOperations {
  /**
   * Create vendor
   */
  static async createVendor(data: CreateVendorData) {
    try {
      const vendor = await Vendor.create(data);

      logger.info(`Vendor created: ${vendor.name}`);
      return vendor;
    } catch (error) {
      logger.error('Error creating vendor:', error);
      throw error;
    }
  }

  /**
   * Get all vendors
   */
  static async getVendors(isActive?: boolean) {
    try {
      const whereClause: any = {};

      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      const vendors = await Vendor.findAll({
        where: whereClause,
        order: [['name', 'ASC']]
      });

      return vendors;
    } catch (error) {
      logger.error('Error getting vendors:', error);
      throw error;
    }
  }

  /**
   * Update vendor
   */
  static async updateVendor(id: string, data: Partial<CreateVendorData>) {
    try {
      const vendor = await Vendor.findByPk(id);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      await vendor.update(data);

      logger.info(`Vendor updated: ${vendor.name}`);
      return vendor;
    } catch (error) {
      logger.error('Error updating vendor:', error);
      throw error;
    }
  }

  /**
   * Get supplier performance analytics
   */
  static async getSupplierPerformance() {
    try {
      const performance = await sequelize.query(`
        SELECT
          i.supplier,
          COUNT(DISTINCT i.id)::integer as "itemCount",
          AVG(i."unitCost")::numeric as "averageUnitCost",
          SUM(CASE WHEN t.type = 'PURCHASE' THEN t.quantity ELSE 0 END)::integer as "totalPurchased",
          SUM(CASE WHEN t.type = 'PURCHASE' THEN t.quantity * i."unitCost" ELSE 0 END)::numeric as "totalSpent"
        FROM inventory_items i
        LEFT JOIN inventory_transactions t ON i.id = t."inventoryItemId"
        WHERE i.supplier IS NOT NULL
        AND i."isActive" = true
        GROUP BY i.supplier
        ORDER BY "totalSpent" DESC
      `, {
        type: QueryTypes.SELECT
      });

      return performance;
    } catch (error) {
      logger.error('Error getting supplier performance:', error);
      throw error;
    }
  }
}
