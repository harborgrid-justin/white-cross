/**
 * WC-GEN-277 | maintenanceService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Maintenance Service
 *
 * Handles maintenance logs and scheduling for inventory items.
 * Provides maintenance tracking and scheduling functionality.
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { MaintenanceLog, InventoryItem, User } from '../../database/models';
import { MaintenanceType } from '../../database/types/enums';
import { CreateMaintenanceLogData } from './types';

export class MaintenanceService {
  /**
   * Create maintenance log
   */
  static async createMaintenanceLog(data: CreateMaintenanceLogData) {
    try {
      // Verify inventory item exists
      const item = await InventoryItem.findByPk(data.inventoryItemId);

      if (!item) {
        throw new Error('Inventory item not found');
      }

      const maintenanceLog = await MaintenanceLog.create({
        inventoryItemId: data.inventoryItemId,
        type: data.type,
        description: data.description,
        cost: data.cost,
        nextMaintenanceDate: data.nextMaintenanceDate,
        vendor: data.vendor,
        notes: data.notes,
        performedById: data.performedBy
      });

      // Reload with associations
      await maintenanceLog.reload({
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem'
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      logger.info(`Maintenance log created: ${data.type} for ${item.name} by ${data.performedBy}`);
      return maintenanceLog;
    } catch (error) {
      logger.error('Error creating maintenance log:', error);
      throw error;
    }
  }

  /**
   * Get maintenance logs for a specific item
   */
  static async getMaintenanceLogsByItem(
    inventoryItemId: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const offset = (page - 1) * limit;

      const { rows: logs, count: total } = await MaintenanceLog.findAndCountAll({
        where: { inventoryItemId },
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem',
            attributes: ['id', 'name', 'category']
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['createdAt', 'DESC']],
        offset,
        limit,
        distinct: true
      });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting maintenance logs by item:', error);
      throw error;
    }
  }

  /**
   * Get maintenance schedule for a date range
   */
  static async getMaintenanceSchedule(startDate: Date, endDate: Date) {
    try {
      const maintenanceDue = await MaintenanceLog.findAll({
        where: {
          nextMaintenanceDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem',
            attributes: ['id', 'name', 'category', 'location']
          }
        ],
        order: [['nextMaintenanceDate', 'ASC']]
      });

      return maintenanceDue;
    } catch (error) {
      logger.error('Error getting maintenance schedule:', error);
      throw error;
    }
  }

  /**
   * Get overdue maintenance items
   */
  static async getOverdueMaintenance() {
    try {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      const overdueMaintenance = await MaintenanceLog.findAll({
        where: {
          nextMaintenanceDate: {
            [Op.lt]: today
          }
        },
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem',
            where: { isActive: true },
            attributes: ['id', 'name', 'category', 'location']
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['nextMaintenanceDate', 'ASC']]
      });

      return overdueMaintenance;
    } catch (error) {
      logger.error('Error getting overdue maintenance:', error);
      throw error;
    }
  }

  /**
   * Get upcoming maintenance (next 30 days)
   */
  static async getUpcomingMaintenance(days: number = 30) {
    try {
      const today = new Date();
      const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

      const upcomingMaintenance = await MaintenanceLog.findAll({
        where: {
          nextMaintenanceDate: {
            [Op.gte]: today,
            [Op.lte]: futureDate
          }
        },
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem',
            where: { isActive: true },
            attributes: ['id', 'name', 'category', 'location']
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['nextMaintenanceDate', 'ASC']]
      });

      return upcomingMaintenance;
    } catch (error) {
      logger.error('Error getting upcoming maintenance:', error);
      throw error;
    }
  }

  /**
   * Get maintenance log by ID
   */
  static async getMaintenanceLogById(id: string) {
    try {
      const log = await MaintenanceLog.findByPk(id, {
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem'
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!log) {
        throw new Error('Maintenance log not found');
      }

      return log;
    } catch (error) {
      logger.error('Error getting maintenance log by ID:', error);
      throw error;
    }
  }

  /**
   * Update maintenance log
   */
  static async updateMaintenanceLog(id: string, data: Partial<CreateMaintenanceLogData>) {
    try {
      const log = await MaintenanceLog.findByPk(id);

      if (!log) {
        throw new Error('Maintenance log not found');
      }

      await log.update(data);

      // Reload with associations
      await log.reload({
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem'
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      logger.info(`Maintenance log updated: ${log.id}`);
      return log;
    } catch (error) {
      logger.error('Error updating maintenance log:', error);
      throw error;
    }
  }

  /**
   * Get maintenance statistics
   */
  static async getMaintenanceStats(startDate?: Date, endDate?: Date) {
    try {
      const whereClause: any = {};

      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        };
      }

      const [
        totalLogs,
        preventiveMaintenance,
        correctiveMaintenance,
        emergencyMaintenance,
        averageCost,
        overdueMaintenance,
        upcomingMaintenance
      ] = await Promise.all([
        // Total maintenance logs
        MaintenanceLog.count({ where: whereClause }),

        // Preventive maintenance count
        MaintenanceLog.count({
          where: {
            ...whereClause,
            type: 'PREVENTIVE'
          }
        }),

        // Corrective maintenance count
        MaintenanceLog.count({
          where: {
            ...whereClause,
            type: 'CORRECTIVE'
          }
        }),

        // Emergency maintenance count
        MaintenanceLog.count({
          where: {
            ...whereClause,
            type: 'EMERGENCY'
          }
        }),

        // Average maintenance cost
        MaintenanceLog.findOne({
          where: {
            ...whereClause,
            cost: { [Op.ne]: null }
          },
          attributes: [
            [MaintenanceLog.sequelize!.fn('AVG', MaintenanceLog.sequelize!.col('cost')), 'averageCost']
          ],
          raw: true
        }),

        // Overdue maintenance count
        this.getOverdueMaintenance().then(items => items.length),

        // Upcoming maintenance count (next 30 days)
        this.getUpcomingMaintenance(30).then(items => items.length)
      ]);

      return {
        totalLogs,
        maintenanceTypes: {
          preventive: preventiveMaintenance,
          corrective: correctiveMaintenance,
          emergency: emergencyMaintenance
        },
        averageCost: Number((averageCost as any)?.averageCost || 0),
        overdueMaintenance,
        upcomingMaintenance
      };
    } catch (error) {
      logger.error('Error getting maintenance stats:', error);
      throw error;
    }
  }

  /**
   * Get maintenance cost summary
   */
  static async getMaintenanceCostSummary(startDate: Date, endDate: Date) {
    try {
      const costSummary = await MaintenanceLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          cost: { [Op.ne]: null }
        },
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem',
            attributes: ['id', 'name', 'category']
          }
        ],
        attributes: [
          'inventoryItemId',
          [MaintenanceLog.sequelize!.fn('SUM', MaintenanceLog.sequelize!.col('cost')), 'totalCost'],
          [MaintenanceLog.sequelize!.fn('COUNT', MaintenanceLog.sequelize!.col('id')), 'maintenanceCount'],
          [MaintenanceLog.sequelize!.fn('AVG', MaintenanceLog.sequelize!.col('cost')), 'averageCost']
        ],
        group: ['inventoryItemId', 'inventoryItem.id', 'inventoryItem.name', 'inventoryItem.category'],
        order: [[MaintenanceLog.sequelize!.fn('SUM', MaintenanceLog.sequelize!.col('cost')), 'DESC']],
        raw: false
      });

      return costSummary;
    } catch (error) {
      logger.error('Error getting maintenance cost summary:', error);
      throw error;
    }
  }

  /**
   * Get maintenance frequency analysis
   */
  static async getMaintenanceFrequencyAnalysis() {
    try {
      const frequencyAnalysis = await MaintenanceLog.findAll({
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem',
            where: { isActive: true },
            attributes: ['id', 'name', 'category']
          }
        ],
        attributes: [
          'inventoryItemId',
          [MaintenanceLog.sequelize!.fn('COUNT', MaintenanceLog.sequelize!.col('id')), 'maintenanceCount'],
          [MaintenanceLog.sequelize!.fn('MIN', MaintenanceLog.sequelize!.col('createdAt')), 'firstMaintenance'],
          [MaintenanceLog.sequelize!.fn('MAX', MaintenanceLog.sequelize!.col('createdAt')), 'lastMaintenance']
        ],
        group: ['inventoryItemId', 'inventoryItem.id', 'inventoryItem.name', 'inventoryItem.category'],
        having: MaintenanceLog.sequelize!.where(
          MaintenanceLog.sequelize!.fn('COUNT', MaintenanceLog.sequelize!.col('id')),
          Op.gt,
          1
        ),
        order: [[MaintenanceLog.sequelize!.fn('COUNT', MaintenanceLog.sequelize!.col('id')), 'DESC']],
        raw: false
      });

      return frequencyAnalysis;
    } catch (error) {
      logger.error('Error getting maintenance frequency analysis:', error);
      throw error;
    }
  }

  /**
   * Schedule next maintenance for an item
   */
  static async scheduleNextMaintenance(
    inventoryItemId: string,
    nextMaintenanceDate: Date,
    notes?: string
  ) {
    try {
      // Verify inventory item exists
      const item = await InventoryItem.findByPk(inventoryItemId);

      if (!item) {
        throw new Error('Inventory item not found');
      }

      // Check if there's already a future maintenance scheduled
      const existingSchedule = await MaintenanceLog.findOne({
        where: {
          inventoryItemId,
          nextMaintenanceDate: {
            [Op.gt]: new Date()
          }
        },
        order: [['nextMaintenanceDate', 'ASC']]
      });

      if (existingSchedule) {
        // Update existing schedule
        await existingSchedule.update({
          nextMaintenanceDate,
          notes: notes || existingSchedule.notes
        });

        logger.info(`Updated maintenance schedule for ${item.name}: ${nextMaintenanceDate}`);
        return existingSchedule;
      } else {
        // Create new scheduled maintenance entry
        const scheduledMaintenance = await MaintenanceLog.create({
          inventoryItemId,
          type: 'PREVENTIVE' as any,
          description: 'Scheduled maintenance',
          nextMaintenanceDate,
          notes,
          performedById: null // This will be set when maintenance is actually performed
        });

        logger.info(`Scheduled maintenance for ${item.name}: ${nextMaintenanceDate}`);
        return scheduledMaintenance;
      }
    } catch (error) {
      logger.error('Error scheduling next maintenance:', error);
      throw error;
    }
  }

  /**
   * Mark maintenance as completed
   */
  static async completeMaintenance(
    maintenanceLogId: string,
    performedBy: string,
    actualCost?: number,
    completionNotes?: string
  ) {
    try {
      const log = await MaintenanceLog.findByPk(maintenanceLogId);

      if (!log) {
        throw new Error('Maintenance log not found');
      }

      const updateData: any = {
        performedById: performedBy,
        completedAt: new Date()
      };

      if (actualCost !== undefined) {
        updateData.cost = actualCost;
      }

      if (completionNotes) {
        updateData.notes = log.notes 
          ? `${log.notes}\n\nCompletion Notes: ${completionNotes}`
          : `Completion Notes: ${completionNotes}`;
      }

      await log.update(updateData);

      // Reload with associations
      await log.reload({
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem'
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      logger.info(`Maintenance completed for log ${maintenanceLogId} by ${performedBy}`);
      return log;
    } catch (error) {
      logger.error('Error completing maintenance:', error);
      throw error;
    }
  }
}
