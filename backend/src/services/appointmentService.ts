import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateAppointmentData {
  studentId: string;
  nurseId: string;
  type: 'ROUTINE_CHECKUP' | 'MEDICATION_ADMINISTRATION' | 'INJURY_ASSESSMENT' | 'ILLNESS_EVALUATION' | 'FOLLOW_UP' | 'SCREENING' | 'EMERGENCY';
  scheduledAt: Date;
  duration?: number; // minutes, defaults to 30
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  type?: 'ROUTINE_CHECKUP' | 'MEDICATION_ADMINISTRATION' | 'INJURY_ASSESSMENT' | 'ILLNESS_EVALUATION' | 'FOLLOW_UP' | 'SCREENING' | 'EMERGENCY';
  scheduledAt?: Date;
  duration?: number;
  reason?: string;
  notes?: string;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
}

export interface AppointmentFilters {
  nurseId?: string;
  studentId?: string;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  type?: 'ROUTINE_CHECKUP' | 'MEDICATION_ADMINISTRATION' | 'INJURY_ASSESSMENT' | 'ILLNESS_EVALUATION' | 'FOLLOW_UP' | 'SCREENING' | 'EMERGENCY';
  dateFrom?: Date;
  dateTo?: Date;
}

export interface AvailabilitySlot {
  start: Date;
  end: Date;
  available: boolean;
  conflictingAppointment?: {
    id: string;
    student: string;
    reason: string;
  };
}

export interface ReminderData {
  appointmentId: string;
  type: 'sms' | 'email' | 'voice';
  scheduleTime: Date; // When to send the reminder
  message?: string;
}

export class AppointmentService {
  /**
   * Get appointments with pagination and filters
   */
  static async getAppointments(
    page: number = 1,
    limit: number = 20,
    filters: AppointmentFilters = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      
      const whereClause: any = {};
      
      if (filters.nurseId) {
        whereClause.nurseId = filters.nurseId;
      }
      
      if (filters.studentId) {
        whereClause.studentId = filters.studentId;
      }
      
      if (filters.status) {
        whereClause.status = filters.status;
      }
      
      if (filters.type) {
        whereClause.type = filters.type;
      }
      
      if (filters.dateFrom || filters.dateTo) {
        whereClause.scheduledAt = {};
        if (filters.dateFrom) {
          whereClause.scheduledAt.gte = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.scheduledAt.lte = filters.dateTo;
        }
      }

      const [appointments, total] = await Promise.all([
        prisma.appointment.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentNumber: true,
                grade: true
              }
            },
            nurse: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          },
          orderBy: { scheduledAt: 'asc' }
        }),
        prisma.appointment.count({ where: whereClause })
      ]);

      return {
        appointments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
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
      // Verify student exists
      const student = await prisma.student.findUnique({
        where: { id: data.studentId }
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Verify nurse exists
      const nurse = await prisma.user.findUnique({
        where: { id: data.nurseId }
      });

      if (!nurse) {
        throw new Error('Nurse not found');
      }

      // Check for scheduling conflicts
      const conflicts = await this.checkAvailability(
        data.nurseId,
        data.scheduledAt,
        data.duration || 30
      );

      if (conflicts.length > 0) {
        throw new Error('Nurse is not available at the requested time');
      }

      const appointment = await prisma.appointment.create({
        data: {
          ...data,
          duration: data.duration || 30
        },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true,
              grade: true
            }
          },
          nurse: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      logger.info(`Appointment created: ${appointment.type} for ${student.firstName} ${student.lastName} with ${nurse.firstName} ${nurse.lastName} at ${appointment.scheduledAt}`);
      
      // Schedule automatic reminders
      await this.scheduleReminders(appointment.id);
      
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
      const existingAppointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          student: true,
          nurse: true
        }
      });

      if (!existingAppointment) {
        throw new Error('Appointment not found');
      }

      // If rescheduling, check for conflicts
      if (data.scheduledAt && data.scheduledAt.getTime() !== existingAppointment.scheduledAt.getTime()) {
        const conflicts = await this.checkAvailability(
          existingAppointment.nurseId,
          data.scheduledAt,
          data.duration || existingAppointment.duration,
          id // Exclude current appointment from conflict check
        );

        if (conflicts.length > 0) {
          throw new Error('Nurse is not available at the requested time');
        }
      }

      const appointment = await prisma.appointment.update({
        where: { id },
        data,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true,
              grade: true
            }
          },
          nurse: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      logger.info(`Appointment updated: ${appointment.id} - ${appointment.type} for ${existingAppointment.student.firstName} ${existingAppointment.student.lastName}`);
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
        data: { 
          status: 'CANCELLED',
          notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          nurse: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Appointment cancelled: ${appointment.type} for ${appointment.student.firstName} ${appointment.student.lastName}`);
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
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Appointment marked as no-show: ${appointment.type} for ${appointment.student.firstName} ${appointment.student.lastName}`);
      return appointment;
    } catch (error) {
      logger.error('Error marking appointment as no-show:', error);
      throw error;
    }
  }

  /**
   * Check nurse availability for a given time slot
   */
  static async checkAvailability(
    nurseId: string,
    startTime: Date,
    duration: number,
    excludeAppointmentId?: string
  ) {
    try {
      const endTime = new Date(startTime.getTime() + duration * 60000);
      
      const whereClause: any = {
        nurseId,
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS']
        },
        OR: [
          {
            scheduledAt: {
              lt: endTime
            },
            // Check if existing appointment ends after new start time
            AND: {
              scheduledAt: {
                gte: new Date(startTime.getTime() - 30 * 60000) // 30 min buffer
              }
            }
          }
        ]
      };

      if (excludeAppointmentId) {
        whereClause.id = { not: excludeAppointmentId };
      }

      const conflicts = await prisma.appointment.findMany({
        where: whereClause,
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      return conflicts;
    } catch (error) {
      logger.error('Error checking availability:', error);
      throw error;
    }
  }

  /**
   * Get available time slots for a nurse on a given date
   */
  static async getAvailableSlots(
    nurseId: string,
    date: Date,
    slotDuration: number = 30
  ): Promise<AvailabilitySlot[]> {
    try {
      // Define working hours (8 AM to 5 PM)
      const startHour = 8;
      const endHour = 17;
      
      const startDate = new Date(date);
      startDate.setHours(startHour, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(endHour, 0, 0, 0);

      // Get all appointments for the day
      const appointments = await prisma.appointment.findMany({
        where: {
          nurseId,
          scheduledAt: {
            gte: startDate,
            lt: endDate
          },
          status: {
            in: ['SCHEDULED', 'IN_PROGRESS']
          }
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { scheduledAt: 'asc' }
      });

      const slots: AvailabilitySlot[] = [];
      let currentTime = new Date(startDate);

      while (currentTime < endDate) {
        const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);
        
        // Check if this slot conflicts with any appointment
        const conflict = appointments.find((appointment: any) => {
          const appointmentEnd = new Date(appointment.scheduledAt.getTime() + appointment.duration * 60000);
          return (
            currentTime < appointmentEnd &&
            slotEnd > appointment.scheduledAt
          );
        });

        slots.push({
          start: new Date(currentTime),
          end: new Date(slotEnd),
          available: !conflict,
          conflictingAppointment: conflict ? {
            id: conflict.id,
            student: `${conflict.student.firstName} ${conflict.student.lastName}`,
            reason: conflict.reason
          } : undefined
        });

        currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
      }

      return slots;
    } catch (error) {
      logger.error('Error getting available slots:', error);
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
          scheduledAt: {
            gte: new Date()
          },
          status: {
            in: ['SCHEDULED', 'IN_PROGRESS']
          }
        },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true,
              grade: true
            }
          }
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

  /**
   * Get appointment statistics
   */
  static async getAppointmentStatistics(nurseId?: string, dateFrom?: Date, dateTo?: Date) {
    try {
      const whereClause: any = {};
      
      if (nurseId) {
        whereClause.nurseId = nurseId;
      }
      
      if (dateFrom || dateTo) {
        whereClause.scheduledAt = {};
        if (dateFrom) {
          whereClause.scheduledAt.gte = dateFrom;
        }
        if (dateTo) {
          whereClause.scheduledAt.lte = dateTo;
        }
      }

      const [statusStats, typeStats, totalAppointments] = await Promise.all([
        prisma.appointment.groupBy({
          by: ['status'],
          where: whereClause,
          _count: { status: true }
        }),
        prisma.appointment.groupBy({
          by: ['type'],
          where: whereClause,
          _count: { type: true }
        }),
        prisma.appointment.count({ where: whereClause })
      ]);

      const noShowRate = statusStats.find((s: any) => s.status === 'NO_SHOW')?._count.status || 0;
      const completedCount = statusStats.find((s: any) => s.status === 'COMPLETED')?._count.status || 0;

      return {
        total: totalAppointments,
        byStatus: statusStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.status] = curr._count.status;
          return acc;
        }, {}),
        byType: typeStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.type] = curr._count.type;
          return acc;
        }, {}),
        noShowRate: totalAppointments > 0 ? (noShowRate / totalAppointments) * 100 : 0,
        completionRate: totalAppointments > 0 ? (completedCount / totalAppointments) * 100 : 0
      };
    } catch (error) {
      logger.error('Error fetching appointment statistics:', error);
      throw error;
    }
  }

  /**
   * Schedule automatic reminders for an appointment
   */
  static async scheduleReminders(appointmentId: string) {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          student: {
            include: {
              emergencyContacts: {
                where: { isActive: true },
                orderBy: { priority: 'asc' }
              }
            }
          }
        }
      });

      if (!appointment || !appointment.student.emergencyContacts.length) {
        return;
      }

      // Schedule reminders at different intervals
      const reminderIntervals = [
        { hours: 24, message: '24-hour reminder' },
        { hours: 2, message: '2-hour reminder' },
        { hours: 0.5, message: '30-minute reminder' }
      ];

      const reminders = [];
      
      for (const interval of reminderIntervals) {
        const reminderTime = new Date(appointment.scheduledAt.getTime() - interval.hours * 60 * 60 * 1000);
        
        // Only schedule if reminder time is in the future
        if (reminderTime > new Date()) {
          reminders.push({
            appointmentId,
            type: 'sms' as const,
            scheduleTime: reminderTime,
            message: `Appointment reminder: ${appointment.student.firstName} has a ${appointment.type} appointment on ${appointment.scheduledAt.toLocaleString()}`
          });
        }
      }

      // In a real implementation, these would be stored in a job queue (Redis/Bull)
      logger.info(`Scheduled ${reminders.length} reminders for appointment ${appointmentId}`);
      return reminders;
    } catch (error) {
      logger.error('Error scheduling reminders:', error);
      throw error;
    }
  }

  /**
   * Create recurring appointments
   */
  static async createRecurringAppointments(
    baseData: CreateAppointmentData,
    recurrencePattern: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number; // every N days/weeks/months
      endDate: Date;
      daysOfWeek?: number[]; // for weekly: 0=Sunday, 1=Monday, etc.
    }
  ) {
    try {
      const appointments = [];
      let currentDate = new Date(baseData.scheduledAt);
      
      while (currentDate <= recurrencePattern.endDate) {
        // Check if we should create appointment on this date
        let shouldCreate = true;
        
        if (recurrencePattern.frequency === 'weekly' && recurrencePattern.daysOfWeek) {
          shouldCreate = recurrencePattern.daysOfWeek.includes(currentDate.getDay());
        }
        
        if (shouldCreate) {
          try {
            const appointment = await this.createAppointment({
              ...baseData,
              scheduledAt: new Date(currentDate)
            });
            appointments.push(appointment);
          } catch (error) {
            logger.warn(`Failed to create recurring appointment for ${currentDate}: ${(error as Error).message}`);
          }
        }
        
        // Calculate next date
        switch (recurrencePattern.frequency) {
          case 'daily':
            currentDate.setDate(currentDate.getDate() + recurrencePattern.interval);
            break;
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + (7 * recurrencePattern.interval));
            break;
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + recurrencePattern.interval);
            break;
        }
      }

      logger.info(`Created ${appointments.length} recurring appointments`);
      return appointments;
    } catch (error) {
      logger.error('Error creating recurring appointments:', error);
      throw error;
    }
  }
}