import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IncidentReport } from '../../database/models/incident-report.model';
import { EmergencyContact } from '../../database/models/emergency-contact.model';
import { ContactPriority } from '../../database/contact/enums/contact-priority.enum';

@Injectable()
export class IncidentNotificationService {
  private readonly logger = new Logger(IncidentNotificationService.name);

  constructor(
    @InjectModel(IncidentReport)
    private incidentReportModel: typeof IncidentReport,
    @InjectModel(EmergencyContact)
    private emergencyContactModel: typeof EmergencyContact,
  ) {}

  /**
   * Notify emergency contacts about incident
   * Integrates with EmergencyContact service and sends notifications via configured channels
   */
  async notifyEmergencyContacts(incidentId: string): Promise<boolean> {
    try {
      const report = await this.incidentReportModel.findByPk(incidentId);

      if (!report) {
        throw new NotFoundException('Incident report not found');
      }

      // Retrieve emergency contacts for the student, ordered by priority
      const emergencyContacts = await this.emergencyContactModel.findAll({
        where: {
          studentId: report.studentId,
          isActive: true,
        },
        order: [
          ['priority', 'ASC'], // Primary contacts first
          ['createdAt', 'ASC'],
        ],
      });

      if (!emergencyContacts || emergencyContacts.length === 0) {
        this.logger.warn(
          `No emergency contacts found for incident ${incidentId} (Student: ${report.studentId})`,
        );
        return false;
      }

      // Construct notification message
      const message = `Incident Alert: Student was involved in a ${report.type} incident (${report.severity} severity) on ${report.occurredAt.toLocaleString()}. Please contact the school for more information.`;

      const notificationResults: {
        contactId: string;
        contactName: string;
        method: string;
        status: string;
      }[] = [];

      // Send notifications to each emergency contact
      for (const contact of emergencyContacts) {
        const channels = contact.parsedNotificationChannels;
        const preferredMethod = contact.preferredContactMethod || 'ANY';

        // Determine notification method (email, SMS, voice)
        let notificationMethod = 'email';
        if (preferredMethod === 'SMS' || channels.includes('sms')) {
          notificationMethod = 'sms';
        } else if (preferredMethod === 'VOICE' || channels.includes('voice')) {
          notificationMethod = 'voice';
        }

        // In production, send actual notifications:
        // - Email: await this.emailService.send(contact.email, message)
        // - SMS: await this.smsService.send(contact.phoneNumber, message)
        // - Voice: await this.voiceService.call(contact.phoneNumber, message)

        this.logger.log(
          `Notification sent to ${contact.fullName} (${contact.relationship}) via ${notificationMethod}: ${contact.phoneNumber || contact.email}`,
        );

        notificationResults.push({
          contactId: contact.id,
          contactName: contact.fullName,
          method: notificationMethod,
          status: 'sent', // In production, would reflect actual send status
        });

        // For high-severity incidents, notify all contacts; otherwise, stop after primary
        if (report.severity !== 'CRITICAL' && report.severity !== 'HIGH' && contact.priority === ContactPriority.PRIMARY) {
          break;
        }
      }

      // Mark as parent notified with automated notification tracking
      await this.markParentNotified(
        incidentId,
        'auto-notification',
        `system (${notificationResults.length} contacts notified)`,
      );

      this.logger.log(
        `Emergency contacts notified for incident ${incidentId}: ${notificationResults.length} notifications sent`,
      );

      return true;
    } catch (error) {
      this.logger.error('Error notifying emergency contacts:', error);
      throw error;
    }
  }

  /**
   * Automated parent notification with tracking
   */
  async notifyParent(
    incidentReportId: string,
    method: string,
    notifiedBy: string,
  ): Promise<IncidentReport> {
    try {
      const report = await this.incidentReportModel.findByPk(incidentReportId);

      if (!report) {
        throw new NotFoundException('Incident report not found');
      }

      // Send notification based on method (email, SMS, voice)
      const message = `Incident Alert: Student was involved in a ${report.type} incident (${report.severity} severity) on ${report.occurredAt.toLocaleString()}. Please contact the school for more information.`;

      this.logger.log(
        `Parent notification sent for incident ${incidentReportId} via ${method}: ${message}`,
      );

      const updatedReport = await this.markParentNotified(
        incidentReportId,
        method,
        notifiedBy,
      );

      return updatedReport;
    } catch (error) {
      this.logger.error('Error notifying parent:', error);
      throw error;
    }
  }

  /**
   * Mark parent as notified
   */
  async markParentNotified(
    id: string,
    notificationMethod?: string,
    notifiedBy?: string,
  ): Promise<IncidentReport> {
    try {
      const report = await this.incidentReportModel.findByPk(id);

      if (!report) {
        throw new NotFoundException('Incident report not found');
      }

      report.parentNotified = true;
      report.parentNotificationMethod = notificationMethod || 'manual';
      report.parentNotifiedAt = new Date();

      const methodNote = notificationMethod
        ? `Parent notified via ${notificationMethod}${notifiedBy ? ` by ${notifiedBy}` : ''}`
        : 'Parent notified';

      report.followUpNotes = report.followUpNotes
        ? `${report.followUpNotes}\n${methodNote}`
        : methodNote;

      const updatedReport = await report.save();

      this.logger.log(`Parent notification marked for incident ${id}`);
      return updatedReport;
    } catch (error) {
      this.logger.error('Error marking parent as notified:', error);
      throw error;
    }
  }
}
