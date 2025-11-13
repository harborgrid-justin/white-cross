/**
 * @fileoverview Medication Reminder Notification Service
 * @module infrastructure/jobs/services
 * @description Service for sending medication reminder notifications
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize, QueryTypes } from 'sequelize';
import { EmailService } from '@/infrastructure/email';
import { MessageDelivery,
  RecipientType,
  DeliveryStatus,
  DeliveryChannelType,
  } from '@/database/models';

interface MedicationReminder {
  id: string;
  studentMedicationId: string;
  studentId: string;
  studentName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  scheduledTime: Date;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
}

/**
 * Contact information for reminder notifications
 */
interface ReminderContact {
  studentId: string;
  studentName: string;
  recipientType: RecipientType;
  email?: string;
  phone?: string;
  guardianName?: string;
}

/**
 * Service for sending medication reminder notifications
 */
@Injectable()
export class ReminderNotificationService extends BaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Send reminder notifications via email/SMS
   */
  async sendReminderNotifications(
    reminders: MedicationReminder[],
    jobId?: string,
  ): Promise<{ sent: number; failed: number }> {
    const now = new Date();
    let sent = 0;
    let failed = 0;

    // Filter for reminders that are due now (within the current hour)
    const dueReminders = reminders.filter((reminder) => {
      const hourDiff = Math.abs(now.getHours() - reminder.scheduledTime.getHours());
      return (
        reminder.status === 'PENDING' &&
        reminder.scheduledTime.getDate() === now.getDate() &&
        hourDiff === 0
      );
    });

    if (dueReminders.length === 0) {
      this.logDebug('No reminders due for notification at this time');
      return { sent, failed };
    }

    this.logInfo(`Sending notifications for ${dueReminders.length} due reminders`);

    // Group reminders by student for batch processing
    const remindersByStudent = this.groupRemindersByStudent(dueReminders);

    // Send notifications for each student
    for (const [studentId, studentReminders] of Object.entries(remindersByStudent)) {
      try {
        // Get contact information for the student
        const contacts = await this.getStudentContacts(studentId);

        if (contacts.length === 0) {
          this.logWarning(`No contact information found for student ${studentId}`);
          failed += studentReminders.length;
          continue;
        }

        // Send email notifications to all contacts
        for (const contact of contacts) {
          if (contact.email) {
            try {
              await this.sendEmailReminder(contact, studentReminders, jobId);
              sent++;
            } catch (error) {
              this.logError(`Failed to send email reminder to ${contact.email}`, error);
              failed++;
            }
          }

          // SMS notifications - placeholder for future implementation
          if (contact.phone) {
            this.logDebug(`SMS reminder would be sent to ${contact.phone} (not implemented)`);
          }
        }
      } catch (error) {
        this.logError(`Failed to send notifications for student ${studentId}`, error);
        failed += studentReminders.length;
      }
    }

    this.logInfo(`Notification delivery complete: ${sent} sent, ${failed} failed`);
    return { sent, failed };
  }

  /**
   * Send email reminder notification
   */
  private async sendEmailReminder(
    contact: ReminderContact,
    reminders: MedicationReminder[],
    jobId?: string,
  ): Promise<void> {
    const subject = `Medication Reminder for ${contact.studentName}`;
    const body = this.buildReminderEmailBody(contact, reminders);
    const html = this.buildReminderEmailHtml(contact, reminders);

    // Create delivery record
    const delivery = await MessageDelivery.create({
      recipientType: contact.recipientType,
      recipientId: contact.studentId,
      channel: DeliveryChannelType.EMAIL,
      status: DeliveryStatus.PENDING,
      contactInfo: contact.email,
      messageId: jobId || `reminder-${Date.now()}`,
    });

    try {
      // Send email
      const result = await this.emailService.sendEmail(contact.email, {
        subject,
        body,
        html,
      });

      // Update delivery record
      await delivery.update({
        status: result.success ? DeliveryStatus.SENT : DeliveryStatus.FAILED,
        sentAt: new Date(),
        deliveredAt: result.success ? new Date() : undefined,
        externalId: result.messageId,
        failureReason: result.error,
      });

      this.logInfo(`Email reminder sent to ${contact.email}`);
    } catch (error) {
      // Update delivery record with failure
      await delivery.update({
        status: DeliveryStatus.FAILED,
        failureReason: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Build plain text email body for reminder
   */
  private buildReminderEmailBody(
    contact: ReminderContact,
    reminders: MedicationReminder[],
  ): string {
    let body = `Hello${contact.guardianName ? ' ' + contact.guardianName : ''},\n\n`;
    body += `This is a reminder about medication(s) for ${contact.studentName}:\n\n`;

    reminders.forEach((reminder) => {
      body += `- ${reminder.medicationName} (${reminder.dosage})\n`;
      body += `  Time: ${reminder.scheduledTime.toLocaleTimeString()}\n`;
      body += `  Frequency: ${reminder.frequency}\n\n`;
    });

    body += `Please ensure the medication is administered as scheduled.\n\n`;
    body += `If you have any questions, please contact the school nurse.\n\n`;
    body += `---\n`;
    body += `This is an automated message from White Cross Healthcare Platform.`;

    return body;
  }

  /**
   * Build HTML email body for reminder
   */
  private buildReminderEmailHtml(
    contact: ReminderContact,
    reminders: MedicationReminder[],
  ): string {
    let html = `<html><body>`;
    html += `<h2>Medication Reminder</h2>`;
    html += `<p>Hello${contact.guardianName ? ' ' + contact.guardianName : ''},</p>`;
    html += `<p>This is a reminder about medication(s) for <strong>${contact.studentName}</strong>:</p>`;
    html += `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">`;
    html += `<tr style="background-color: #f0f0f0;">`;
    html += `<th>Medication</th><th>Dosage</th><th>Time</th><th>Frequency</th>`;
    html += `</tr>`;

    reminders.forEach((reminder) => {
      html += `<tr>`;
      html += `<td>${reminder.medicationName}</td>`;
      html += `<td>${reminder.dosage}</td>`;
      html += `<td>${reminder.scheduledTime.toLocaleTimeString()}</td>`;
      html += `<td>${reminder.frequency}</td>`;
      html += `</tr>`;
    });

    html += `</table>`;
    html += `<p>Please ensure the medication is administered as scheduled.</p>`;
    html += `<p>If you have any questions, please contact the school nurse.</p>`;
    html += `<hr>`;
    html += `<p style="font-size: 0.9em; color: #666;">This is an automated message from White Cross Healthcare Platform.</p>`;
    html += `</body></html>`;

    return html;
  }

  /**
   * Group reminders by student ID
   */
  private groupRemindersByStudent(
    reminders: MedicationReminder[],
  ): Record<string, MedicationReminder[]> {
    return reminders.reduce(
      (acc, reminder) => {
        if (!acc[reminder.studentId]) {
          acc[reminder.studentId] = [];
        }
        acc[reminder.studentId].push(reminder);
        return acc;
      },
      {} as Record<string, MedicationReminder[]>,
    );
  }

  /**
   * Get contact information for a student
   */
  private async getStudentContacts(studentId: string): Promise<ReminderContact[]> {
    try {
      const contacts = await this.sequelize.query<{
        student_id: string;
        student_name: string;
        recipient_type: string;
        email: string;
        phone: string;
        guardian_name: string;
      }>(
        `
        SELECT
          s.id as student_id,
          s.first_name || ' ' || s.last_name as student_name,
          'PARENT' as recipient_type,
          s.parent_email as email,
          s.parent_phone as phone,
          s.parent_name as guardian_name
        FROM students s
        WHERE s.id = :studentId
          AND s.parent_email IS NOT NULL
        UNION
        SELECT
          s.id as student_id,
          s.first_name || ' ' || s.last_name as student_name,
          'GUARDIAN' as recipient_type,
          s.guardian_email as email,
          s.guardian_phone as phone,
          s.guardian_name
        FROM students s
        WHERE s.id = :studentId
          AND s.guardian_email IS NOT NULL
      `,
        {
          replacements: { studentId },
          type: QueryTypes.SELECT,
        },
      );

      return contacts.map((c) => ({
        studentId: c.student_id,
        studentName: c.student_name,
        recipientType: c.recipient_type as RecipientType,
        email: c.email,
        phone: c.phone,
        guardianName: c.guardian_name,
      }));
    } catch (error) {
      this.logError(`Failed to get contacts for student ${studentId}`, error);
      return [];
    }
  }
}
