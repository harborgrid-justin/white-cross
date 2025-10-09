import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

export class AppointmentCalendarService {
  /**
   * Generate calendar export (iCal format) for appointments
   */
  static async generateCalendarExport(nurseId: string, dateFrom?: Date, dateTo?: Date) {
    try {
      const whereClause: Prisma.AppointmentWhereInput = { nurseId };

      if (dateFrom || dateTo) {
        whereClause.scheduledAt = {};
        if (dateFrom) whereClause.scheduledAt.gte = dateFrom;
        if (dateTo) whereClause.scheduledAt.lte = dateTo;
      }

      const appointments = await prisma.appointment.findMany({
        where: whereClause,
        include: {
          student: { select: { firstName: true, lastName: true, studentNumber: true } }
        },
        orderBy: { scheduledAt: 'asc' }
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
        ical += `SUMMARY:${appointment.type.replace(/_/g, ' ')} - ${appointment.student.firstName} ${appointment.student.lastName}\r\n`;
        ical += `DESCRIPTION:${appointment.reason}\\n\\nStudent: ${appointment.student.firstName} ${appointment.student.lastName} (${appointment.student.studentNumber})\\nStatus: ${appointment.status}\r\n`;
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
