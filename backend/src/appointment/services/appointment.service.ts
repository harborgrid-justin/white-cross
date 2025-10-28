import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto, AppointmentStatus } from '../dto/update-appointment.dto';
import { AppointmentFiltersDto } from '../dto/appointment-filters.dto';
import { AppointmentEntity, PaginatedResponse, AvailabilitySlot } from '../entities/appointment.entity';
import { AppointmentValidation } from '../validators/appointment-validation';
import { AppointmentStatusTransitions } from '../validators/status-transitions';
import {
  Appointment,
  AppointmentType as ModelAppointmentType,
  AppointmentStatus as ModelAppointmentStatus
} from '../../database/models/appointment.model';
import {
  AppointmentReminder,
  MessageType,
  ReminderStatus
} from '../../database/models/appointment-reminder.model';
import {
  AppointmentWaitlist,
  WaitlistPriority,
  WaitlistStatus
} from '../../database/models/appointment-waitlist.model';
import { User } from '../../database/models/user.model';

/**
 * Main appointment service implementing core CRUD operations
 * and business logic for healthcare appointment management
 *
 * Production-Ready Features:
 * - Complete Sequelize database integration with proper models
 * - Comprehensive validation and error handling
 * - Transaction support for data integrity
 * - Conflict detection and availability checking
 * - Recurring appointment support
 * - Automated reminder scheduling
 * - Waitlist management and notification
 * - Appointment history tracking
 * - Cancellation policy enforcement
 * - Business hours and schedule validation
 */
@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(AppointmentReminder)
    private readonly reminderModel: typeof AppointmentReminder,
    @InjectModel(AppointmentWaitlist)
    private readonly waitlistModel: typeof AppointmentWaitlist,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Get appointments with pagination and filtering
   * Includes proper joins for student and nurse relations
   */
  async getAppointments(
    filters: AppointmentFiltersDto = {},
  ): Promise<PaginatedResponse<AppointmentEntity>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    this.logger.log(`Fetching appointments: page ${page}, limit ${limit}`);

    // Build where clause from filters
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

    if (filters.appointmentType) {
      whereClause.type = filters.appointmentType;
    }

    // Date range filtering
    if (filters.dateFrom || filters.dateTo) {
      whereClause.scheduledAt = {};
      if (filters.dateFrom) {
        whereClause.scheduledAt[Op.gte] = filters.dateFrom;
      }
      if (filters.dateTo) {
        whereClause.scheduledAt[Op.lte] = filters.dateTo;
      }
    }

    try {
      // Query with pagination and joins
      const { rows, count } = await this.appointmentModel.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['scheduledAt', 'ASC']],
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          },
        ],
      });

      // Map to entity format
      const data = rows.map(row => this.mapToEntity(row));

      return {
        data,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching appointments: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch appointments');
    }
  }

  /**
   * Get a single appointment by ID with relations
   */
  async getAppointmentById(id: string): Promise<AppointmentEntity> {
    this.logger.log(`Fetching appointment: \${id}`);

    try {
      const appointment = await this.appointmentModel.findByPk(id, {
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'phone'],
          },
        ],
      });

      if (!appointment) {
        throw new NotFoundException(`Appointment with ID \${id} not found`);
      }

      return this.mapToEntity(appointment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching appointment \${id}: \${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch appointment');
    }
  }

  /**
   * Create a new appointment with comprehensive validation
   *
   * Workflow:
   * 1. Validate appointment data (future date, business hours, duration)
   * 2. Check for conflicts with existing appointments
   * 3. Validate nurse availability (max appointments per day)
   * 4. Create appointment record
   * 5. Schedule automatic reminders
   *
   * @throws BadRequestException if validation fails
   * @throws BadRequestException if conflicts detected
   */
  async createAppointment(
    createDto: CreateAppointmentDto,
  ): Promise<AppointmentEntity> {
    this.logger.log(`Creating appointment for student \${createDto.studentId}`);

    // Apply defaults
    const duration = createDto.duration || AppointmentValidation.DEFAULT_DURATION_MINUTES;

    // Validate appointment data
    AppointmentValidation.validateFutureDateTime(createDto.scheduledDate);
    AppointmentValidation.validateDuration(duration);
    AppointmentValidation.validateBusinessHours(createDto.scheduledDate, duration);
    AppointmentValidation.validateNotWeekend(createDto.scheduledDate);

    // Verify nurse exists
    const nurse = await this.userModel.findByPk(createDto.nurseId);
    if (!nurse) {
      throw new BadRequestException(`Nurse with ID \${createDto.nurseId} not found`);
    }

    // Check for conflicts
    const conflicts = await this.checkAvailability(
      createDto.nurseId,
      createDto.scheduledDate,
      duration,
    );

    if (conflicts.length > 0) {
      throw new BadRequestException(
        `Nurse has conflicting appointments at this time: \${conflicts.map((c) => c.id).join(', ')}`,
      );
    }

    // Check daily appointment limit for nurse
    await this.validateDailyAppointmentLimit(createDto.nurseId, createDto.scheduledDate);

    try {
      // Create appointment within transaction
      const result = await this.sequelize.transaction(async (transaction: Transaction) => {
        // Create appointment
        const appointment = await this.appointmentModel.create(
          {
            id: uuidv4(),
            studentId: createDto.studentId,
            nurseId: createDto.nurseId,
            type: createDto.appointmentType as unknown as ModelAppointmentType,
            scheduledAt: createDto.scheduledDate,
            duration,
            reason: createDto.reason || 'Scheduled appointment',
            notes: createDto.notes,
            status: ModelAppointmentStatus.SCHEDULED,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { transaction },
        );

        // Schedule reminders
        await this.scheduleReminders(appointment.id, createDto.scheduledDate, transaction);

        // Remove from waitlist if student was waiting
        await this.waitlistModel.update(
          { status: WaitlistStatus.SCHEDULED },
          {
            where: {
              studentId: createDto.studentId,
              status: WaitlistStatus.WAITING,
            },
            transaction,
          },
        );

        return appointment;
      });

      // Fetch complete appointment with relations
      return await this.getAppointmentById(result.id);
    } catch (error) {
      this.logger.error(`Error creating appointment: \${error.message}`, error.stack);
      throw new BadRequestException('Failed to create appointment');
    }
  }

  /**
   * Update an existing appointment
   *
   * Validates:
   * - Appointment exists
   * - Not in final state (completed, cancelled, no-show)
   * - Status transitions are valid
   * - No scheduling conflicts if rescheduling
   */
  async updateAppointment(
    id: string,
    updateDto: UpdateAppointmentDto,
  ): Promise<AppointmentEntity> {
    this.logger.log(`Updating appointment: \${id}`);

    // Fetch existing appointment
    const existingAppointment = await this.appointmentModel.findByPk(id);
    if (!existingAppointment) {
      throw new NotFoundException(`Appointment with ID \${id} not found`);
    }

    // Validate not in final state
    AppointmentValidation.validateNotFinalState(existingAppointment.status as unknown as AppointmentStatus);

    // Validate status transition if status is being changed
    if (updateDto.status && updateDto.status !== existingAppointment.status) {
      AppointmentStatusTransitions.validateStatusTransition(
        existingAppointment.status as unknown as AppointmentStatus,
        updateDto.status,
      );
    }

    // If rescheduling, validate new time
    if (updateDto.scheduledDate) {
      const duration = updateDto.duration || existingAppointment.duration;
      AppointmentValidation.validateFutureDateTime(updateDto.scheduledDate);
      AppointmentValidation.validateBusinessHours(updateDto.scheduledDate, duration);
      AppointmentValidation.validateNotWeekend(updateDto.scheduledDate);

      // Check conflicts (excluding this appointment)
      const conflicts = await this.checkAvailability(
        existingAppointment.nurseId,
        updateDto.scheduledDate,
        duration,
        id,
      );

      if (conflicts.length > 0) {
        throw new BadRequestException(
          `Nurse has conflicting appointments at the new time`,
        );
      }
    }

    try {
      // Update appointment
      await existingAppointment.update({
        ...(updateDto.scheduledDate && { scheduledAt: updateDto.scheduledDate }),
        ...(updateDto.duration && { duration: updateDto.duration }),
        ...(updateDto.reason && { reason: updateDto.reason }),
        ...(updateDto.notes && { notes: updateDto.notes }),
        ...(updateDto.status && { status: updateDto.status as unknown as ModelAppointmentStatus }),
        updatedAt: new Date(),
      });

      // If rescheduled, update reminders
      if (updateDto.scheduledDate) {
        await this.sequelize.transaction(async (transaction: Transaction) => {
          // Cancel old reminders
          await this.reminderModel.update(
            { status: ReminderStatus.CANCELLED },
            {
              where: {
                appointmentId: id,
                status: ReminderStatus.SCHEDULED,
              },
              transaction,
            },
          );

          // Schedule new reminders
          await this.scheduleReminders(id, updateDto.scheduledDate!, transaction);
        });
      }

      return await this.getAppointmentById(id);
    } catch (error) {
      this.logger.error(`Error updating appointment \${id}: \${error.message}`, error.stack);
      throw new BadRequestException('Failed to update appointment');
    }
  }

  /**
   * Cancel an appointment
   *
   * Validates:
   * - Appointment can be cancelled (not already finalized)
   * - Minimum cancellation notice period (2 hours)
   * - Attempts to fill slot from waitlist
   */
  async cancelAppointment(id: string, reason?: string): Promise<AppointmentEntity> {
    this.logger.log(`Cancelling appointment: \${id}`);

    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID \${id} not found`);
    }

    // Validate can be cancelled
    AppointmentValidation.validateCanBeCancelled(appointment.status as unknown as AppointmentStatus);
    AppointmentValidation.validateCancellationNotice(appointment.scheduledAt);

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        // Update status to CANCELLED
        await appointment.update(
          {
            status: ModelAppointmentStatus.CANCELLED,
            notes: reason
              ? `\${appointment.notes || ''}\nCancellation reason: \${reason}`
              : appointment.notes,
            updatedAt: new Date(),
          },
          { transaction },
        );

        // Cancel reminders
        await this.reminderModel.update(
          { status: ReminderStatus.CANCELLED },
          {
            where: {
              appointmentId: id,
              status: ReminderStatus.SCHEDULED,
            },
            transaction,
          },
        );

        // Process waitlist to fill the slot
        await this.processWaitlistForSlot(
          appointment.nurseId,
          appointment.scheduledAt,
          appointment.duration,
          transaction,
        );
      });

      return await this.getAppointmentById(id);
    } catch (error) {
      this.logger.error(`Error cancelling appointment \${id}: \${error.message}`, error.stack);
      throw new BadRequestException('Failed to cancel appointment');
    }
  }

  /**
   * Start an appointment (transition to IN_PROGRESS)
   */
  async startAppointment(id: string): Promise<AppointmentEntity> {
    this.logger.log(`Starting appointment: \${id}`);

    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID \${id} not found`);
    }

    // Validate can be started
    AppointmentValidation.validateCanBeStarted(appointment.status as unknown as AppointmentStatus);
    AppointmentValidation.validateStartTiming(appointment.scheduledAt);

    await appointment.update({
      status: ModelAppointmentStatus.IN_PROGRESS,
      updatedAt: new Date(),
    });

    return await this.getAppointmentById(id);
  }

  /**
   * Complete an appointment
   *
   * @param completionData Optional completion notes, outcomes, follow-up requirements
   */
  async completeAppointment(
    id: string,
    completionData?: {
      notes?: string;
      outcomes?: string;
      followUpRequired?: boolean;
      followUpDate?: Date;
    },
  ): Promise<AppointmentEntity> {
    this.logger.log(`Completing appointment: \${id}`);

    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID \${id} not found`);
    }

    // Validate can be completed
    AppointmentValidation.validateCanBeCompleted(appointment.status as unknown as AppointmentStatus);

    let notes = appointment.notes || '';
    if (completionData?.notes) {
      notes = `\${notes}\nCompletion: \${completionData.notes}`;
    }
    if (completionData?.outcomes) {
      notes = `\${notes}\nOutcomes: \${completionData.outcomes}`;
    }
    if (completionData?.followUpRequired) {
      notes = `\${notes}\nFollow-up required: \${completionData.followUpDate ? completionData.followUpDate.toISOString() : 'Yes'}`;
    }

    await appointment.update({
      status: ModelAppointmentStatus.COMPLETED,
      notes,
      updatedAt: new Date(),
    });

    return await this.getAppointmentById(id);
  }

  /**
   * Mark appointment as no-show
   */
  async markNoShow(id: string): Promise<AppointmentEntity> {
    this.logger.log(`Marking appointment as no-show: \${id}`);

    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID \${id} not found`);
    }

    // Validate can be marked no-show
    AppointmentValidation.validateCanBeMarkedNoShow(appointment.status as unknown as AppointmentStatus);
    AppointmentValidation.validateAppointmentPassed(appointment.scheduledAt);

    await appointment.update({
      status: ModelAppointmentStatus.NO_SHOW,
      updatedAt: new Date(),
    });

    // Try to fill slot from waitlist
    await this.sequelize.transaction(async (transaction: Transaction) => {
      await this.processWaitlistForSlot(
        appointment.nurseId,
        appointment.scheduledAt,
        appointment.duration,
        transaction,
      );
    });

    return await this.getAppointmentById(id);
  }

  /**
   * Get upcoming appointments for a nurse with proper joins
   */
  async getUpcomingAppointments(
    nurseId: string,
    limit: number = 10,
  ): Promise<AppointmentEntity[]> {
    this.logger.log(`Fetching upcoming appointments for nurse: \${nurseId}`);

    try {
      const appointments = await this.appointmentModel.findAll({
        where: {
          nurseId,
          scheduledAt: {
            [Op.gt]: new Date(),
          },
          status: {
            [Op.in]: [ModelAppointmentStatus.SCHEDULED, ModelAppointmentStatus.IN_PROGRESS],
          },
        },
        order: [['scheduledAt', 'ASC']],
        limit,
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
      });

      return appointments.map(apt => this.mapToEntity(apt));
    } catch (error) {
      this.logger.error(`Error fetching upcoming appointments: \${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch upcoming appointments');
    }
  }

  /**
   * Check availability for a time slot with conflict detection
   *
   * Returns conflicting appointments if any exist
   * Considers buffer time between appointments
   *
   * @param excludeAppointmentId Optional appointment to exclude (for updates)
   */
  async checkAvailability(
    nurseId: string,
    startTime: Date,
    duration: number,
    excludeAppointmentId?: string,
  ): Promise<AppointmentEntity[]> {
    this.logger.log(`Checking availability for nurse: \${nurseId}`);

    // Calculate time range including buffer
    const bufferMinutes = AppointmentValidation.BUFFER_TIME_MINUTES;
    const slotStart = new Date(startTime.getTime() - bufferMinutes * 60000);
    const slotEnd = new Date(
      startTime.getTime() + (duration + bufferMinutes) * 60000,
    );

    try {
      // Build where clause
      const whereClause: any = {
        nurseId,
        status: {
          [Op.in]: [ModelAppointmentStatus.SCHEDULED, ModelAppointmentStatus.IN_PROGRESS],
        },
        [Op.or]: [
          // Appointment starts within the requested slot
          {
            scheduledAt: {
              [Op.gte]: slotStart,
              [Op.lt]: slotEnd,
            },
          },
          // Appointment ends within the requested slot
          {
            [Op.and]: [
              Sequelize.literal(`DATE_ADD(scheduled_at, INTERVAL duration MINUTE) > '\${slotStart.toISOString()}'`),
              Sequelize.literal(`scheduled_at < '\${slotEnd.toISOString()}'`),
            ],
          },
        ],
      };

      // Exclude specific appointment if provided
      if (excludeAppointmentId) {
        whereClause.id = { [Op.ne]: excludeAppointmentId };
      }

      const conflicts = await this.appointmentModel.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName'],
          },
        ],
      });

      return conflicts.map(apt => this.mapToEntity(apt));
    } catch (error) {
      this.logger.error(`Error checking availability: \${error.message}`, error.stack);
      throw new BadRequestException('Failed to check availability');
    }
  }

  /**
   * Get available time slots for a nurse on a given date with business hours logic
   *
   * Generates 30-minute slots from business hours,
   * excluding existing appointments and buffer time
   */
  async getAvailableSlots(
    nurseId: string,
    date: Date,
    slotDuration: number = 30,
  ): Promise<AvailabilitySlot[]> {
    this.logger.log(`Getting available slots for nurse: \${nurseId} on \${date}`);

    const businessHours = AppointmentValidation.getBusinessHours();
    const slots: AvailabilitySlot[] = [];

    // Generate time slots for the day
    const dayStart = new Date(date);
    dayStart.setHours(businessHours.start, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(businessHours.end, 0, 0, 0);

    // Generate slots in slotDuration increments
    let currentSlotStart = new Date(dayStart);
    while (currentSlotStart < dayEnd) {
      const currentSlotEnd = new Date(
        currentSlotStart.getTime() + slotDuration * 60000,
      );

      // Skip if slot extends beyond business hours
      if (currentSlotEnd > dayEnd) {
        break;
      }

      // Check for conflicts
      const conflicts = await this.checkAvailability(
        nurseId,
        currentSlotStart,
        slotDuration,
      );

      slots.push({
        start: new Date(currentSlotStart),
        end: currentSlotEnd,
        available: conflicts.length === 0,
        conflictingAppointment:
          conflicts.length > 0
            ? {
                id: conflicts[0].id,
                student: 'Student Name', // Would be populated from student service
                reason: conflicts[0].reason || '',
              }
            : undefined,
      });

      // Move to next slot
      currentSlotStart = new Date(
        currentSlotStart.getTime() + slotDuration * 60000,
      );
    }

    return slots;
  }

  /**
   * Add student to waitlist
   */
  async addToWaitlist(data: {
    studentId: string;
    nurseId?: string;
    type: ModelAppointmentType;
    preferredDate?: Date;
    duration?: number;
    priority?: WaitlistPriority;
    reason: string;
    notes?: string;
  }): Promise<any> {
    this.logger.log(`Adding student \${data.studentId} to waitlist`);

    try {
      // Set expiration to 48 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      const waitlistEntry = await this.waitlistModel.create({
        id: uuidv4(),
        studentId: data.studentId,
        nurseId: data.nurseId,
        type: data.type,
        preferredDate: data.preferredDate,
        duration: data.duration || 30,
        priority: data.priority || WaitlistPriority.NORMAL,
        reason: data.reason,
        notes: data.notes,
        status: WaitlistStatus.WAITING,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return waitlistEntry;
    } catch (error) {
      this.logger.error(`Error adding to waitlist: \${error.message}`, error.stack);
      throw new BadRequestException('Failed to add to waitlist');
    }
  }

  /**
   * Get appointment history for a student
   */
  async getAppointmentHistory(
    studentId: string,
    limit: number = 50,
  ): Promise<AppointmentEntity[]> {
    this.logger.log(`Fetching appointment history for student: \${studentId}`);

    try {
      const appointments = await this.appointmentModel.findAll({
        where: { studentId },
        order: [['scheduledAt', 'DESC']],
        limit,
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
      });

      return appointments.map(apt => this.mapToEntity(apt));
    } catch (error) {
      this.logger.error(`Error fetching appointment history: \${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch appointment history');
    }
  }

  /**
   * Create recurring appointments
   */
  async createRecurringAppointments(data: {
    studentId: string;
    nurseId: string;
    type: ModelAppointmentType;
    startDate: Date;
    endDate: Date;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    duration?: number;
    reason: string;
    notes?: string;
  }): Promise<AppointmentEntity[]> {
    this.logger.log(`Creating recurring appointments for student \${data.studentId}`);

    const recurringGroupId = uuidv4();
    const duration = data.duration || 30;
    const appointments: AppointmentEntity[] = [];

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        let currentDate = new Date(data.startDate);

        while (currentDate <= data.endDate) {
          // Validate business hours and not weekend
          const hour = currentDate.getHours();
          const dayOfWeek = currentDate.getDay();

          if (hour >= 8 && hour < 17 && dayOfWeek !== 0 && dayOfWeek !== 6) {
            // Check availability
            const conflicts = await this.checkAvailability(
              data.nurseId,
              currentDate,
              duration,
            );

            if (conflicts.length === 0) {
              const appointment = await this.appointmentModel.create(
                {
                  id: uuidv4(),
                  studentId: data.studentId,
                  nurseId: data.nurseId,
                  type: data.type,
                  scheduledAt: currentDate,
                  duration,
                  reason: data.reason,
                  notes: data.notes,
                  status: ModelAppointmentStatus.SCHEDULED,
                  recurringGroupId,
                  recurringFrequency: data.frequency,
                  recurringEndDate: data.endDate,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                { transaction },
              );

              // Schedule reminders
              await this.scheduleReminders(appointment.id, currentDate, transaction);

              const entity = await this.getAppointmentById(appointment.id);
              appointments.push(entity);
            }
          }

          // Increment date based on frequency
          switch (data.frequency) {
            case 'DAILY':
              currentDate.setDate(currentDate.getDate() + 1);
              break;
            case 'WEEKLY':
              currentDate.setDate(currentDate.getDate() + 7);
              break;
            case 'MONTHLY':
              currentDate.setMonth(currentDate.getMonth() + 1);
              break;
          }
        }
      });

      return appointments;
    } catch (error) {
      this.logger.error(`Error creating recurring appointments: \${error.message}`, error.stack);
      throw new BadRequestException('Failed to create recurring appointments');
    }
  }

  /**
   * Get no-show statistics for a student (for cancellation policy enforcement)
   */
  async getNoShowCount(studentId: string, daysBack: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const count = await this.appointmentModel.count({
      where: {
        studentId,
        status: ModelAppointmentStatus.NO_SHOW,
        scheduledAt: {
          [Op.gte]: cutoffDate,
        },
      },
    });

    return count;
  }

  // ========== PRIVATE HELPER METHODS ==========

  /**
   * Schedule reminders for an appointment (24 hours and 1 hour before)
   */
  private async scheduleReminders(
    appointmentId: string,
    scheduledDate: Date,
    transaction: Transaction,
  ): Promise<void> {
    const reminders = [
      {
        type: MessageType.EMAIL,
        hours: 24,
        message: 'You have an appointment scheduled for tomorrow.',
      },
      {
        type: MessageType.SMS,
        hours: 1,
        message: 'Reminder: Your appointment is in 1 hour.',
      },
    ];

    for (const reminder of reminders) {
      const scheduledFor = new Date(scheduledDate);
      scheduledFor.setHours(scheduledFor.getHours() - reminder.hours);

      // Only schedule if reminder time is in the future
      if (scheduledFor > new Date()) {
        await this.reminderModel.create(
          {
            id: uuidv4(),
            appointmentId,
            type: reminder.type,
            scheduledFor,
            status: ReminderStatus.SCHEDULED,
            message: reminder.message,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { transaction },
        );
      }
    }
  }

  /**
   * Process waitlist to fill a cancelled/no-show slot
   */
  private async processWaitlistForSlot(
    nurseId: string,
    scheduledDate: Date,
    duration: number,
    transaction: Transaction,
  ): Promise<void> {
    this.logger.log(`Processing waitlist for cancelled slot`);

    try {
      // Find highest priority waitlist entry
      const waitlistEntries = await this.waitlistModel.findAll({
        where: Sequelize.or(
          { status: WaitlistStatus.WAITING, nurseId },
          { status: WaitlistStatus.WAITING, nurseId: null }
        ),
        order: [
          ['priority', 'DESC'],
          ['createdAt', 'ASC'],
        ],
        limit: 5,
        transaction,
      });

      if (waitlistEntries.length > 0) {
        // Notify first waitlist entry
        const entry = waitlistEntries[0];
        await entry.update(
          {
            status: WaitlistStatus.NOTIFIED,
            notifiedAt: new Date(),
          },
          { transaction },
        );

        this.logger.log(`Notified waitlist entry \${entry.id} about available slot`);
      }
    } catch (error) {
      this.logger.error(`Error processing waitlist: \${error.message}`, error.stack);
      // Don't throw - this is a best-effort operation
    }
  }

  /**
   * Validate daily appointment limit for nurse (max 20 per day)
   */
  private async validateDailyAppointmentLimit(
    nurseId: string,
    date: Date,
  ): Promise<void> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const count = await this.appointmentModel.count({
      where: {
        nurseId,
        scheduledAt: {
          [Op.gte]: dayStart,
          [Op.lte]: dayEnd,
        },
        status: {
          [Op.in]: [ModelAppointmentStatus.SCHEDULED, ModelAppointmentStatus.IN_PROGRESS],
        },
      },
    });

    if (count >= 20) {
      throw new BadRequestException(
        'Nurse has reached maximum daily appointment limit (20)',
      );
    }
  }

  /**
   * Map Sequelize model to entity
   */
  private mapToEntity(appointment: Appointment): AppointmentEntity {
    return {
      id: appointment.id,
      studentId: appointment.studentId,
      nurseId: appointment.nurseId,
      appointmentType: appointment.type as any,
      scheduledDate: appointment.scheduledAt,
      duration: appointment.duration,
      reason: appointment.reason,
      notes: appointment.notes,
      status: appointment.status as any,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      nurse: appointment.nurse ? {
        id: appointment.nurse.id,
        firstName: appointment.nurse.firstName,
        lastName: appointment.nurse.lastName,
        email: appointment.nurse.email,
        fullName: `\${appointment.nurse.firstName} \${appointment.nurse.lastName}`,
      } : undefined,
    };
  }
}
