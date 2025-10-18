/**
 * WC-GEN-205 | AppointmentCalendarService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { Appointment, Student } from '../../database/models';

export class AppointmentCalendarService {
  /**
   * Generate calendar export (iCal format) for appointments
   */
  static async generateCalendarExport(nurseId: string, dateFrom?: Date, dateTo?: Date) {
    try {
      const whereClause: any = { nurseId };

      if (dateFrom || dateTo) {
        whereClause.scheduledAt = {};
        if (dateFrom) whereClause.scheduledAt[Op.gte] = dateFrom;
        if (dateTo) whereClause.scheduledAt[Op.lte] = dateTo;
      }

      const appointments = await Appointment.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [['scheduledAt', 'ASC']]
      });

      let ical = 'BEGIN:VCALENDAR\r\n';
      ical += 'VERSION:2.0\r\n';
      ical += 'PRODID:-//White Cross//School Nurse Platform//EN\r\n';
      ical += 'CALSCALE:GREGORIAN\r\n';
      ical += 'METHOD:PUBLISH\r\n';

      for (const appointment of appointments) {
        const startDate = appointment.scheduledAt;
        const endDate = new Date(startDate.getTime() + appointment.duration * 60000);

        ical += 'BEGIN:VEVENT\r\n';
        ical += `UID:${appointment.id}@whitecross.com\r\n`;
        ical += `DTSTAMP:${this.formatICalDate(new Date())}\r\n`;
        ical += `DTSTART:${this.formatICalDate(startDate)}\r\n`;
        ical += `DTEND:${this.formatICalDate(endDate)}\r\n`;
        ical += `SUMMARY:${appointment.type.replace(/_/g, ' ')} - ${appointment.student!.firstName} ${appointment.student!.lastName}\r\n`;
        ical += `DESCRIPTION:${appointment.reason}\\n\\nStudent: ${appointment.student!.firstName} ${appointment.student!.lastName} (${appointment.student!.studentNumber})\\nStatus: ${appointment.status}\r\n`;
        ical += `STATUS:${
          appointment.status === 'COMPLETED'
            ? 'CONFIRMED'
            : appointment.status === 'CANCELLED'
              ? 'CANCELLED'
              : 'TENTATIVE'
        }\r\n`;
        ical += 'END:VEVENT\r\n';
      }

      ical += 'END:VCALENDAR\r\n';

      logger.info(`Generated calendar export for nurse ${nurseId} with ${appointments.length} appointments`);
      return ical;
    } catch (error) {
      logger.error('Error generating calendar export:', error);
      throw error;
    }
  }

  /**
   * Helper method to format dates for iCal
   */
  private static formatICalDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }
}
