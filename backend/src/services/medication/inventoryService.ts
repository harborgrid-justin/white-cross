/**
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
 * Last Updated: 2025-10-18 | Dependencies: sequelize
 * Critical Path: Inventory tracking → Alert generation → Reorder management
 * LLM Context: Healthcare inventory compliance with expiration and stock monitoring
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { MedicationInventory, Medication, sequelize } from '../../database/models';
import { CreateInventoryData } from './types';

export class InventoryService {
  /**
   * Add medication to inventory with batch tracking
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
