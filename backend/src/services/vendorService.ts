import { Op, QueryTypes } from 'sequelize';
import { logger } from '../utils/logger';
import { Vendor, PurchaseOrder, PurchaseOrderItem, InventoryItem, sequelize } from '../database/models';

/**
 * Data transfer objects for vendor operations
 */
export interface CreateVendorData {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  rating?: number;
}

export interface UpdateVendorData {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  rating?: number;
  isActive?: boolean;
}

export interface VendorPerformanceMetrics {
  totalOrders: number;
  avgDeliveryDays: number;
  totalSpent: number;
  cancelledOrders: number;
  onTimeDeliveryRate: number;
  reliabilityScore: number;
}

export interface VendorComparison {
  id: string;
  name: string;
  rating: number | null;
  paymentTerms: string | null;
  itemName: string;
  unitCost: number | null;
  orderCount: number;
  avgDeliveryDays: number | null;
}

export interface VendorFilters {
  rating?: number;
  hasOrders?: boolean;
  minRating?: number;
}

/**
 * VendorService
 * Manages vendor/supplier information and performance tracking for procurement.
 * Handles vendor CRUD operations, performance metrics, and vendor comparisons.
 * Supports vendor search, filtering, and reliability scoring.
 */
export class VendorService {
  /**
   * Get all vendors with pagination and optional filters
   */
  static async getVendors(
    page: number = 1,
    limit: number = 20,
    activeOnly: boolean = true,
    filters: VendorFilters = {}
  ) {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = {};

      if (activeOnly) {
        whereClause.isActive = true;
      }

      if (filters.rating) {
        whereClause.rating = filters.rating;
      }

      if (filters.minRating) {
        whereClause.rating = { [Op.gte]: filters.minRating };
      }

      const { rows: vendors, count: total } = await Vendor.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['name', 'ASC']],
        distinct: true
      });

      return {
        vendors,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching vendors:', error);
      throw new Error('Failed to fetch vendors');
    }
  }

  /**
   * Get vendor by ID with recent purchase orders and performance metrics
   */
  static async getVendorById(id: string) {
    try {
      const vendor = await Vendor.findByPk(id, {
        include: [
          {
            model: PurchaseOrder,
            as: 'purchaseOrders',
            limit: 10,
            order: [['orderDate', 'DESC']],
            separate: true
          }
        ]
      });

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      // Calculate performance metrics using Sequelize aggregations
      const metrics = await this.calculateVendorMetrics(id);

      return {
        vendor,
        metrics
      };
    } catch (error) {
      logger.error('Error fetching vendor:', error);
      throw error;
    }
  }

  /**
   * Calculate comprehensive performance metrics for a vendor
   */
  static async calculateVendorMetrics(vendorId: string): Promise<VendorPerformanceMetrics> {
    try {
      // Get total orders count
      const totalOrders = await PurchaseOrder.count({
        where: { vendorId }
      });

      // Get cancelled orders count
      const cancelledOrders = await PurchaseOrder.count({
        where: {
          vendorId,
          status: 'CANCELLED'
        }
      });

      // Calculate average delivery days and total spent using raw query for complex calculations
      const deliveryMetrics: any = await sequelize.query(
        `SELECT
          COALESCE(AVG(CASE
            WHEN status = 'RECEIVED' AND "receivedDate" IS NOT NULL AND "orderDate" IS NOT NULL
            THEN EXTRACT(EPOCH FROM ("receivedDate" - "orderDate")) / 86400
          END), 0) as "avgDeliveryDays",
          COALESCE(SUM(total), 0) as "totalSpent",
          COUNT(CASE
            WHEN status = 'RECEIVED' AND "expectedDate" IS NOT NULL AND "receivedDate" <= "expectedDate"
            THEN 1
          END) as "onTimeDeliveries",
          COUNT(CASE
            WHEN status = 'RECEIVED'
            THEN 1
          END) as "receivedOrders"
        FROM purchase_orders
        WHERE "vendorId" = :vendorId`,
        {
          replacements: { vendorId },
          type: QueryTypes.SELECT
        }
      );

      const metricsData = deliveryMetrics[0];
      const avgDeliveryDays = parseFloat(metricsData.avgDeliveryDays) || 0;
      const totalSpent = parseFloat(metricsData.totalSpent) || 0;
      const onTimeDeliveries = parseInt(metricsData.onTimeDeliveries, 10) || 0;
      const receivedOrders = parseInt(metricsData.receivedOrders, 10) || 0;

      // Calculate on-time delivery rate
      const onTimeDeliveryRate = receivedOrders > 0
        ? (onTimeDeliveries / receivedOrders) * 100
        : 0;

      // Calculate reliability score (0-100)
      // Factors: cancellation rate, on-time delivery, average delivery time
      const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) : 0;
      const reliabilityScore = Math.max(0, Math.min(100,
        (100 - (cancellationRate * 50)) * 0.4 +
        onTimeDeliveryRate * 0.4 +
        (avgDeliveryDays > 0 ? Math.max(0, 100 - avgDeliveryDays * 2) : 50) * 0.2
      ));

      return {
        totalOrders,
        avgDeliveryDays: Math.round(avgDeliveryDays * 10) / 10,
        totalSpent,
        cancelledOrders,
        onTimeDeliveryRate: Math.round(onTimeDeliveryRate * 10) / 10,
        reliabilityScore: Math.round(reliabilityScore * 10) / 10
      };
    } catch (error) {
      logger.error('Error calculating vendor metrics:', error);
      throw error;
    }
  }

  /**
   * Create new vendor
   */
  static async createVendor(data: CreateVendorData) {
    try {
      // Check for duplicate vendor name among active vendors
      const existing = await Vendor.findOne({
        where: {
          name: data.name,
          isActive: true
        }
      });

      if (existing) {
        throw new Error('Vendor with this name already exists');
      }

      // Validate rating if provided
      if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
        throw new Error('Vendor rating must be between 1 and 5');
      }

      const vendor = await Vendor.create(data);

      logger.info(`Vendor created: ${vendor.name} (ID: ${vendor.id})`);
      return vendor;
    } catch (error) {
      logger.error('Error creating vendor:', error);
      throw error;
    }
  }

  /**
   * Update vendor information
   */
  static async updateVendor(id: string, data: UpdateVendorData) {
    try {
      const existingVendor = await Vendor.findByPk(id);

      if (!existingVendor) {
        throw new Error('Vendor not found');
      }

      // Validate rating if being updated
      if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
        throw new Error('Vendor rating must be between 1 and 5');
      }

      // Check for duplicate name if name is being updated
      if (data.name && data.name !== existingVendor.name) {
        const duplicateVendor = await Vendor.findOne({
          where: {
            name: data.name,
            isActive: true,
            id: { [Op.ne]: id }
          }
        });

        if (duplicateVendor) {
          throw new Error('Another vendor with this name already exists');
        }
      }

      await existingVendor.update(data);

      logger.info(`Vendor updated: ${existingVendor.name} (ID: ${id})`);
      return existingVendor;
    } catch (error) {
      logger.error('Error updating vendor:', error);
      throw error;
    }
  }

  /**
   * Compare vendors for a specific inventory item
   * Returns vendors who have supplied the item with pricing and delivery metrics
   */
  static async compareVendors(itemName: string): Promise<VendorComparison[]> {
    try {
      const comparison: any = await sequelize.query(
        `SELECT
          v.id,
          v.name,
          v.rating,
          v."paymentTerms",
          i.name as "itemName",
          i."unitCost",
          COUNT(DISTINCT po.id)::int as "orderCount",
          AVG(CASE
            WHEN po.status = 'RECEIVED' AND po."receivedDate" IS NOT NULL AND po."orderDate" IS NOT NULL
            THEN EXTRACT(EPOCH FROM (po."receivedDate" - po."orderDate")) / 86400
          END) as "avgDeliveryDays"
        FROM vendors v
        INNER JOIN purchase_orders po ON v.id = po."vendorId"
        INNER JOIN purchase_order_items poi ON po.id = poi."purchaseOrderId"
        INNER JOIN inventory_items i ON poi."inventoryItemId" = i.id
        WHERE i.name ILIKE :itemName
        AND v."isActive" = true
        GROUP BY v.id, v.name, v.rating, v."paymentTerms", i.name, i."unitCost"
        ORDER BY i."unitCost" ASC NULLS LAST, v.rating DESC NULLS LAST`,
        {
          replacements: { itemName: `%${itemName}%` },
          type: QueryTypes.SELECT
        }
      );

      return comparison.map((row: any) => ({
        id: row.id,
        name: row.name,
        rating: row.rating,
        paymentTerms: row.paymentTerms,
        itemName: row.itemName,
        unitCost: row.unitCost ? parseFloat(row.unitCost) : null,
        orderCount: parseInt(row.orderCount, 10),
        avgDeliveryDays: row.avgDeliveryDays ? Math.round(parseFloat(row.avgDeliveryDays) * 10) / 10 : null
      }));
    } catch (error) {
      logger.error('Error comparing vendors:', error);
      throw error;
    }
  }

  /**
   * Get top performing vendors based on reliability score
   */
  static async getTopVendors(limit: number = 10) {
    try {
      const vendors = await Vendor.findAll({
        where: { isActive: true },
        order: [
          ['rating', 'DESC NULLS LAST'],
          ['name', 'ASC']
        ],
        limit
      });

      // Calculate metrics for each vendor
      const vendorsWithMetrics = await Promise.all(
        vendors.map(async (vendor) => {
          const metrics = await this.calculateVendorMetrics(vendor.id);
          return {
            vendor: vendor.get({ plain: true }),
            metrics
          };
        })
      );

      // Sort by reliability score
      vendorsWithMetrics.sort((a, b) => b.metrics.reliabilityScore - a.metrics.reliabilityScore);

      return vendorsWithMetrics;
    } catch (error) {
      logger.error('Error fetching top vendors:', error);
      throw error;
    }
  }

  /**
   * Delete vendor (soft delete)
   */
  static async deleteVendor(id: string) {
    try {
      const vendor = await Vendor.findByPk(id);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      // Check if vendor has active purchase orders
      const activePurchaseOrders = await PurchaseOrder.count({
        where: {
          vendorId: id,
          status: {
            [Op.in]: ['PENDING', 'APPROVED', 'ORDERED']
          }
        }
      });

      if (activePurchaseOrders > 0) {
        throw new Error(`Cannot delete vendor with ${activePurchaseOrders} active purchase order(s). Please complete or cancel those orders first.`);
      }

      await vendor.update({ isActive: false });

      logger.info(`Vendor soft deleted: ${vendor.name} (ID: ${id})`);
      return vendor;
    } catch (error) {
      logger.error('Error deleting vendor:', error);
      throw error;
    }
  }

  /**
   * Permanently delete vendor (hard delete)
   * Should only be used when vendor has no associated records
   */
  static async permanentlyDeleteVendor(id: string) {
    try {
      const vendor = await Vendor.findByPk(id);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      // Check if vendor has any purchase orders
      const purchaseOrderCount = await PurchaseOrder.count({
        where: { vendorId: id }
      });

      if (purchaseOrderCount > 0) {
        throw new Error('Cannot permanently delete vendor with purchase order history. Use soft delete instead.');
      }

      await vendor.destroy();

      logger.info(`Vendor permanently deleted: ${vendor.name} (ID: ${id})`);
      return { success: true };
    } catch (error) {
      logger.error('Error permanently deleting vendor:', error);
      throw error;
    }
  }

  /**
   * Reactivate a soft-deleted vendor
   */
  static async reactivateVendor(id: string) {
    try {
      const vendor = await Vendor.findByPk(id);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      if (vendor.isActive) {
        throw new Error('Vendor is already active');
      }

      await vendor.update({ isActive: true });

      logger.info(`Vendor reactivated: ${vendor.name} (ID: ${id})`);
      return vendor;
    } catch (error) {
      logger.error('Error reactivating vendor:', error);
      throw error;
    }
  }

  /**
   * Search vendors by name, contact, or email
   */
  static async searchVendors(query: string, limit: number = 20, activeOnly: boolean = true) {
    try {
      const whereClause: any = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { contactName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      };

      if (activeOnly) {
        whereClause.isActive = true;
      }

      const vendors = await Vendor.findAll({
        where: whereClause,
        limit,
        order: [['name', 'ASC']]
      });

      return vendors;
    } catch (error) {
      logger.error('Error searching vendors:', error);
      throw error;
    }
  }

  /**
   * Get vendor statistics
   */
  static async getVendorStatistics() {
    try {
      const [
        totalVendors,
        activeVendors,
        totalPurchaseOrders,
        totalSpent,
        avgVendorRating
      ] = await Promise.all([
        Vendor.count(),
        Vendor.count({ where: { isActive: true } }),
        PurchaseOrder.count(),
        sequelize.query(
          'SELECT COALESCE(SUM(total), 0) as total FROM purchase_orders WHERE status = \'RECEIVED\'',
          { type: QueryTypes.SELECT }
        ),
        sequelize.query(
          'SELECT COALESCE(AVG(rating), 0) as avg FROM vendors WHERE rating IS NOT NULL AND "isActive" = true',
          { type: QueryTypes.SELECT }
        )
      ]);

      const totalSpentValue = (totalSpent as any)[0]?.total || 0;
      const avgRating = (avgVendorRating as any)[0]?.avg || 0;

      return {
        totalVendors,
        activeVendors,
        inactiveVendors: totalVendors - activeVendors,
        totalPurchaseOrders,
        totalSpent: parseFloat(totalSpentValue),
        avgVendorRating: Math.round(parseFloat(avgRating) * 10) / 10
      };
    } catch (error) {
      logger.error('Error fetching vendor statistics:', error);
      throw error;
    }
  }

  /**
   * Update vendor rating based on recent performance
   */
  static async updateVendorRating(vendorId: string, newRating: number) {
    try {
      if (newRating < 1 || newRating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const vendor = await Vendor.findByPk(vendorId);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      await vendor.update({ rating: newRating });

      logger.info(`Vendor rating updated: ${vendor.name} - New rating: ${newRating}`);
      return vendor;
    } catch (error) {
      logger.error('Error updating vendor rating:', error);
      throw error;
    }
  }

  /**
   * Get vendors by payment terms
   */
  static async getVendorsByPaymentTerms(paymentTerms: string) {
    try {
      const vendors = await Vendor.findAll({
        where: {
          paymentTerms: { [Op.iLike]: `%${paymentTerms}%` },
          isActive: true
        },
        order: [['name', 'ASC']]
      });

      return vendors;
    } catch (error) {
      logger.error('Error fetching vendors by payment terms:', error);
      throw error;
    }
  }

  /**
   * Bulk update vendor ratings
   */
  static async bulkUpdateRatings(updates: Array<{ vendorId: string; rating: number }>) {
    try {
      const results = {
        updated: 0,
        failed: 0,
        errors: [] as string[]
      };

      for (const update of updates) {
        try {
          await this.updateVendorRating(update.vendorId, update.rating);
          results.updated++;
        } catch (error) {
          results.failed++;
          results.errors.push(`Vendor ${update.vendorId}: ${(error as Error).message}`);
        }
      }

      logger.info(`Bulk vendor rating update completed: ${results.updated} updated, ${results.failed} failed`);
      return results;
    } catch (error) {
      logger.error('Error in bulk vendor rating update:', error);
      throw error;
    }
  }
}
