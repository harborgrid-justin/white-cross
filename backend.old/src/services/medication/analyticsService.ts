/**
 * LOC: 7359200817-ANA
 * WC-SVC-MED-ANA | Medication Analytics and Reporting Service
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/medication/index.ts)
 */

/**
 * WC-SVC-MED-ANA | Medication Analytics and Reporting Service
 * Purpose: Medication statistics, alerts, and analytics for decision support
 * Upstream: database/models/* | Dependencies: Sequelize
 * Downstream: MedicationService | Called by: Medication service index
 * Related: All medication models
 * Exports: AnalyticsService class | Key Services: Statistics, alerts
 * Last Updated: 2025-10-18 | Dependencies: sequelize
 * Critical Path: Data aggregation → Analysis → Alert generation
 * LLM Context: Healthcare analytics with compliance monitoring and alerting
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  Medication,
  StudentMedication,
  MedicationLog,
  MedicationInventory,
  IncidentReport,
  sequelize
} from '../../database/models';
import { ScheduleService } from './scheduleService';

export class AnalyticsService {
  /**
   * Get comprehensive medication statistics
   */
  static async getMedicationStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const [
        totalMedications,
        activePrescriptions,
        administeredToday,
        adverseReactions,
        lowStockCount,
        expiringCount
      ] = await Promise.all([
        Medication.count(),
        StudentMedication.count({
          where: { isActive: true }
        }),
        MedicationLog.count({
          where: {
            timeGiven: {
              [Op.gte]: today,
              [Op.lte]: endOfDay
            }
          }
        }),
        IncidentReport.count({
          where: {
            type: 'ALLERGIC_REACTION',
            occurredAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        }),
        MedicationInventory.count({
          where: sequelize.where(
            sequelize.col('quantity'),
            Op.lte,
            sequelize.col('reorderLevel')
          )
        }),
        MedicationInventory.count({
          where: {
            expirationDate: {
              [Op.lte]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
              [Op.gte]: new Date()
            }
          }
        })
      ]);

      const statistics = {
        totalMedications,
        activePrescriptions,
        administeredToday,
        adverseReactions,
        lowStockCount,
        expiringCount
      };

      logger.info('Retrieved medication statistics', statistics);
      return statistics;
    } catch (error) {
      logger.error('Error getting medication statistics:', error);
      throw error;
    }
  }

  /**
   * Get medication alerts (low stock, expiring, missed doses)
   */
  static async getMedicationAlerts() {
    try {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const [lowStockItems, expiringItems, missedDoses] = await Promise.all([
        // Low stock alerts
        MedicationInventory.findAll({
          where: {
            [Op.or]: [
              sequelize.where(
                sequelize.col('quantity'),
                Op.lte,
                sequelize.col('reorderLevel')
              ),
              { quantity: 0 }
            ]
          },
          include: [
            {
              model: Medication,
              as: 'medication',
              attributes: ['id', 'name', 'dosageForm', 'strength']
            }
          ],
          order: [
            ['quantity', 'ASC'],
            [{ model: Medication, as: 'medication' }, 'name', 'ASC']
          ]
        }),
        // Expiring items
        MedicationInventory.findAll({
          where: {
            expirationDate: {
              [Op.lte]: thirtyDaysFromNow,
              [Op.gte]: now
            }
          },
          include: [
            {
              model: Medication,
              as: 'medication',
              attributes: ['id', 'name', 'dosageForm', 'strength']
            }
          ],
          order: [['expirationDate', 'ASC']]
        }),
        // Get missed doses from today
        ScheduleService.getMedicationReminders(now).then(reminders =>
          reminders.filter(r => r.status === 'MISSED')
        )
      ]);

      const alerts = {
        lowStock: lowStockItems.map(item => ({
          id: item.id,
          type: 'LOW_STOCK',
          severity: item.quantity === 0 ? 'CRITICAL' : 'HIGH',
          message: item.quantity === 0
            ? `${item.medication!.name} is out of stock`
            : `${item.medication!.name} is low in stock (${item.quantity} remaining, reorder at ${item.reorderLevel})`,
          medicationId: item.medicationId,
          medicationName: `${item.medication!.name} ${item.medication!.strength}`,
          currentQuantity: item.quantity,
          reorderLevel: item.reorderLevel
        })),
        expiring: expiringItems.map(item => {
          const daysUntilExpiry = Math.ceil((item.expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
          return {
            id: item.id,
            type: 'EXPIRING',
            severity: daysUntilExpiry <= 7 ? 'HIGH' : 'MEDIUM',
            message: `${item.medication!.name} expires in ${daysUntilExpiry} days`,
            medicationId: item.medicationId,
            medicationName: `${item.medication!.name} ${item.medication!.strength}`,
            expirationDate: item.expirationDate,
            daysUntilExpiry
          };
        }),
        missedDoses: missedDoses.map(dose => ({
          id: dose.id,
          type: 'MISSED_DOSE',
          severity: 'MEDIUM',
          message: `Missed dose for ${dose.studentName}: ${dose.medicationName} ${dose.dosage}`,
          studentName: dose.studentName,
          medicationName: dose.medicationName,
          dosage: dose.dosage,
          scheduledTime: dose.scheduledTime
        }))
      };

      logger.info(`Retrieved medication alerts: ${lowStockItems.length} low stock, ${expiringItems.length} expiring, ${missedDoses.length} missed doses`);
      return alerts;
    } catch (error) {
      logger.error('Error getting medication alerts:', error);
      throw error;
    }
  }
}
