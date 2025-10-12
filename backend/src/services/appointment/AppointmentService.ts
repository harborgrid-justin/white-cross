import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters
} from '../../types/appointment';
import { AppointmentAvailabilityService } from './AppointmentAvailabilityService';
import { AppointmentReminderService } from './AppointmentReminderService';
import { AppointmentWaitlistService } from './AppointmentWaitlistService';
import { Appointment, Student, User } from '../../database/models';

export class AppointmentService {
  /**
   * Get appointments with pagination and filters
   */
  static async getAppointments(page: number = 1, limit: number = 20, filters: AppointmentFilters = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (filters.nurseId) whereClause.nurseId = filters.nurseId;
      if (filters.studentId) whereClause.studentId = filters.studentId;
      if (filters.status) whereClause.status = filters.status;
      if (filters.type) whereClause.type = filters.type;

      if (filters.dateFrom || filters.dateTo) {
        whereClause.scheduledAt = {};
        if (filters.dateFrom) whereClause.scheduledAt[Op.gte] = filters.dateFrom;
        if (filters.dateTo) whereClause.scheduledAt[Op.lte] = filters.dateTo;
      }

      const { rows: appointments, count: total } = await Appointment.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['scheduledAt', 'ASC']]
      });

      return { appointments, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
    } catch (error) {
      logger.error('Error fetching appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  }

  /**
   * Create new appointment
   */
  static async createAppointment(data: CreateAppointmentData) {
    try {
      const student = await Student.findByPk(data.studentId);
      if (!student) throw new Error('Student not found');

      const nurse = await User.findByPk(data.nurseId);
      if (!nurse) throw new Error('Nurse not found');

      const conflicts = await AppointmentAvailabilityService.checkAvailability(
        data.nurseId,
        data.scheduledAt,
        data.duration || 30
      );

      if (conflicts.length > 0) throw new Error('Nurse is not available at the requested time');

      const appointment = await Appointment.create(
        { ...data, duration: data.duration || 30 }
      );

      // Reload with associations
      await appointment.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      logger.info(`Appointment created: ${appointment.type} for ${student.firstName} ${student.lastName}`);
      await AppointmentReminderService.scheduleReminders(appointment.id);

      return appointment;
    } catch (error) {
      logger.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Update appointment
   */
  static async updateAppointment(id: string, data: UpdateAppointmentData) {
    try {
      const existing = await Appointment.findByPk(id, {
        include: [
          { model: Student, as: 'student' },
          { model: User, as: 'nurse' }
        ]
      });

      if (!existing) throw new Error('Appointment not found');

      if (data.scheduledAt && data.scheduledAt.getTime() !== existing.scheduledAt.getTime()) {
        const conflicts = await AppointmentAvailabilityService.checkAvailability(
          existing.nurseId,
          data.scheduledAt,
          data.duration || existing.duration,
          id
        );

        if (conflicts.length > 0) throw new Error('Nurse is not available at the requested time');
      }

      await existing.update(data);
      
      // Reload with associations
      await existing.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      const appointment = existing;

      logger.info(`Appointment updated: ${appointment.id}`);
      return appointment;
    } catch (error) {
      logger.error('Error updating appointment:', error);
      throw error;
    }
  }

  /**
   * Cancel appointment
   */
  static async cancelAppointment(id: string, reason?: string) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) throw new Error('Appointment not found');
      
      await appointment.update({
        status: 'CANCELLED',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
      });

      // Reload with associations
      await appointment.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      logger.info(`Appointment cancelled: ${appointment.type} for ${appointment.student.firstName}`);

      try {
        await AppointmentWaitlistService.fillSlotFromWaitlist({
          scheduledAt: appointment.scheduledAt,
          duration: appointment.duration,
          nurseId: appointment.nurseId,
          type: appointment.type
        });
      } catch (waitlistError) {
        logger.warn('Could not fill slot from waitlist:', waitlistError);
      }

      return appointment;
    } catch (error) {
      logger.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  /**
   * Mark appointment as no-show
   */
  static async markNoShow(id: string) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) throw new Error('Appointment not found');
      
      await appointment.update({ status: 'NO_SHOW' });

      // Reload with associations
      await appointment.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      logger.info(`Appointment marked as no-show: ${appointment.type}`);
      return appointment;
    } catch (error) {
      logger.error('Error marking appointment as no-show:', error);
      throw error;
    }
  }

  /**
   * Get upcoming appointments for a nurse
   */
  static async getUpcomingAppointments(nurseId: string, limit: number = 10) {
    try {
      const appointments = await Appointment.findAll({
        where: {
          nurseId,
          scheduledAt: { [Op.gte]: new Date() },
          status: { [Op.in]: ['SCHEDULED', 'IN_PROGRESS'] }
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          }
        ],
        order: [['scheduledAt', 'ASC']],
        limit
      });

      return appointments;
    } catch (error) {
      logger.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  }
}
