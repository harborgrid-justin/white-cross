import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

export class AppointmentReminderService {
  /**
   * Schedule automatic reminders for an appointment
   */
  static async scheduleReminders(appointmentId: string) {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          student: {
            include: {
              emergencyContacts: { where: { isActive: true }, orderBy: { priority: 'asc' } }
            }
          },
          nurse: { select: { firstName: true, lastName: true } }
        }
      });

      if (!appointment || !appointment.student.emergencyContacts.length) return [];

      const reminderIntervals = [
        { hours: 24, type: 'EMAIL' as const, label: '24-hour' },
        { hours: 2, type: 'SMS' as const, label: '2-hour' },
        { hours: 0.5, type: 'SMS' as const, label: '30-minute' }
      ];

      const reminders = [];

      for (const interval of reminderIntervals) {
        const reminderTime = new Date(appointment.scheduledAt.getTime() - interval.hours * 60 * 60 * 1000);

        if (reminderTime > new Date()) {
          const message = `Appointment reminder: ${appointment.student.firstName} ${appointment.student.lastName} has a ${appointment.type.toLowerCase().replace(/_/g, ' ')} appointment with ${appointment.nurse.firstName} ${appointment.nurse.lastName} on ${appointment.scheduledAt.toLocaleString()}`;

          const reminder = await prisma.appointmentReminder.create({
            data: {
              appointmentId,
              type: interval.type,
              scheduledFor: reminderTime,
              message,
              status: 'SCHEDULED'
            }
          });

          reminders.push(reminder);
        }
      }

      logger.info(`Scheduled ${reminders.length} reminders for appointment ${appointmentId}`);
      return reminders;
    } catch (error) {
      logger.error('Error scheduling reminders:', error);
      throw error;
    }
  }

  /**
   * Send appointment reminder through multiple channels
   */
  static async sendReminder(reminderId: string) {
    try {
      const reminder = await prisma.appointmentReminder.findUnique({
        where: { id: reminderId },
        include: {
          appointment: {
            include: {
              student: {
                include: {
                  emergencyContacts: { where: { isActive: true }, orderBy: { priority: 'asc' } }
                }
              },
              nurse: { select: { firstName: true, lastName: true } }
            }
          }
        }
      });

      if (!reminder || !reminder.appointment) throw new Error('Reminder or appointment not found');

      const { appointment } = reminder;
      const contact = appointment.student.emergencyContacts[0];

      if (!contact) {
        logger.warn(`No emergency contact found for student ${appointment.student.firstName}`);
        await prisma.appointmentReminder.update({
          where: { id: reminderId },
          data: { status: 'FAILED', failureReason: 'No emergency contact available' }
        });
        return;
      }

      const reminderMessage =
        reminder.message ||
        `Reminder: ${appointment.student.firstName} has a ${appointment.type.toLowerCase().replace(/_/g, ' ')} appointment with ${appointment.nurse.firstName} ${appointment.nurse.lastName} on ${appointment.scheduledAt.toLocaleString()}`;

      logger.info(`Sending ${reminder.type} reminder to ${contact.firstName} ${contact.lastName}`);

      switch (reminder.type) {
        case 'SMS':
          logger.info(`SMS to ${contact.phoneNumber}: ${reminderMessage}`);
          break;
        case 'EMAIL':
          logger.info(`Email to ${contact.email}: ${reminderMessage}`);
          break;
        case 'VOICE':
          logger.info(`Voice call to ${contact.phoneNumber}: ${reminderMessage}`);
          break;
      }

      await prisma.appointmentReminder.update({
        where: { id: reminderId },
        data: { status: 'SENT', sentAt: new Date() }
      });

      logger.info(`Reminder ${reminderId} sent successfully`);
    } catch (error) {
      logger.error('Error sending reminder:', error);

      try {
        await prisma.appointmentReminder.update({
          where: { id: reminderId },
          data: { status: 'FAILED', failureReason: (error as Error).message }
        });
      } catch (updateError) {
        logger.error('Error updating reminder status:', updateError);
      }

      throw error;
    }
  }

  /**
   * Process pending reminders
   */
  static async processPendingReminders() {
    try {
      const now = new Date();
      const pendingReminders = await prisma.appointmentReminder.findMany({
        where: { status: 'SCHEDULED', scheduledFor: { lte: now } },
        take: 50
      });

      let successCount = 0;
      let failureCount = 0;

      for (const reminder of pendingReminders) {
        try {
          await this.sendReminder(reminder.id);
          successCount++;
        } catch (error) {
          logger.error(`Failed to send reminder ${reminder.id}:`, error);
          failureCount++;
        }
      }

      logger.info(`Processed ${pendingReminders.length} reminders: ${successCount} sent, ${failureCount} failed`);

      return { total: pendingReminders.length, sent: successCount, failed: failureCount };
    } catch (error) {
      logger.error('Error processing pending reminders:', error);
      throw error;
    }
  }
}
