import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../../utils/logger';
import { WaitlistEntry } from '../../types/appointment';

const prisma = new PrismaClient();

export class AppointmentWaitlistService {
  /**
   * Add to waitlist
   */
  static async addToWaitlist(data: WaitlistEntry) {
    try {
      const student = await prisma.student.findUnique({ where: { id: data.studentId } });
      if (!student) throw new Error('Student not found');

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const waitlistEntry = await prisma.appointmentWaitlist.create({
        data: {
          studentId: data.studentId,
          nurseId: data.nurseId,
          type: data.type,
          preferredDate: data.preferredDate,
          duration: data.duration || 30,
          priority: data.priority || 'NORMAL',
          reason: data.reason,
          notes: data.notes,
          expiresAt
        },
        include: { student: { select: { firstName: true, lastName: true } } }
      });

      logger.info(`Added ${student.firstName} ${student.lastName} to waitlist for ${data.type}`);
      return waitlistEntry;
    } catch (error) {
      logger.error('Error adding to waitlist:', error);
      throw error;
    }
  }

  /**
   * Get waitlist entries
   */
  static async getWaitlist(filters?: { nurseId?: string; status?: string; priority?: string }) {
    try {
      const whereClause: Prisma.AppointmentWaitlistWhereInput = {};

      if (filters?.nurseId) whereClause.nurseId = filters.nurseId;
      if (filters?.status) whereClause.status = filters.status as any;
      if (filters?.priority) whereClause.priority = filters.priority as any;

      const waitlist = await prisma.appointmentWaitlist.findMany({
        where: whereClause,
        include: {
          student: { select: { id: true, firstName: true, lastName: true, studentNumber: true, grade: true } },
          nurse: { select: { id: true, firstName: true, lastName: true } }
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }]
      });

      return waitlist;
    } catch (error) {
      logger.error('Error fetching waitlist:', error);
      throw error;
    }
  }

  /**
   * Remove from waitlist
   */
  static async removeFromWaitlist(id: string, reason?: string) {
    try {
      const entry = await prisma.appointmentWaitlist.update({
        where: { id },
        data: { status: 'CANCELLED', notes: reason ? `Cancelled: ${reason}` : undefined }
      });

      logger.info(`Removed entry ${id} from waitlist`);
      return entry;
    } catch (error) {
      logger.error('Error removing from waitlist:', error);
      throw error;
    }
  }

  /**
   * Automatically fill slots from waitlist when appointment is cancelled
   */
  static async fillSlotFromWaitlist(cancelledAppointment: {
    scheduledAt: Date;
    duration: number;
    nurseId: string;
    type: string;
  }) {
    try {
      const waitlistEntries = await prisma.appointmentWaitlist.findMany({
        where: {
          status: 'WAITING',
          type: cancelledAppointment.type as any,
          OR: [{ nurseId: cancelledAppointment.nurseId }, { nurseId: null }]
        },
        include: {
          student: {
            include: {
              emergencyContacts: { where: { isActive: true }, orderBy: { priority: 'asc' }, take: 1 }
            }
          }
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
        take: 5
      });

      for (const entry of waitlistEntries) {
        try {
          // Import here to avoid circular dependency
          const { AppointmentService } = await import('./AppointmentService');

          const appointment = await AppointmentService.createAppointment({
            studentId: entry.studentId,
            nurseId: cancelledAppointment.nurseId,
            type: entry.type,
            scheduledAt: cancelledAppointment.scheduledAt,
            duration: entry.duration,
            reason: entry.reason,
            notes: `Auto-scheduled from waitlist: ${entry.notes || ''}`
          });

          await prisma.appointmentWaitlist.update({
            where: { id: entry.id },
            data: { status: 'SCHEDULED', notifiedAt: new Date() }
          });

          logger.info(`Auto-filled slot for ${entry.student.firstName} ${entry.student.lastName} from waitlist`);

          if (entry.student.emergencyContacts.length > 0) {
            const contact = entry.student.emergencyContacts[0];
            logger.info(`Would notify ${contact.firstName} ${contact.lastName} at ${contact.phoneNumber}`);
          }

          return appointment;
        } catch (error) {
          logger.warn(`Could not schedule waitlist entry ${entry.id}: ${(error as Error).message}`);
          continue;
        }
      }

      logger.info('No suitable waitlist entries found for the cancelled slot');
      return null;
    } catch (error) {
      logger.error('Error filling slot from waitlist:', error);
      throw error;
    }
  }
}
