import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { Appointment, AppointmentReminder, Student, EmergencyContact, User } from '../../database/models';
import { MessageType, ReminderStatus } from '../../database/types/enums';

// Type augmentations for associations
declare module '../../database/models/healthcare/Appointment' {
  interface Appointment {
    student?: Student & {
      emergencyContacts?: EmergencyContact[];
    };
    nurse?: User;
  }
}

declare module '../../database/models/healthcare/AppointmentReminder' {
  interface AppointmentReminder {
    appointment?: Appointment & {
      student?: Student & {
        emergencyContacts?: EmergencyContact[];
      };
      nurse?: User;
    };
  }
}

export class AppointmentReminderService {
  /**
   * Schedule automatic reminders for an appointment
   */
  static async scheduleReminders(appointmentId: string) {
    try {
      const appointment = await Appointment.findByPk(appointmentId, {
        include: [
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: EmergencyContact,
                as: 'emergencyContacts',
                where: { isActive: true },
                required: false,
              }
            ]
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      if (!appointment || !appointment.student || !appointment.student.emergencyContacts || !appointment.student.emergencyContacts.length) return [];

      // Sort emergency contacts by priority
      appointment.student.emergencyContacts.sort((a: any, b: any) => {
        const priorityOrder: Record<string, number> = { 'PRIMARY': 1, 'SECONDARY': 2, 'EMERGENCY_ONLY': 3 };
        return (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
      });

      const reminderIntervals = [
        { hours: 24, type: MessageType.EMAIL, label: '24-hour' },
        { hours: 2, type: MessageType.SMS, label: '2-hour' },
        { hours: 0.5, type: MessageType.SMS, label: '30-minute' }
      ];

      const reminders = [];

      for (const interval of reminderIntervals) {
        const reminderTime = new Date(appointment.scheduledAt.getTime() - interval.hours * 60 * 60 * 1000);

        if (reminderTime > new Date()) {
          const message = `Appointment reminder: ${appointment.student.firstName} ${appointment.student.lastName} has a ${appointment.type.toLowerCase().replace(/_/g, ' ')} appointment with ${appointment.nurse.firstName} ${appointment.nurse.lastName} on ${appointment.scheduledAt.toLocaleString()}`;

          const reminder = await AppointmentReminder.create({
            appointmentId,
            type: interval.type,
            scheduledFor: reminderTime,
            message,
            status: ReminderStatus.SCHEDULED
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
      const reminder = await AppointmentReminder.findByPk(reminderId, {
        include: [
          {
            model: Appointment,
            as: 'appointment',
            include: [
              {
                model: Student,
                as: 'student',
                include: [
                  {
                    model: EmergencyContact,
                    as: 'emergencyContacts',
                    where: { isActive: true },
                    required: false,
                  }
                ]
              },
              {
                model: User,
                as: 'nurse',
                attributes: ['firstName', 'lastName']
              }
            ]
          }
        ]
      });

      if (!reminder || !reminder.appointment) throw new Error('Reminder or appointment not found');

      const { appointment } = reminder;
      
      // Sort emergency contacts by priority
      if (appointment.student && appointment.student.emergencyContacts) {
        appointment.student.emergencyContacts.sort((a: any, b: any) => {
          const priorityOrder: Record<string, number> = { 'PRIMARY': 1, 'SECONDARY': 2, 'EMERGENCY_ONLY': 3 };
          return (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
        });
      }
      
      const contact = appointment.student?.emergencyContacts?.[0];

      if (!contact) {
        logger.warn(`No emergency contact found for student ${appointment.student?.firstName}`);
        await AppointmentReminder.update(
          { status: ReminderStatus.FAILED, failureReason: 'No emergency contact available' },
          { where: { id: reminderId } }
        );
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

      await AppointmentReminder.update(
        { status: ReminderStatus.SENT, sentAt: new Date() },
        { where: { id: reminderId } }
      );

      logger.info(`Reminder ${reminderId} sent successfully`);
    } catch (error) {
      logger.error('Error sending reminder:', error);

      try {
        await AppointmentReminder.update(
          { status: ReminderStatus.FAILED, failureReason: (error as Error).message },
          { where: { id: reminderId } }
        );
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
      const pendingReminders = await AppointmentReminder.findAll({
        where: { status: ReminderStatus.SCHEDULED, scheduledFor: { [Op.lte]: now } },
        limit: 50
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
