/**
 * WC-GEN-286 | vendorService.ts - General utility functions and operations
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
 * Vendor Service
 *
 * Handles vendor management and related operations.
 * Provides vendor CRUD operations and performance tracking.
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { Vendor } from '../../database/models';
import { CreateVendorData } from './types';

export class VendorService {
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
   * Get all vendors with optional filtering
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
   * Get vendor by ID
   */
  static async getVendorById(id: string) {
    try {
      const vendor = await Vendor.findByPk(id);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      return vendor;
    } catch (error) {
      logger.error('Error getting vendor by ID:', error);
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
   * Delete vendor (soft delete)
   */
  static async deleteVendor(id: string) {
    try {
      const vendor = await Vendor.findByPk(id);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      // Soft delete by setting isActive to false
      await vendor.update({ isActive: false });

      logger.info(`Vendor deleted: ${vendor.name}`);
      return vendor;
    } catch (error) {
      logger.error('Error deleting vendor:', error);
      throw error;
    }
  }

  /**
   * Search vendors by name
   */
  static async searchVendors(query: string, limit: number = 20) {
    try {
      const vendors = await Vendor.findAll({
        where: {
          isActive: true,
          name: {
            [Op.iLike]: `%${query}%`
          }
        },
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
  static async getVendorStats() {
    try {
      const [
        totalVendors,
        activeVendors,
        inactiveVendors
      ] = await Promise.all([
        Vendor.count(),
        Vendor.count({ where: { isActive: true } }),
        Vendor.count({ where: { isActive: false } })
      ]);

      return {
        totalVendors,
        activeVendors,
        inactiveVendors
      };
    } catch (error) {
      logger.error('Error getting vendor stats:', error);
      throw error;
    }
  }

  /**
   * Get vendors with ratings
   */
  static async getVendorsWithRatings() {
    try {
      const vendors = await Vendor.findAll({
        where: {
          isActive: true,
          rating: {
            [Op.ne]: null
          }
        },
        order: [['rating', 'DESC'], ['name', 'ASC']]
      });

      return vendors;
    } catch (error) {
      logger.error('Error getting vendors with ratings:', error);
      throw error;
    }
  }

  /**
   * Update vendor rating
   */
  static async updateVendorRating(id: string, rating: number) {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const vendor = await Vendor.findByPk(id);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      await vendor.update({ rating });

      logger.info(`Vendor rating updated: ${vendor.name} - ${rating}/5`);
      return vendor;
    } catch (error) {
      logger.error('Error updating vendor rating:', error);
      throw error;
    }
  }

  /**
   * Get vendors by rating range
   */
  static async getVendorsByRating(minRating: number, maxRating: number = 5) {
    try {
      const vendors = await Vendor.findAll({
        where: {
          isActive: true,
          rating: {
            [Op.gte]: minRating,
            [Op.lte]: maxRating
          }
        },
        order: [['rating', 'DESC'], ['name', 'ASC']]
      });

      return vendors;
    } catch (error) {
      logger.error('Error getting vendors by rating:', error);
      throw error;
    }
  }

  /**
   * Get vendors with contact information
   */
  static async getVendorsWithContacts() {
    try {
      const vendors = await Vendor.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { email: { [Op.ne]: null } },
            { phone: { [Op.ne]: null } },
            { contactName: { [Op.ne]: null } }
          ]
        },
        order: [['name', 'ASC']]
      });

      return vendors;
    } catch (error) {
      logger.error('Error getting vendors with contacts:', error);
      throw error;
    }
  }

  /**
   * Validate vendor data
   */
  static validateVendorData(data: CreateVendorData): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Vendor name is required');
    }

    if (data.name.length > 255) {
      throw new Error('Vendor name cannot exceed 255 characters');
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Invalid email format');
    }

    if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      throw new Error('Invalid phone number format');
    }

    if (data.website && !data.website.match(/^https?:\/\/.+/)) {
      throw new Error('Website must be a valid URL starting with http:// or https://');
    }

    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }
  }

  /**
   * Bulk create vendors
   */
  static async bulkCreateVendors(vendorData: CreateVendorData[]) {
    try {
      // Validate all vendor data first
      for (const data of vendorData) {
        this.validateVendorData(data);
      }

      const vendors = await Vendor.bulkCreate(vendorData);

      logger.info(`Bulk created ${vendors.length} vendors`);
      return vendors;
    } catch (error) {
      logger.error('Error bulk creating vendors:', error);
      throw error;
    }
  }

  /**
   * Get vendor performance metrics
   */
  static async getVendorPerformance() {
    try {
      // This would typically join with purchase orders and other related data
      // For now, we'll return basic vendor info with ratings
      const vendors = await Vendor.findAll({
        where: { isActive: true },
        attributes: [
          'id',
          'name',
          'rating',
          'paymentTerms',
          'createdAt'
        ],
        order: [['rating', 'DESC']]
      });

      return vendors.map(vendor => ({
        id: vendor.id,
        name: vendor.name,
        rating: vendor.rating || 0,
        paymentTerms: vendor.paymentTerms,
        yearsActive: new Date().getFullYear() - new Date(vendor.createdAt).getFullYear()
      }));
    } catch (error) {
      logger.error('Error getting vendor performance:', error);
      throw error;
    }
  }

  /**
   * Get recent vendors
   */
  static async getRecentVendors(limit: number = 10) {
    try {
      const recentVendors = await Vendor.findAll({
        limit,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'name', 'email', 'phone', 'rating', 'createdAt']
      });

      return recentVendors;
    } catch (error) {
      logger.error('Error getting recent vendors:', error);
      throw error;
    }
  }
}
