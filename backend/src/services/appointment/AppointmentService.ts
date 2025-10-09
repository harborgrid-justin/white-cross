import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../../utils/logger';
import {
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters
} from '../../types/appointment';
import { AppointmentAvailabilityService } from './AppointmentAvailabilityService';
import { AppointmentReminderService } from './AppointmentReminderService';
import { AppointmentWaitlistService } from './AppointmentWaitlistService';

const prisma = new PrismaClient();

export class AppointmentService {
  /**
   * Get appointments with pagination and filters
   */
  static async getAppointments(page: number = 1, limit: number = 20, filters: AppointmentFilters = {}) {
    try {
      const skip = (page - 1) * limit;
      const whereClause: Prisma.AppointmentWhereInput = {};

      if (filters.nurseId) whereClause.nurseId = filters.nurseId;
      if (filters.studentId) whereClause.studentId = filters.studentId;
      if (filters.status) whereClause.status = filters.status;
      if (filters.type) whereClause.type = filters.type;

      if (filters.dateFrom || filters.dateTo) {
        whereClause.scheduledAt = {};
        if (filters.dateFrom) whereClause.scheduledAt.gte = filters.dateFrom;
        if (filters.dateTo) whereClause.scheduledAt.lte = filters.dateTo;
      }

      const [appointments, total] = await Promise.all([
        prisma.appointment.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            student: { select: { id: true, firstName: true, lastName: true, studentNumber: true, grade: true } },
            nurse: { select: { id: true, firstName: true, lastName: true, email: true } }
          },
          orderBy: { scheduledAt: 'asc' }
        }),
        prisma.appointment.count({ where: whereClause })
      ]);

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
      const student = await prisma.student.findUnique({ where: { id: data.studentId } });
      if (!student) throw new Error('Student not found');

      const nurse = await prisma.user.findUnique({ where: { id: data.nurseId } });
      if (!nurse) throw new Error('Nurse not found');

      const conflicts = await AppointmentAvailabilityService.checkAvailability(
        data.nurseId,
        data.scheduledAt,
        data.duration || 30
      );

      if (conflicts.length > 0) throw new Error('Nurse is not available at the requested time');

      const appointment = await prisma.appointment.create({
        data: { ...data, duration: data.duration || 30 },
        include: {
          student: { select: { id: true, firstName: true, lastName: true, studentNumber: true, grade: true } },
          nurse: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
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
      const existing = await prisma.appointment.findUnique({
        where: { id },
        include: { student: true, nurse: true }
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

      const appointment = await prisma.appointment.update({
        where: { id },
        data,
        include: {
          student: { select: { id: true, firstName: true, lastName: true, studentNumber: true, grade: true } },
          nurse: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

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
      const appointment = await prisma.appointment.update({
        where: { id },
        data: { status: 'CANCELLED', notes: reason ? `Cancelled: ${reason}` : 'Cancelled' },
        include: {
          student: { select: { firstName: true, lastName: true } },
          nurse: { select: { firstName: true, lastName: true } }
        }
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
      const appointment = await prisma.appointment.update({
        where: { id },
        data: { status: 'NO_SHOW' },
        include: { student: { select: { firstName: true, lastName: true } } }
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
      const appointments = await prisma.appointment.findMany({
        where: {
          nurseId,
          scheduledAt: { gte: new Date() },
          status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
        },
        include: {
          student: { select: { id: true, firstName: true, lastName: true, studentNumber: true, grade: true } }
        },
        orderBy: { scheduledAt: 'asc' },
        take: limit
      });

      return appointments;
    } catch (error) {
      logger.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  }
}
