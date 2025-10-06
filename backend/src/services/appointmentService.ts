import { PrismaClient, Prisma } from '@prisma/client';
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

export interface NurseAvailabilityData {
  nurseId: string;
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  specificDate?: Date;
  isAvailable?: boolean;
  reason?: string;
}

export interface WaitlistEntry {
  studentId: string;
  nurseId?: string;
  type: 'ROUTINE_CHECKUP' | 'MEDICATION_ADMINISTRATION' | 'INJURY_ASSESSMENT' | 'ILLNESS_EVALUATION' | 'FOLLOW_UP' | 'SCREENING' | 'EMERGENCY';
  preferredDate?: Date;
  duration?: number;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  reason: string;
  notes?: string;
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
      
      const whereClause: Prisma.AppointmentWhereInput = {};
      
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
      
      // Try to fill the slot from waitlist
      try {
        await this.fillSlotFromWaitlist({
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
      
      const whereClause: Prisma.AppointmentWhereInput = {
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
        const conflict = appointments.find((appointment) => {
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
      const whereClause: Prisma.AppointmentWhereInput = {};
      
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

      const noShowRate = statusStats.find((s) => s.status === 'NO_SHOW')?._count.status || 0;
      const completedCount = statusStats.find((s) => s.status === 'COMPLETED')?._count.status || 0;

      return {
        total: totalAppointments,
        byStatus: statusStats.reduce((acc: Record<string, number>, curr) => {
          acc[curr.status] = curr._count.status;
          return acc;
        }, {}),
        byType: typeStats.reduce((acc: Record<string, number>, curr) => {
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
          },
          nurse: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      if (!appointment || !appointment.student.emergencyContacts.length) {
        return [];
      }

      // Schedule reminders at different intervals with multiple channels
      const reminderIntervals = [
        { hours: 24, type: 'EMAIL' as const, label: '24-hour' },
        { hours: 2, type: 'SMS' as const, label: '2-hour' },
        { hours: 0.5, type: 'SMS' as const, label: '30-minute' }
      ];

      const reminders = [];
      
      for (const interval of reminderIntervals) {
        const reminderTime = new Date(appointment.scheduledAt.getTime() - interval.hours * 60 * 60 * 1000);
        
        // Only schedule if reminder time is in the future
        if (reminderTime > new Date()) {
          const message = `Appointment reminder: ${appointment.student.firstName} ${appointment.student.lastName} has a ${appointment.type.toLowerCase().replace(/_/g, ' ')} appointment with ${appointment.nurse.firstName} ${appointment.nurse.lastName} on ${appointment.scheduledAt.toLocaleString()}`;
          
          const reminder = await prisma.appointmentReminder.create({
            data: {
              appointmentId,
              type: interval.type,
              scheduledFor: reminderTime,
              message,
              status: 'SCHEDULED'
            }
          });
          
          reminders.push(reminder);
        }
      }

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
      const currentDate = new Date(baseData.scheduledAt);
      
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

  /**
   * Set nurse availability schedule
   */
  static async setNurseAvailability(data: NurseAvailabilityData) {
    try {
      const availability = await prisma.nurseAvailability.create({
        data: {
          nurseId: data.nurseId,
          dayOfWeek: data.dayOfWeek ?? 0,
          startTime: data.startTime,
          endTime: data.endTime,
          isRecurring: data.isRecurring ?? true,
          specificDate: data.specificDate,
          isAvailable: data.isAvailable ?? true,
          reason: data.reason
        }
      });

      logger.info(`Availability set for nurse ${data.nurseId}`);
      return availability;
    } catch (error) {
      logger.error('Error setting nurse availability:', error);
      throw error;
    }
  }

  /**
   * Get nurse availability schedule
   */
  static async getNurseAvailability(nurseId: string, date?: Date) {
    try {
      const whereClause: Prisma.NurseAvailabilityWhereInput = { nurseId };

      if (date) {
        const dayOfWeek = date.getDay();
        whereClause.OR = [
          { isRecurring: true, dayOfWeek },
          { isRecurring: false, specificDate: date }
        ];
      }

      const availability = await prisma.nurseAvailability.findMany({
        where: whereClause,
        orderBy: [
          { dayOfWeek: 'asc' },
          { startTime: 'asc' }
        ]
      });

      return availability;
    } catch (error) {
      logger.error('Error fetching nurse availability:', error);
      throw error;
    }
  }

  /**
   * Update nurse availability
   */
  static async updateNurseAvailability(id: string, data: Partial<NurseAvailabilityData>) {
    try {
      const availability = await prisma.nurseAvailability.update({
        where: { id },
        data
      });

      logger.info(`Availability updated for schedule ${id}`);
      return availability;
    } catch (error) {
      logger.error('Error updating nurse availability:', error);
      throw error;
    }
  }

  /**
   * Delete nurse availability
   */
  static async deleteNurseAvailability(id: string) {
    try {
      await prisma.nurseAvailability.delete({
        where: { id }
      });

      logger.info(`Availability schedule ${id} deleted`);
    } catch (error) {
      logger.error('Error deleting nurse availability:', error);
      throw error;
    }
  }

  /**
   * Add to waitlist
   */
  static async addToWaitlist(data: WaitlistEntry) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: data.studentId }
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Set expiration to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const waitlistEntry = await prisma.appointmentWaitlist.create({
        data: {
          studentId: data.studentId,
          nurseId: data.nurseId,
          type: data.type,
          preferredDate: data.preferredDate,
          duration: data.duration || 30,
          priority: data.priority || 'NORMAL',
          reason: data.reason,
          notes: data.notes,
          expiresAt
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Added ${student.firstName} ${student.lastName} to waitlist for ${data.type}`);
      return waitlistEntry;
    } catch (error) {
      logger.error('Error adding to waitlist:', error);
      throw error;
    }
  }

  /**
   * Get waitlist entries
   */
  static async getWaitlist(filters?: { nurseId?: string; status?: string; priority?: string }) {
    try {
      const whereClause: Prisma.WaitlistEntryWhereInput = {};

      if (filters?.nurseId) {
        whereClause.nurseId = filters.nurseId;
      }

      if (filters?.status) {
        whereClause.status = filters.status;
      }

      if (filters?.priority) {
        whereClause.priority = filters.priority;
      }

      const waitlist = await prisma.appointmentWaitlist.findMany({
        where: whereClause,
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
              lastName: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ]
      });

      return waitlist;
    } catch (error) {
      logger.error('Error fetching waitlist:', error);
      throw error;
    }
  }

  /**
   * Remove from waitlist
   */
  static async removeFromWaitlist(id: string, reason?: string) {
    try {
      const entry = await prisma.appointmentWaitlist.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          notes: reason ? `Cancelled: ${reason}` : undefined
        }
      });

      logger.info(`Removed entry ${id} from waitlist`);
      return entry;
    } catch (error) {
      logger.error('Error removing from waitlist:', error);
      throw error;
    }
  }

  /**
   * Automatically fill slots from waitlist when appointment is cancelled
   */
  static async fillSlotFromWaitlist(cancelledAppointment: { scheduledAt: Date; duration: number; nurseId: string; type: string }) {
    try {
      // Find matching waitlist entries
      const waitlistEntries = await prisma.appointmentWaitlist.findMany({
        where: {
          status: 'WAITING',
          type: cancelledAppointment.type as any,
          OR: [
            { nurseId: cancelledAppointment.nurseId },
            { nurseId: null }
          ]
        },
        include: {
          student: {
            include: {
              emergencyContacts: {
                where: { isActive: true },
                orderBy: { priority: 'asc' },
                take: 1
              }
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ],
        take: 5
      });

      for (const entry of waitlistEntries) {
        try {
          // Try to book the cancelled slot
          const appointment = await this.createAppointment({
            studentId: entry.studentId,
            nurseId: cancelledAppointment.nurseId,
            type: entry.type,
            scheduledAt: cancelledAppointment.scheduledAt,
            duration: entry.duration,
            reason: entry.reason,
            notes: `Auto-scheduled from waitlist: ${entry.notes || ''}`
          });

          // Update waitlist status
          await prisma.appointmentWaitlist.update({
            where: { id: entry.id },
            data: {
              status: 'SCHEDULED',
              notifiedAt: new Date()
            }
          });

          logger.info(`Auto-filled slot for ${entry.student.firstName} ${entry.student.lastName} from waitlist`);
          
          // Notify the contact
          if (entry.student.emergencyContacts.length > 0) {
            const contact = entry.student.emergencyContacts[0];
            logger.info(`Would notify ${contact.firstName} ${contact.lastName} at ${contact.phoneNumber} about scheduled appointment`);
          }

          return appointment;
        } catch (error) {
          logger.warn(`Could not schedule waitlist entry ${entry.id}: ${(error as Error).message}`);
          continue;
        }
      }

      logger.info('No suitable waitlist entries found for the cancelled slot');
      return null;
    } catch (error) {
      logger.error('Error filling slot from waitlist:', error);
      throw error;
    }
  }

  /**
   * Send appointment reminders through multiple channels
   */
  static async sendReminder(reminderId: string) {
    try {
      const reminder = await prisma.appointmentReminder.findUnique({
        where: { id: reminderId },
        include: {
          appointment: {
            include: {
              student: {
                include: {
                  emergencyContacts: {
                    where: { isActive: true },
                    orderBy: { priority: 'asc' }
                  }
                }
              },
              nurse: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      if (!reminder || !reminder.appointment) {
        throw new Error('Reminder or appointment not found');
      }

      const { appointment } = reminder;
      const contact = appointment.student.emergencyContacts[0];

      if (!contact) {
        logger.warn(`No emergency contact found for student ${appointment.student.firstName} ${appointment.student.lastName}`);
        await prisma.appointmentReminder.update({
          where: { id: reminderId },
          data: {
            status: 'FAILED',
            failureReason: 'No emergency contact available'
          }
        });
        return;
      }

      // In a real implementation, integrate with SMS/Email/Voice services
      const reminderMessage = reminder.message || 
        `Reminder: ${appointment.student.firstName} has a ${appointment.type.toLowerCase().replace(/_/g, ' ')} appointment with ${appointment.nurse.firstName} ${appointment.nurse.lastName} on ${appointment.scheduledAt.toLocaleString()}`;

      logger.info(`Sending ${reminder.type} reminder to ${contact.firstName} ${contact.lastName}`);
      
      // Simulate sending through different channels
      switch (reminder.type) {
        case 'SMS':
          logger.info(`SMS to ${contact.phoneNumber}: ${reminderMessage}`);
          break;
        case 'EMAIL':
          logger.info(`Email to ${contact.email}: ${reminderMessage}`);
          break;
        case 'VOICE':
          logger.info(`Voice call to ${contact.phoneNumber}: ${reminderMessage}`);
          break;
      }

      await prisma.appointmentReminder.update({
        where: { id: reminderId },
        data: {
          status: 'SENT',
          sentAt: new Date()
        }
      });

      logger.info(`Reminder ${reminderId} sent successfully`);
    } catch (error) {
      logger.error('Error sending reminder:', error);
      
      // Update reminder status to failed
      try {
        await prisma.appointmentReminder.update({
          where: { id: reminderId },
          data: {
            status: 'FAILED',
            failureReason: (error as Error).message
          }
        });
      } catch (updateError) {
        logger.error('Error updating reminder status:', updateError);
      }
      
      throw error;
    }
  }

  /**
   * Process pending reminders
   */
  static async processPendingReminders() {
    try {
      const now = new Date();
      const pendingReminders = await prisma.appointmentReminder.findMany({
        where: {
          status: 'SCHEDULED',
          scheduledFor: {
            lte: now
          }
        },
        take: 50 // Process in batches
      });

      let successCount = 0;
      let failureCount = 0;

      for (const reminder of pendingReminders) {
        try {
          await this.sendReminder(reminder.id);
          successCount++;
        } catch (error) {
          logger.error(`Failed to send reminder ${reminder.id}:`, error);
          failureCount++;
        }
      }

      logger.info(`Processed ${pendingReminders.length} reminders: ${successCount} sent, ${failureCount} failed`);
      
      return {
        total: pendingReminders.length,
        sent: successCount,
        failed: failureCount
      };
    } catch (error) {
      logger.error('Error processing pending reminders:', error);
      throw error;
    }
  }

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
          student: {
            select: {
              firstName: true,
              lastName: true,
              studentNumber: true
            }
          }
        },
        orderBy: { scheduledAt: 'asc' }
      });

      // Generate iCal format
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
        ical += `STATUS:${appointment.status === 'COMPLETED' ? 'CONFIRMED' : appointment.status === 'CANCELLED' ? 'CANCELLED' : 'TENTATIVE'}\r\n`;
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