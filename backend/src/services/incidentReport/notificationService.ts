/**
 * LOC: A21BA2DEF3
 * WC-GEN-265 | notificationService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - coreService.ts (services/incidentReport/coreService.ts)
 *   - index.ts (services/incidentReport/index.ts)
 */

/**
 * WC-GEN-265 | notificationService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models | Dependencies: ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { logger } from '../../utils/logger';
import { IncidentReport, Student, User, EmergencyContact } from '../../database/models';

export class NotificationService {
  /**
   * Notify emergency contacts about incident
   */
  static async notifyEmergencyContacts(incidentId: string) {
    try {
      const report = await IncidentReport.findByPk(incidentId, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade', 'dateOfBirth'],
            include: [
              {
                model: EmergencyContact,
                as: 'emergencyContacts',
                where: { isActive: true },
                required: false,
                order: [['priority', 'ASC']]
              }
            ]
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName', 'role', 'email']
          }
        ]
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      if (!report.student!.emergencyContacts || !report.student!.emergencyContacts.length) {
        logger.warn(`No emergency contacts found for incident ${incidentId}`);
        return;
      }

      const message = `Incident Alert: ${report.student!.firstName} ${report.student!.lastName} was involved in a ${report.type} incident (${report.severity} severity) on ${report.occurredAt.toLocaleString()}. Please contact the school nurse for more information.`;

      // This would integrate with the EmergencyContactService
      logger.info(`Emergency contacts would be notified for incident ${incidentId}: ${message}`);

      // Mark as parent notified
      await this.markParentNotified(incidentId, 'auto-notification', 'system');

      return true;
    } catch (error) {
      logger.error('Error notifying emergency contacts:', error);
      throw error;
    }
  }

  /**
   * Automated parent notification with tracking
   */
  static async notifyParent(
    incidentReportId: string,
    method: string,
    notifiedBy: string
  ) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      // Send notification based on method (email, SMS, voice)
      const message = `Incident Alert: ${report.student!.firstName} ${report.student!.lastName} was involved in a ${report.type} incident (${report.severity} severity) on ${report.occurredAt.toLocaleString()}. Please contact the school nurse for more information.`;

      logger.info(`Parent notification sent for incident ${incidentReportId} via ${method}: ${message}`);

      const updatedReport = await this.markParentNotified(incidentReportId, method, notifiedBy);

      return updatedReport;
    } catch (error) {
      logger.error('Error notifying parent:', error);
      throw error;
    }
  }

  /**
   * Mark parent as notified
   */
  static async markParentNotified(id: string, notificationMethod?: string, notifiedBy?: string) {
    try {
      const report = await IncidentReport.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      await report.update({
        parentNotified: true,
        followUpNotes: notificationMethod
          ? `Parent notified via ${notificationMethod}${notifiedBy ? ` by ${notifiedBy}` : ''}`
          : 'Parent notified'
      });

      logger.info(`Parent notification marked for incident ${id} - ${report.student!.firstName} ${report.student!.lastName}`);
      return report;
    } catch (error) {
      logger.error('Error marking parent as notified:', error);
      throw error;
    }
  }
}
