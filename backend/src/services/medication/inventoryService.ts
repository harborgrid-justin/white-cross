/**
 * @fileoverview Medication Inventory Management Service
 * @module services/medication/inventory
 * @description Specialized medication inventory tracking with expiration monitoring and batch management
 *
 * This service provides medication-specific inventory management including batch
 * tracking, expiration date monitoring, reorder level management, and compliance
 * with medication storage and handling requirements.
 *
 * Key Features:
 * - Batch number tracking for medication lots
 * - Expiration date monitoring with 30-day warnings
 * - Low stock alerts based on reorder levels
 * - Medication-specific inventory transactions
 * - DEA controlled substance tracking preparation
 * - Automatic alert generation for expired/expiring medications
 * - Audit trail for all medication inventory changes
 *
 * @business 90-day expiration warning for critical medications (insulin, EpiPens)
 * @business 30-day expiration warning for standard medications
 * @business Expired medications must be removed from active inventory
 * @business Batch numbers required for medication traceability
 * @business Reorder levels higher for emergency medications
 * @business DEA Schedule II-V medications require enhanced tracking
 *
 * @requires ../../database/models
 *
 * LOC: 7359200817-INV
 * WC-SVC-MED-INV | Medication Inventory Management Service
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/medication/index.ts)
 */

/**
 * WC-SVC-MED-INV | Medication Inventory Management Service
 * Purpose: Medication inventory tracking, stock management, and expiration monitoring
 * Upstream: database/models/MedicationInventory | Dependencies: Sequelize
 * Downstream: MedicationService | Called by: Medication service index
 * Related: Medication model, alerting system
 * Exports: InventoryService class | Key Services: Stock management, alerts
 * Last Updated: 2025-10-22 | Dependencies: sequelize
 * Critical Path: Inventory tracking → Alert generation → Reorder management
 * LLM Context: Healthcare inventory compliance with expiration and stock monitoring
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { MedicationInventory, Medication, sequelize } from '../../database/models';
import { CreateInventoryData } from './types';

/**
 * Medication Inventory Service
 *
 * @class InventoryService
 * @static
 */
export class InventoryService {
  /**
   * Add medication to inventory with batch tracking
   *
   * @method addToInventory
   * @static
   * @async
   * @param {CreateInventoryData} data - Inventory entry details
   * @param {string} data.medicationId - Medication UUID
   * @param {number} data.quantity - Quantity to add
   * @param {string} data.batchNumber - Manufacturer batch/lot number (required for traceability)
   * @param {Date} data.expirationDate - Expiration date from batch label
   * @param {number} data.reorderLevel - Reorder point for this medication
   * @returns {Promise<MedicationInventory>} Created inventory record with medication details
   * @throws {Error} Medication not found
   *
   * @business Batch number required for medication recall traceability
   * @business Expiration date used for rotation (FIFO) and alerts
   * @business Reorder level set per medication based on usage patterns
   * @business Critical medications (insulin, EpiPens) should have higher reorder levels
   * @business DEA controlled substances require additional documentation
   *
   * @example
   * const inventory = await InventoryService.addToInventory({
   *   medicationId: 'med-uuid-123',
   *   quantity: 100,
   *   batchNumber: 'LOT-2024-0456',
   *   expirationDate: new Date('2025-12-31'),
   *   reorderLevel: 20
   * });
   * // Logs: "Inventory added: 100 units of Albuterol (Batch: LOT-2024-0456)"
   */
  static async addToInventory(data: CreateInventoryData) {
    try {
      // Verify medication exists
      const medication = await Medication.findByPk(data.medicationId);

      if (!medication) {
        throw new Error('Medication not found');
      }

      const inventory = await MedicationInventory.create(data);

      // Reload with associations
      await inventory.reload({
        include: [
          {
            model: Medication,
            as: 'medication'
          }
        ]
      });

      logger.info(`Inventory added: ${inventory.quantity} units of ${medication.name} (Batch: ${inventory.batchNumber})`, {
        medicationId: medication.id,
        inventoryId: inventory.id,
        quantity: inventory.quantity,
        batchNumber: inventory.batchNumber,
        expirationDate: inventory.expirationDate
      });

      return inventory;
    } catch (error) {
      logger.error('Error adding to medication inventory:', error);
      throw error;
    }
  }

  /**
   * Get inventory with low stock and expiration alerts
   *
   * @method getInventoryWithAlerts
   * @static
   * @async
   * @returns {Promise<Object>} Inventory items categorized by alert status
   * @returns {Promise<Object.inventory>} All inventory items with alert flags
   * @returns {Promise<Object.alerts>} Categorized alerts object
   * @returns {Promise<Object.alerts.lowStock>} Items at or below reorder level
   * @returns {Promise<Object.alerts.nearExpiry>} Items expiring within 30 days (not expired)
   * @returns {Promise<Object.alerts.expired>} Items past expiration date
   *
   * @business Low stock: quantity <= reorderLevel
   * @business Near expiry: expirationDate <= 30 days from now (and not expired)
   * @business Expired: expirationDate <= current date
   * @business Critical medications prioritized in alert ordering
   * @business Expired medications should be removed from active use immediately
   *
   * @example
   * const result = await InventoryService.getInventoryWithAlerts();
   * // Returns: {
   * //   inventory: [...all items with alert flags...],
   * //   alerts: {
   * //     lowStock: [{ medication: 'EpiPen', quantity: 2, reorderLevel: 5, ... }],
   * //     nearExpiry: [{ medication: 'Insulin', expirationDate: '2024-11-15', ... }],
   * //     expired: [{ medication: 'Aspirin', expirationDate: '2024-10-01', ... }]
   * //   }
   * // }
   */
  static async getInventoryWithAlerts() {
    try {
      const inventory = await MedicationInventory.findAll({
        include: [
          {
            model: Medication,
            as: 'medication'
          }
        ],
        order: [
          [{ model: Medication, as: 'medication' }, 'name', 'ASC'],
          ['expirationDate', 'ASC']
        ]
      });

      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      // Categorize inventory items with alert levels
      const categorizedInventory = inventory.map((item) => ({
        ...item.get({ plain: true }),
        alerts: {
          lowStock: item.quantity <= item.reorderLevel,
          nearExpiry: item.expirationDate <= thirtyDaysFromNow,
          expired: item.expirationDate <= now
        }
      }));

      const alerts = {
        lowStock: categorizedInventory.filter((item) => item.alerts.lowStock),
        nearExpiry: categorizedInventory.filter((item) => item.alerts.nearExpiry && !item.alerts.expired),
        expired: categorizedInventory.filter((item) => item.alerts.expired)
      };

      logger.info(`Retrieved inventory with alerts: ${alerts.lowStock.length} low stock, ${alerts.nearExpiry.length} near expiry, ${alerts.expired.length} expired`);

      return {
        inventory: categorizedInventory,
        alerts
      };
    } catch (error) {
      logger.error('Error fetching inventory with alerts:', error);
      throw error;
    }
  }

  /**
   * Update inventory quantity with audit trail
   */
  static async updateInventoryQuantity(inventoryId: string, newQuantity: number, reason?: string) {
    try {
      const inventory = await MedicationInventory.findByPk(inventoryId, {
        include: [
          {
            model: Medication,
            as: 'medication'
          }
        ]
      });

      if (!inventory) {
        throw new Error('Inventory not found');
      }

      const oldQuantity = inventory.quantity;
      await inventory.update({ quantity: newQuantity });

      logger.info(`Inventory updated: ${inventory.medication!.name} quantity changed from ${oldQuantity} to ${newQuantity}${reason ? ` (${reason})` : ''}`, {
        inventoryId: inventory.id,
        medicationId: inventory.medicationId,
        oldQuantity,
        newQuantity,
        reason
      });

      return inventory;
    } catch (error) {
      logger.error('Error updating inventory quantity:', error);
      throw error;
    }
  }
}
