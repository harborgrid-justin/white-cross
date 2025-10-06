import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

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

export class VendorService {
  /**
   * Get all vendors with pagination
   */
  static async getVendors(page: number = 1, limit: number = 20, activeOnly: boolean = true) {
    try {
      const skip = (page - 1) * limit;
      
      const where = activeOnly ? { isActive: true } : {};
      
      const [vendors, total] = await Promise.all([
        prisma.vendor.findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: 'asc' }
        }),
        prisma.vendor.count({ where })
      ]);

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
   * Get vendor by ID with performance metrics
   */
  static async getVendorById(id: string) {
    try {
      const vendor = await prisma.vendor.findUnique({
        where: { id },
        include: {
          purchaseOrders: {
            take: 10,
            orderBy: { orderDate: 'desc' }
          }
        }
      });

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      // Calculate performance metrics
      const metrics = await prisma.$queryRaw`
        SELECT 
          COUNT(*) as totalOrders,
          COALESCE(AVG(CASE WHEN status = 'RECEIVED' THEN EXTRACT(EPOCH FROM ("receivedDate" - "orderDate")) / 86400 END), 0) as avgDeliveryDays,
          COALESCE(SUM(total), 0) as totalSpent,
          COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelledOrders
        FROM purchase_orders
        WHERE "vendorId" = ${id}
      `;

      return {
        vendor,
        metrics: (metrics as Array<Record<string, unknown>>)[0]
      };
    } catch (error) {
      logger.error('Error fetching vendor:', error);
      throw error;
    }
  }

  /**
   * Create new vendor
   */
  static async createVendor(data: CreateVendorData) {
    try {
      // Check for duplicate vendor name
      const existing = await prisma.vendor.findFirst({
        where: {
          name: data.name,
          isActive: true
        }
      });

      if (existing) {
        throw new Error('Vendor with this name already exists');
      }

      const vendor = await prisma.vendor.create({
        data
      });

      logger.info(`Vendor created: ${vendor.name}`);
      return vendor;
    } catch (error) {
      logger.error('Error creating vendor:', error);
      throw error;
    }
  }

  /**
   * Update vendor
   */
  static async updateVendor(id: string, data: UpdateVendorData) {
    try {
      const vendor = await prisma.vendor.update({
        where: { id },
        data
      });

      logger.info(`Vendor updated: ${vendor.name}`);
      return vendor;
    } catch (error) {
      logger.error('Error updating vendor:', error);
      throw error;
    }
  }

  /**
   * Get vendor comparison for items
   */
  static async compareVendors(itemName: string) {
    try {
      const comparison = await prisma.$queryRaw`
        SELECT 
          v.id,
          v.name,
          v.rating,
          v.paymentTerms,
          i.name as itemName,
          i."unitCost",
          COUNT(DISTINCT po.id) as orderCount,
          AVG(CASE WHEN po.status = 'RECEIVED' THEN EXTRACT(EPOCH FROM (po."receivedDate" - po."orderDate")) / 86400 END) as avgDeliveryDays
        FROM vendors v
        INNER JOIN purchase_orders po ON v.id = po."vendorId"
        INNER JOIN purchase_order_items poi ON po.id = poi."purchaseOrderId"
        INNER JOIN inventory_items i ON poi."inventoryItemId" = i.id
        WHERE i.name ILIKE ${'%' + itemName + '%'}
        AND v."isActive" = true
        GROUP BY v.id, v.name, v.rating, v.paymentTerms, i.name, i."unitCost"
        ORDER BY i."unitCost" ASC
      `;

      return comparison;
    } catch (error) {
      logger.error('Error comparing vendors:', error);
      throw error;
    }
  }

  /**
   * Search vendors
   */
  static async searchVendors(query: string, limit: number = 20) {
    try {
      const vendors = await prisma.vendor.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { contactName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: limit,
        orderBy: { name: 'asc' }
      });

      return vendors;
    } catch (error) {
      logger.error('Error searching vendors:', error);
      throw error;
    }
  }
}
