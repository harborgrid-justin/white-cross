import { logger } from '../../utils/logger';
import { CreateAppointmentData, RecurrencePattern } from '../../types/appointment';
import { AppointmentService } from './AppointmentService';

export class AppointmentRecurringService {
  /**
   * Create recurring appointments
   */
  static async createRecurringAppointments(
    baseData: CreateAppointmentData,
    recurrencePattern: RecurrencePattern
  ) {
    try {
      const appointments = [];
      const currentDate = new Date(baseData.scheduledAt);

      while (currentDate <= recurrencePattern.endDate) {
        let shouldCreate = true;

        if (recurrencePattern.frequency === 'weekly' && recurrencePattern.daysOfWeek) {
          shouldCreate = recurrencePattern.daysOfWeek.includes(currentDate.getDay());
        }

        if (shouldCreate) {
          try {
            const appointment = await AppointmentService.createAppointment({
              ...baseData,
              scheduledAt: new Date(currentDate)
            });
            appointments.push(appointment);
          } catch (error) {
            logger.warn(`Failed to create recurring appointment for ${currentDate}: ${(error as Error).message}`);
          }
        }

        switch (recurrencePattern.frequency) {
          case 'daily':
            currentDate.setDate(currentDate.getDate() + recurrencePattern.interval);
            break;
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + 7 * recurrencePattern.interval);
            break;
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + recurrencePattern.interval);
            break;
        }
      }

      logger.info(`Created ${appointments.length} recurring appointments`);
      return appointments;
    } catch (error) {
      logger.error('Error creating recurring appointments:', error);
      throw error;
    }
  }
}
