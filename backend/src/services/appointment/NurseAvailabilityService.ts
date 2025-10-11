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
