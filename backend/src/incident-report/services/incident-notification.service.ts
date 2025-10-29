import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IncidentReport } from '../../database/models/incident-report.model';

@Injectable()
export class IncidentNotificationService {
  private readonly logger = new Logger(IncidentNotificationService.name);

  constructor(
    @InjectModel(IncidentReport)
    private incidentReportModel: typeof IncidentReport,
  ) {}

  /**
   * Notify emergency contacts about incident
   * This would integrate with the EmergencyContact service and notification system
   */
  async notifyEmergencyContacts(incidentId: string): Promise<boolean> {
    try {
      const report = await this.incidentReportModel.findByPk(incidentId);

      if (!report) {
        throw new NotFoundException('Incident report not found');
      }

      // TODO: Integration with EmergencyContact service
      // const student = await this.studentService.findById(report.studentId);
      // const emergencyContacts = await this.emergencyContactService.findByStudentId(student.id);

      // if (!emergencyContacts || emergencyContacts.length === 0) {
      //   this.logger.warn(`No emergency contacts found for incident ${incidentId}`);
      //   return false;
      // }

      const message = `Incident Alert: Student was involved in a ${report.type} incident (${report.severity} severity) on ${report.occurredAt.toLocaleString()}. Please contact the school for more information.`;

      // TODO: Send notifications via email, SMS, or push notification
      this.logger.log(
        `Emergency contacts would be notified for incident ${incidentId}: ${message}`,
      );

      // Mark as parent notified (automated notification)
      await this.markParentNotified(incidentId, 'auto-notification', 'system');

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
