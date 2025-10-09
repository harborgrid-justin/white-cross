import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../../utils/logger';
import { NurseAvailabilityData } from '../../types/appointment';

const prisma = new PrismaClient();

export class NurseAvailabilityService {
  /**
   * Set nurse availability schedule
   */
  static async setNurseAvailability(data: NurseAvailabilityData) {
    try {
      const availability = await prisma.nurseAvailability.create({
        data: {
          nurseId: data.nurseId,
          dayOfWeek: data.dayOfWeek ?? 0,
          startTime: data.startTime,
          endTime: data.endTime,
          isRecurring: data.isRecurring ?? true,
          specificDate: data.specificDate,
          isAvailable: data.isAvailable ?? true,
          reason: data.reason
        }
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
      const whereClause: Prisma.NurseAvailabilityWhereInput = { nurseId };

      if (date) {
        const dayOfWeek = date.getDay();
        whereClause.OR = [
          { isRecurring: true, dayOfWeek },
          { isRecurring: false, specificDate: date }
        ];
      }

      const availability = await prisma.nurseAvailability.findMany({
        where: whereClause,
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
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
      const availability = await prisma.nurseAvailability.update({
        where: { id },
        data
      });

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
      await prisma.nurseAvailability.delete({ where: { id } });
      logger.info(`Availability schedule ${id} deleted`);
    } catch (error) {
      logger.error('Error deleting nurse availability:', error);
      throw error;
    }
  }
}
