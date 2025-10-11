import { Op, Transaction } from 'sequelize';
import { logger } from '../utils/logger';
import {
  Appointment,
  AppointmentReminder,
  AppointmentWaitlist,
  NurseAvailability,
  Student,
  User,
  EmergencyContact,
  sequelize
} from '../database/models';
import {
  AppointmentType,
  AppointmentStatus,
  MessageType,
  ReminderStatus,
  WaitlistPriority,
  WaitlistStatus
} from '../database/types/enums';

export interface CreateAppointmentData {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: Date;
  duration?: number; // minutes, defaults to 30
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  type?: AppointmentType;
  scheduledAt?: Date;
  duration?: number;
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
}

export interface AppointmentFilters {
  nurseId?: string;
  studentId?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
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
  type: MessageType;
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
  type: AppointmentType;
  preferredDate?: Date;
  duration?: number;
  priority?: WaitlistPriority;
  reason: string;
  notes?: string;
}

export class AppointmentService {
  // =====================
  // CONFIGURATION CONSTANTS
  // =====================
  private static readonly MIN_DURATION_MINUTES = 15;
  private static readonly MAX_DURATION_MINUTES = 120;
  private static readonly DEFAULT_DURATION_MINUTES = 30;
  private static readonly BUFFER_TIME_MINUTES = 15;
  private static readonly MIN_CANCELLATION_HOURS = 2;
  private static readonly MAX_APPOINTMENTS_PER_DAY = 16;
  private static readonly BUSINESS_HOURS_START = 8; // 8 AM
  private static readonly BUSINESS_HOURS_END = 17; // 5 PM
  private static readonly WEEKEND_DAYS = [0, 6]; // Sunday and Saturday
  private static readonly MIN_REMINDER_HOURS_BEFORE = 0.5; // 30 minutes minimum
  private static readonly MAX_REMINDER_HOURS_BEFORE = 168; // 7 days maximum

  // =====================
  // VALIDATION METHODS
  // =====================

  /**
   * Validate appointment date/time is in the future
   */
  private static validateFutureDateTime(scheduledAt: Date): void {
    const now = new Date();
    if (scheduledAt <= now) {
      throw new Error('Appointment must be scheduled for a future date and time');
    }
  }

  /**
   * Validate appointment duration
   */
  private static validateDuration(duration: number): void {
    if (duration < this.MIN_DURATION_MINUTES) {
      throw new Error(`Appointment duration must be at least ${this.MIN_DURATION_MINUTES} minutes`);
    }
    if (duration > this.MAX_DURATION_MINUTES) {
      throw new Error(`Appointment duration cannot exceed ${this.MAX_DURATION_MINUTES} minutes`);
    }
    if (duration % 15 !== 0) {
      throw new Error('Appointment duration must be in 15-minute increments');
    }
  }

  /**
   * Validate appointment is within business hours
   */
  private static validateBusinessHours(scheduledAt: Date, duration: number): void {
    const hour = scheduledAt.getHours();
    const minutes = scheduledAt.getMinutes();
    const totalMinutes = hour * 60 + minutes;

    const startMinutes = this.BUSINESS_HOURS_START * 60;
    const endMinutes = this.BUSINESS_HOURS_END * 60;

    if (totalMinutes < startMinutes) {
      throw new Error(`Appointments must be scheduled after ${this.BUSINESS_HOURS_START}:00 AM`);
    }

    const appointmentEndMinutes = totalMinutes + duration;
    if (appointmentEndMinutes > endMinutes) {
      throw new Error(`Appointments must end by ${this.BUSINESS_HOURS_END}:00 PM`);
    }
  }

  /**
   * Validate appointment is not on weekend
   */
  private static validateNotWeekend(scheduledAt: Date): void {
    const dayOfWeek = scheduledAt.getDay();
    if (this.WEEKEND_DAYS.includes(dayOfWeek)) {
      throw new Error('Appointments cannot be scheduled on weekends');
    }
  }

  /**
   * Validate appointment type enum
   */
  private static validateAppointmentType(type: AppointmentType): void {
    const validTypes = Object.values(AppointmentType);
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid appointment type. Must be one of: ${validTypes.join(', ')}`);
    }
  }

  /**
   * Validate status transition is allowed
   */
  private static validateStatusTransition(
    currentStatus: AppointmentStatus,
    newStatus: AppointmentStatus
  ): void {
    const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      [AppointmentStatus.SCHEDULED]: [
        AppointmentStatus.IN_PROGRESS,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW
      ],
      [AppointmentStatus.IN_PROGRESS]: [
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED
      ],
      [AppointmentStatus.COMPLETED]: [], // Cannot transition from completed
      [AppointmentStatus.CANCELLED]: [], // Cannot transition from cancelled
      [AppointmentStatus.NO_SHOW]: []   // Cannot transition from no-show
    };

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}. ` +
        `Allowed transitions: ${allowed.join(', ') || 'none'}`
      );
    }
  }

  /**
   * Validate cancellation notice period
   */
  private static validateCancellationNotice(scheduledAt: Date): void {
    const now = new Date();
    const hoursUntilAppointment = (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < this.MIN_CANCELLATION_HOURS) {
      throw new Error(
        `Appointments must be cancelled at least ${this.MIN_CANCELLATION_HOURS} hours in advance`
      );
    }
  }

  /**
   * Validate waitlist priority
   */
  private static validateWaitlistPriority(priority: WaitlistPriority): void {
    const validPriorities = Object.values(WaitlistPriority);
    if (!validPriorities.includes(priority)) {
      throw new Error(`Invalid waitlist priority. Must be one of: ${validPriorities.join(', ')}`);
    }
  }

  /**
   * Validate reminder timing
   */
  private static validateReminderTiming(appointmentTime: Date, reminderTime: Date): void {
    if (reminderTime >= appointmentTime) {
      throw new Error('Reminder must be scheduled before the appointment time');
    }

    const hoursBeforeAppointment = (appointmentTime.getTime() - reminderTime.getTime()) / (1000 * 60 * 60);

    if (hoursBeforeAppointment < this.MIN_REMINDER_HOURS_BEFORE) {
      throw new Error(`Reminder must be at least ${this.MIN_REMINDER_HOURS_BEFORE} hours before appointment`);
    }

    if (hoursBeforeAppointment > this.MAX_REMINDER_HOURS_BEFORE) {
      throw new Error(`Reminder cannot be more than ${this.MAX_REMINDER_HOURS_BEFORE} hours before appointment`);
    }

    const now = new Date();
    if (reminderTime <= now) {
      throw new Error('Reminder time must be in the future');
    }
  }

  /**
   * Validate nurse hasn't exceeded max appointments per day
   */
  private static async validateMaxAppointmentsPerDay(
    nurseId: string,
    scheduledAt: Date,
    excludeAppointmentId?: string
  ): Promise<void> {
    const startOfDay = new Date(scheduledAt);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(scheduledAt);
    endOfDay.setHours(23, 59, 59, 999);

    const whereClause: any = {
      nurseId,
      scheduledAt: {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay
      },
      status: {
        [Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS]
      }
    };

    if (excludeAppointmentId) {
      whereClause.id = { [Op.ne]: excludeAppointmentId };
    }

    const count = await Appointment.count({ where: whereClause });

    if (count >= this.MAX_APPOINTMENTS_PER_DAY) {
      throw new Error(
        `Nurse has reached the maximum of ${this.MAX_APPOINTMENTS_PER_DAY} appointments per day`
      );
    }
  }

  /**
   * Comprehensive validation for appointment creation/update
   */
  private static async validateAppointmentData(
    data: CreateAppointmentData | UpdateAppointmentData,
    isUpdate: boolean = false,
    existingAppointment?: Appointment
  ): Promise<void> {
    // Validate appointment type
    if (data.type) {
      this.validateAppointmentType(data.type);
    }

    // Validate scheduled time
    if (data.scheduledAt) {
      this.validateFutureDateTime(data.scheduledAt);
      this.validateNotWeekend(data.scheduledAt);

      const duration = data.duration ||
        (existingAppointment?.duration) ||
        this.DEFAULT_DURATION_MINUTES;

      this.validateBusinessHours(data.scheduledAt, duration);

      if ('nurseId' in data) {
        await this.validateMaxAppointmentsPerDay(
          data.nurseId,
          data.scheduledAt,
          existingAppointment?.id
        );
      } else if (existingAppointment) {
        await this.validateMaxAppointmentsPerDay(
          existingAppointment.nurseId,
          data.scheduledAt,
          existingAppointment.id
        );
      }
    }

    // Validate duration
    if (data.duration !== undefined) {
      this.validateDuration(data.duration);
    }

    // Validate status transition if updating status
    if (isUpdate && 'status' in data && data.status && existingAppointment) {
      this.validateStatusTransition(existingAppointment.status, data.status);
    }

    // Validate reason is provided
    if ('reason' in data && (!data.reason || data.reason.trim().length === 0)) {
      throw new Error('Appointment reason is required');
    }
  }

  // =====================
  // CRUD OPERATIONS
  // =====================

  /**
   * Get appointments with pagination and filters
   */
  static async getAppointments(
    page: number = 1,
    limit: number = 20,
    filters: AppointmentFilters = {}
  ) {
    try {
      const offset = (page - 1) * limit;

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
          whereClause.scheduledAt[Op.gte] = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.scheduledAt[Op.lte] = filters.dateTo;
        }
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
        order: [['scheduledAt', 'ASC']],
        distinct: true
      });

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
      // Set default duration
      const duration = data.duration || this.DEFAULT_DURATION_MINUTES;

      // Comprehensive validation
      await this.validateAppointmentData({ ...data, duration }, false);

      // Verify student exists
      const student = await Student.findByPk(data.studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      // Verify nurse exists
      const nurse = await User.findByPk(data.nurseId);
      if (!nurse) {
        throw new Error('Nurse not found');
      }

      // Check for scheduling conflicts with buffer time
      const conflicts = await this.checkAvailability(
        data.nurseId,
        data.scheduledAt,
        duration
      );

      if (conflicts.length > 0) {
        const conflictDetails = conflicts.map(c =>
          `${c.student!.firstName} ${c.student!.lastName} at ${c.scheduledAt.toLocaleTimeString()}`
        ).join(', ');
        throw new Error(
          `Nurse is not available at the requested time. Conflicts with: ${conflictDetails}`
        );
      }

      const appointment = await Appointment.create({
        ...data,
        duration,
        status: AppointmentStatus.SCHEDULED
      });

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
      const existingAppointment = await Appointment.findByPk(id, {
        include: [
          { model: Student, as: 'student' },
          { model: User, as: 'nurse' }
        ]
      });

      if (!existingAppointment) {
        throw new Error('Appointment not found');
      }

      // Validate that completed/cancelled/no-show appointments cannot be modified
      if ([AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]
        .includes(existingAppointment.status)) {
        throw new Error(`Cannot update appointment with status ${existingAppointment.status}`);
      }

      // Comprehensive validation
      await this.validateAppointmentData(data, true, existingAppointment);

      // If rescheduling, check for conflicts
      if (data.scheduledAt && data.scheduledAt.getTime() !== existingAppointment.scheduledAt.getTime()) {
        const duration = data.duration || existingAppointment.duration;
        const conflicts = await this.checkAvailability(
          existingAppointment.nurseId,
          data.scheduledAt,
          duration,
          id // Exclude current appointment from conflict check
        );

        if (conflicts.length > 0) {
          const conflictDetails = conflicts.map(c =>
            `${c.student!.firstName} ${c.student!.lastName} at ${c.scheduledAt.toLocaleTimeString()}`
          ).join(', ');
          throw new Error(
            `Nurse is not available at the requested time. Conflicts with: ${conflictDetails}`
          );
        }
      }

      await existingAppointment.update(data);

      // Reload with associations
      await existingAppointment.reload({
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

      logger.info(`Appointment updated: ${existingAppointment.id} - ${existingAppointment.type} for ${existingAppointment.student!.firstName} ${existingAppointment.student!.lastName}`);
      return existingAppointment;
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
      const appointment = await Appointment.findByPk(id, {
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

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Validate appointment can be cancelled
      if (appointment.status !== AppointmentStatus.SCHEDULED &&
          appointment.status !== AppointmentStatus.IN_PROGRESS) {
        throw new Error(`Cannot cancel appointment with status ${appointment.status}`);
      }

      // Validate cancellation notice period
      this.validateCancellationNotice(appointment.scheduledAt);

      // Validate status transition
      this.validateStatusTransition(appointment.status, AppointmentStatus.CANCELLED);

      await appointment.update({
        status: AppointmentStatus.CANCELLED,
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
      });

      logger.info(`Appointment cancelled: ${appointment.type} for ${appointment.student!.firstName} ${appointment.student!.lastName}`);

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
      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Can only mark scheduled appointments as no-show
      if (appointment.status !== AppointmentStatus.SCHEDULED) {
        throw new Error(`Cannot mark appointment with status ${appointment.status} as no-show`);
      }

      // Validate appointment time has passed
      const now = new Date();
      if (appointment.scheduledAt > now) {
        throw new Error('Cannot mark future appointment as no-show');
      }

      // Validate status transition
      this.validateStatusTransition(appointment.status, AppointmentStatus.NO_SHOW);

      await appointment.update({ status: AppointmentStatus.NO_SHOW });

      logger.info(`Appointment marked as no-show: ${appointment.type} for ${appointment.student!.firstName} ${appointment.student!.lastName}`);
      return appointment;
    } catch (error) {
      logger.error('Error marking appointment as no-show:', error);
      throw error;
    }
  }

  /**
   * Start appointment (transition to IN_PROGRESS status)
   */
  static async startAppointment(id: string) {
    try {
      const appointment = await Appointment.findByPk(id, {
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

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Validate current status
      if (appointment.status !== AppointmentStatus.SCHEDULED) {
        throw new Error(`Cannot start appointment with status ${appointment.status}`);
      }

      // Validate status transition
      this.validateStatusTransition(appointment.status, AppointmentStatus.IN_PROGRESS);

      // Optionally validate that appointment time is within reasonable range (e.g., not more than 1 hour early)
      const now = new Date();
      const oneHourEarly = new Date(appointment.scheduledAt.getTime() - 60 * 60 * 1000);
      if (now < oneHourEarly) {
        throw new Error('Cannot start appointment more than 1 hour before scheduled time');
      }

      await appointment.update({ status: AppointmentStatus.IN_PROGRESS });

      logger.info(`Appointment started: ${appointment.type} for ${appointment.student!.firstName} ${appointment.student!.lastName}`);
      return appointment;
    } catch (error) {
      logger.error('Error starting appointment:', error);
      throw error;
    }
  }

  /**
   * Complete appointment (transition to COMPLETED status)
   */
  static async completeAppointment(id: string, completionData?: {
    notes?: string;
    outcomes?: string;
    followUpRequired?: boolean;
    followUpDate?: Date;
  }) {
    try {
      const appointment = await Appointment.findByPk(id, {
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

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Validate current status
      if (appointment.status !== AppointmentStatus.IN_PROGRESS) {
        throw new Error(`Cannot complete appointment with status ${appointment.status}. Appointment must be IN_PROGRESS`);
      }

      // Validate status transition
      this.validateStatusTransition(appointment.status, AppointmentStatus.COMPLETED);

      // Prepare update data
      const updateData: any = {
        status: AppointmentStatus.COMPLETED
      };

      if (completionData?.notes) {
        updateData.notes = completionData.notes;
      }

      await appointment.update(updateData);

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

      logger.info(`Appointment completed: ${appointment.type} for ${appointment.student!.firstName} ${appointment.student!.lastName}`);
      return appointment;
    } catch (error) {
      logger.error('Error completing appointment:', error);
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
  ): Promise<Appointment[]> {
    try {
      const endTime = new Date(startTime.getTime() + duration * 60000);
      const bufferStartTime = new Date(startTime.getTime() - 30 * 60000); // 30 min buffer

      const whereClause: any = {
        nurseId,
        status: {
          [Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS]
        },
        scheduledAt: {
          [Op.and]: [
            { [Op.lt]: endTime },
            { [Op.gte]: bufferStartTime }
          ]
        }
      };

      if (excludeAppointmentId) {
        whereClause.id = { [Op.ne]: excludeAppointmentId };
      }

      const conflicts = await Appointment.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
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
      const appointments = await Appointment.findAll({
        where: {
          nurseId,
          scheduledAt: {
            [Op.gte]: startDate,
            [Op.lt]: endDate
          },
          status: {
            [Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS]
          }
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ],
        order: [['scheduledAt', 'ASC']]
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
            student: `${conflict.student!.firstName} ${conflict.student!.lastName}`,
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
      const appointments = await Appointment.findAll({
        where: {
          nurseId,
          scheduledAt: {
            [Op.gte]: new Date()
          },
          status: {
            [Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS]
          }
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
          whereClause.scheduledAt[Op.gte] = dateFrom;
        }
        if (dateTo) {
          whereClause.scheduledAt[Op.lte] = dateTo;
        }
      }

      const [statusStats, typeStats, totalAppointments] = await Promise.all([
        Appointment.findAll({
          where: whereClause,
          attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('status')), 'count']
          ],
          group: ['status'],
          raw: true
        }),
        Appointment.findAll({
          where: whereClause,
          attributes: [
            'type',
            [sequelize.fn('COUNT', sequelize.col('type')), 'count']
          ],
          group: ['type'],
          raw: true
        }),
        Appointment.count({ where: whereClause })
      ]);

      const statusMap = (statusStats as any[]).reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.status] = parseInt(curr.count, 10);
        return acc;
      }, {});

      const typeMap = (typeStats as any[]).reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.type] = parseInt(curr.count, 10);
        return acc;
      }, {});

      const noShowRate = statusMap[AppointmentStatus.NO_SHOW] || 0;
      const completedCount = statusMap[AppointmentStatus.COMPLETED] || 0;

      return {
        total: totalAppointments,
        byStatus: statusMap,
        byType: typeMap,
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
      const appointment = await Appointment.findByPk(appointmentId, {
        include: [
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: EmergencyContact,
                as: 'emergencyContacts',
                where: { isActive: true },
                required: false
              }
            ]
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      if (!appointment || !(appointment.student as any).emergencyContacts || (appointment.student as any).emergencyContacts.length === 0) {
        return [];
      }

      // Schedule reminders at different intervals with multiple channels
      const reminderIntervals = [
        { hours: 24, type: MessageType.EMAIL, label: '24-hour' },
        { hours: 2, type: MessageType.SMS, label: '2-hour' },
        { hours: 0.5, type: MessageType.SMS, label: '30-minute' }
      ];

      const reminders = [];

      for (const interval of reminderIntervals) {
        const reminderTime = new Date(appointment.scheduledAt.getTime() - interval.hours * 60 * 60 * 1000);

        // Only schedule if reminder time is in the future
        if (reminderTime > new Date()) {
          const message = `Appointment reminder: ${appointment.student!.firstName} ${appointment.student!.lastName} has a ${appointment.type.toLowerCase().replace(/_/g, ' ')} appointment with ${appointment.nurse!.firstName} ${appointment.nurse!.lastName} on ${appointment.scheduledAt.toLocaleString()}`;

          const reminder = await AppointmentReminder.create({
            appointmentId,
            type: interval.type,
            scheduledFor: reminderTime,
            message,
            status: ReminderStatus.SCHEDULED
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
      const appointments: Appointment[] = [];
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
      const availability = await NurseAvailability.create({
        nurseId: data.nurseId,
        dayOfWeek: data.dayOfWeek ?? 0,
        startTime: data.startTime,
        endTime: data.endTime,
        isRecurring: data.isRecurring ?? true,
        specificDate: data.specificDate,
        isAvailable: data.isAvailable ?? true,
        reason: data.reason
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
      const whereClause: any = { nurseId };

      if (date) {
        const dayOfWeek = date.getDay();
        whereClause[Op.or] = [
          { isRecurring: true, dayOfWeek },
          { isRecurring: false, specificDate: date }
        ];
      }

      const availability = await NurseAvailability.findAll({
        where: whereClause,
        order: [
          ['dayOfWeek', 'ASC'],
          ['startTime', 'ASC']
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
      const availability = await NurseAvailability.findByPk(id);

      if (!availability) {
        throw new Error('Nurse availability schedule not found');
      }

      await availability.update(data);

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
      const availability = await NurseAvailability.findByPk(id);

      if (!availability) {
        throw new Error('Nurse availability schedule not found');
      }

      await availability.destroy();

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
      const student = await Student.findByPk(data.studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      // Validate appointment type
      this.validateAppointmentType(data.type);

      // Validate duration if provided
      const duration = data.duration || this.DEFAULT_DURATION_MINUTES;
      this.validateDuration(duration);

      // Validate priority if provided
      const priority = data.priority || WaitlistPriority.NORMAL;
      this.validateWaitlistPriority(priority);

      // Validate preferred date if provided (must be future)
      if (data.preferredDate) {
        this.validateFutureDateTime(data.preferredDate);
        this.validateNotWeekend(data.preferredDate);
      }

      // Validate reason is provided
      if (!data.reason || data.reason.trim().length === 0) {
        throw new Error('Waitlist reason is required');
      }

      // Set expiration to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const waitlistEntry = await AppointmentWaitlist.create({
        studentId: data.studentId,
        nurseId: data.nurseId,
        type: data.type,
        preferredDate: data.preferredDate,
        duration,
        priority,
        reason: data.reason,
        notes: data.notes,
        status: WaitlistStatus.WAITING,
        expiresAt
      });

      // Reload with associations
      await waitlistEntry.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
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
      const whereClause: any = {};

      if (filters?.nurseId) {
        whereClause.nurseId = filters.nurseId;
      }

      if (filters?.status) {
        whereClause.status = filters.status;
      }

      if (filters?.priority) {
        whereClause.priority = filters.priority;
      }

      const waitlist = await AppointmentWaitlist.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName'],
            required: false
          }
        ],
        order: [
          ['priority', 'DESC'],
          ['createdAt', 'ASC']
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
      const entry = await AppointmentWaitlist.findByPk(id);

      if (!entry) {
        throw new Error('Waitlist entry not found');
      }

      await entry.update({
        status: WaitlistStatus.CANCELLED,
        notes: reason ? `Cancelled: ${reason}` : entry.notes
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
  static async fillSlotFromWaitlist(cancelledAppointment: { scheduledAt: Date; duration: number; nurseId: string; type: AppointmentType }) {
    try {
      // Find matching waitlist entries
      const waitlistEntries = await AppointmentWaitlist.findAll({
        where: {
          status: WaitlistStatus.WAITING,
          type: cancelledAppointment.type,
          [Op.or]: [
            { nurseId: cancelledAppointment.nurseId },
            { nurseId: null }
          ]
        },
        include: [
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: EmergencyContact,
                as: 'emergencyContacts',
                where: { isActive: true },
                required: false,
                limit: 1
              }
            ]
          }
        ],
        order: [
          ['priority', 'DESC'],
          ['createdAt', 'ASC']
        ],
        limit: 5
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
          await entry.update({
            status: WaitlistStatus.SCHEDULED,
            notifiedAt: new Date()
          });

          logger.info(`Auto-filled slot for ${entry.student!.firstName} ${entry.student!.lastName} from waitlist`);

          // Notify the contact
          const contacts = (entry.student as any).emergencyContacts;
          if (contacts && contacts.length > 0) {
            const contact = contacts[0];
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
      const reminder = await AppointmentReminder.findByPk(reminderId, {
        include: [
          {
            model: Appointment,
            as: 'appointment',
            include: [
              {
                model: Student,
                as: 'student',
                include: [
                  {
                    model: EmergencyContact,
                    as: 'emergencyContacts',
                    where: { isActive: true },
                    required: false
                  }
                ]
              },
              {
                model: User,
                as: 'nurse',
                attributes: ['firstName', 'lastName']
              }
            ]
          }
        ]
      });

      if (!reminder || !reminder.appointment) {
        throw new Error('Reminder or appointment not found');
      }

      const { appointment } = reminder;
      const contacts = (appointment.student as any).emergencyContacts;
      const contact = contacts && contacts.length > 0 ? contacts[0] : null;

      if (!contact) {
        logger.warn(`No emergency contact found for student ${appointment.student!.firstName} ${appointment.student!.lastName}`);
        await reminder.update({
          status: ReminderStatus.FAILED,
          failureReason: 'No emergency contact available'
        });
        return;
      }

      // In a real implementation, integrate with SMS/Email/Voice services
      const reminderMessage = reminder.message ||
        `Reminder: ${appointment.student!.firstName} has a ${appointment.type.toLowerCase().replace(/_/g, ' ')} appointment with ${appointment.nurse!.firstName} ${appointment.nurse!.lastName} on ${appointment.scheduledAt.toLocaleString()}`;

      logger.info(`Sending ${reminder.type} reminder to ${contact.firstName} ${contact.lastName}`);

      // Simulate sending through different channels
      switch (reminder.type) {
        case MessageType.SMS:
          logger.info(`SMS to ${contact.phoneNumber}: ${reminderMessage}`);
          break;
        case MessageType.EMAIL:
          logger.info(`Email to ${contact.email}: ${reminderMessage}`);
          break;
        case MessageType.VOICE:
          logger.info(`Voice call to ${contact.phoneNumber}: ${reminderMessage}`);
          break;
      }

      await reminder.update({
        status: ReminderStatus.SENT,
        sentAt: new Date()
      });

      logger.info(`Reminder ${reminderId} sent successfully`);
    } catch (error) {
      logger.error('Error sending reminder:', error);

      // Update reminder status to failed
      try {
        const reminder = await AppointmentReminder.findByPk(reminderId);
        if (reminder) {
          await reminder.update({
            status: ReminderStatus.FAILED,
            failureReason: (error as Error).message
          });
        }
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
      const pendingReminders = await AppointmentReminder.findAll({
        where: {
          status: ReminderStatus.SCHEDULED,
          scheduledFor: {
            [Op.lte]: now
          }
        },
        limit: 50 // Process in batches
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
  static async generateCalendarExport(nurseId: string, dateFrom?: Date, dateTo?: Date): Promise<string> {
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
        ical += `SUMMARY:${appointment.type.replace(/_/g, ' ')} - ${appointment.student!.firstName} ${appointment.student!.lastName}\r\n`;
        ical += `DESCRIPTION:${appointment.reason}\\n\\nStudent: ${appointment.student!.firstName} ${appointment.student!.lastName} (${appointment.student!.studentNumber})\\nStatus: ${appointment.status}\r\n`;
        ical += `STATUS:${appointment.status === AppointmentStatus.COMPLETED ? 'CONFIRMED' : appointment.status === AppointmentStatus.CANCELLED ? 'CANCELLED' : 'TENTATIVE'}\r\n`;
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
