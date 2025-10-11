/**
 * Appointment Repository Implementation
 * Scheduling and appointment management
 */

import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Appointment } from '../../models/healthcare/Appointment';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class AppointmentRepository extends BaseRepository<Appointment, any, any> {
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Appointment, auditLogger, cacheManager, 'Appointment');
  }

  async findByStudent(studentId: string): Promise<any[]> {
    try {
      const appointments = await this.model.findAll({
        where: { studentId },
        order: [['scheduledDateTime', 'DESC']]
      });
      return appointments.map((a) => this.mapToEntity(a));
    } catch (error) {
      logger.error('Error finding appointments by student:', error);
      throw new RepositoryError('Failed to find appointments', 'FIND_BY_STUDENT_ERROR', 500);
    }
  }

  async findByNurse(nurseId: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    try {
      const where: any = { nurseId };
      if (startDate && endDate) {
        where.scheduledDateTime = { [Op.between]: [startDate, endDate] };
      }
      const appointments = await this.model.findAll({
        where,
        order: [['scheduledDateTime', 'ASC']]
      });
      return appointments.map((a) => this.mapToEntity(a));
    } catch (error) {
      logger.error('Error finding appointments by nurse:', error);
      throw new RepositoryError('Failed to find appointments', 'FIND_BY_NURSE_ERROR', 500);
    }
  }

  async findUpcoming(nurseId?: string, days: number = 7): Promise<any[]> {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      const where: any = {
        scheduledDateTime: { [Op.between]: [startDate, endDate] },
        status: { [Op.in]: ['SCHEDULED', 'CONFIRMED'] }
      };

      if (nurseId) {
        where.nurseId = nurseId;
      }

      const appointments = await this.model.findAll({
        where,
        order: [['scheduledDateTime', 'ASC']]
      });
      return appointments.map((a) => this.mapToEntity(a));
    } catch (error) {
      logger.error('Error finding upcoming appointments:', error);
      throw new RepositoryError('Failed to find upcoming appointments', 'FIND_UPCOMING_ERROR', 500);
    }
  }

  protected async invalidateCaches(appointment: Appointment): Promise<void> {
    try {
      const data = appointment.get();
      await this.cacheManager.deletePattern(`white-cross:appointment:student:${data.studentId}:*`);
      await this.cacheManager.deletePattern(`white-cross:appointment:nurse:${data.nurseId}:*`);
    } catch (error) {
      logger.warn('Error invalidating appointment caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

  protected shouldCache(): boolean {
    return false; // Appointments change frequently
  }
}
