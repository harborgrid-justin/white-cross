import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../../utils/logger';
import { AvailabilitySlot } from '../../types/appointment';

const prisma = new PrismaClient();

export class AppointmentAvailabilityService {
  /**
   * Check nurse availability for a given time slot
   */
  static async checkAvailability(
    nurseId: string,
    startTime: Date,
    duration: number,
    excludeAppointmentId?: string
  ) {
    try {
      const endTime = new Date(startTime.getTime() + duration * 60000);

      const whereClause: Prisma.AppointmentWhereInput = {
        nurseId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
        OR: [
          {
            scheduledAt: { lt: endTime },
            AND: { scheduledAt: { gte: new Date(startTime.getTime() - 30 * 60000) } }
          }
        ]
      };

      if (excludeAppointmentId) {
        whereClause.id = { not: excludeAppointmentId };
      }

      const conflicts = await prisma.appointment.findMany({
        where: whereClause,
        include: {
          student: { select: { firstName: true, lastName: true } }
        }
      });

      return conflicts;
    } catch (error) {
      logger.error('Error checking availability:', error);
      throw error;
    }
  }

  /**
   * Get available time slots for a nurse on a given date
   */
  static async getAvailableSlots(
    nurseId: string,
    date: Date,
    slotDuration: number = 30
  ): Promise<AvailabilitySlot[]> {
    try {
      const startHour = 8;
      const endHour = 17;

      const startDate = new Date(date);
      startDate.setHours(startHour, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(endHour, 0, 0, 0);

      const appointments = await prisma.appointment.findMany({
        where: {
          nurseId,
          scheduledAt: { gte: startDate, lt: endDate },
          status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
        },
        include: {
          student: { select: { firstName: true, lastName: true } }
        },
        orderBy: { scheduledAt: 'asc' }
      });

      const slots: AvailabilitySlot[] = [];
      let currentTime = new Date(startDate);

      while (currentTime < endDate) {
        const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);

        const conflict = appointments.find((appointment) => {
          const appointmentEnd = new Date(appointment.scheduledAt.getTime() + appointment.duration * 60000);
          return currentTime < appointmentEnd && slotEnd > appointment.scheduledAt;
        });

        slots.push({
          start: new Date(currentTime),
          end: new Date(slotEnd),
          available: !conflict,
          conflictingAppointment: conflict
            ? {
                id: conflict.id,
                student: `${conflict.student.firstName} ${conflict.student.lastName}`,
                reason: conflict.reason
              }
            : undefined
        });

        currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
      }

      return slots;
    } catch (error) {
      logger.error('Error getting available slots:', error);
      throw error;
    }
  }
}
