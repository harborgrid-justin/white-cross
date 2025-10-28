/**
 * LOC: 4A90C0744B
 * WC-GEN-213 | NurseAvailabilityService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - appointment.ts (types/appointment.ts)
 *
 * DOWNSTREAM (imported by):
 *   - appointmentService.ts (services/appointmentService.ts)
 */

/**
 * WC-GEN-213 | NurseAvailabilityService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../types/appointment | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { NurseAvailability } from '../../database/models';
import { NurseAvailabilityData } from '../../types/appointment';

export class NurseAvailabilityService {
  /**
   * Set nurse availability schedule
   */
  static async setNurseAvailability(data: NurseAvailabilityData) {
    try {
      const availability = await NurseAvailability.create({
        nurseId: data.nurseId,
        dayOfWeek: data.dayOfWeek ?? 0,
        startTime: data.startTime,
        endTime: data.endTime,
        isRecurring: data.isRecurring ?? true,
        specificDate: data.specificDate,
        isAvailable: data.isAvailable ?? true,
        reason: data.reason
      });

      logger.info(`Availability set for nurse ${data.nurseId}`);
      return availability;
    } catch (error) {
      logger.error('Error setting nurse availability:', error);
      throw error;
    }
  }

  /**
   * Get nurse availability schedule
   */
  static async getNurseAvailability(nurseId: string, date?: Date) {
    try {
      const whereClause: any = { nurseId };

      if (date) {
        const dayOfWeek = date.getDay();
        whereClause[Op.or] = [
          { isRecurring: true, dayOfWeek },
          { isRecurring: false, specificDate: date }
        ];
      }

      const availability = await NurseAvailability.findAll({
        where: whereClause,
        order: [
          ['dayOfWeek', 'ASC'],
          ['startTime', 'ASC']
        ]
      });

      return availability;
    } catch (error) {
      logger.error('Error fetching nurse availability:', error);
      throw error;
    }
  }

  /**
   * Update nurse availability
   */
  static async updateNurseAvailability(id: string, data: Partial<NurseAvailabilityData>) {
    try {
      const availability = await NurseAvailability.findByPk(id);

      if (!availability) {
        throw new Error('Availability schedule not found');
      }

      await availability.update(data);

      logger.info(`Availability updated for schedule ${id}`);
      return availability;
    } catch (error) {
      logger.error('Error updating nurse availability:', error);
      throw error;
    }
  }

  /**
   * Delete nurse availability
   */
  static async deleteNurseAvailability(id: string) {
    try {
      const availability = await NurseAvailability.findByPk(id);

      if (!availability) {
        throw new Error('Availability schedule not found');
      }

      await availability.destroy();
      logger.info(`Availability schedule ${id} deleted`);
    } catch (error) {
      logger.error('Error deleting nurse availability:', error);
      throw error;
    }
  }
}
