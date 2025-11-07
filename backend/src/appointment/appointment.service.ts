/**
 * @fileoverview Appointment Service
 * @module appointment/appointment.service
 * @description Business logic for appointment management with comprehensive healthcare workflow support
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Op, Transaction, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { AppConfigService } from '../config/app-config.service';
import {
  AppointmentCreatedEvent,
  AppointmentUpdatedEvent,
  AppointmentCancelledEvent,
  AppointmentStartedEvent,
  AppointmentCompletedEvent,
  AppointmentNoShowEvent,
} from './events/appointment.events';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  UpdateAppointmentDto,
  AppointmentStatus,
} from './dto/update-appointment.dto';
import { AppointmentFiltersDto } from './dto/appointment-filters.dto';
import {
  CreateWaitlistEntryDto,
  WaitlistFiltersDto,
  WaitlistPriority as DtoWaitlistPriority,
  WaitlistStatus as DtoWaitlistStatus,
} from './dto/waitlist.dto';
import {
  CreateReminderDto,
  ReminderProcessingResultDto,
  MessageType as DtoMessageType,
  ReminderStatus as DtoReminderStatus,
} from './dto/reminder.dto';
import {
  StatisticsFiltersDto,
  SearchAppointmentsDto,
  BulkCancelDto,
  DateRangeDto,
} from './dto/statistics.dto';
import {
  CreateRecurringAppointmentDto,
  RecurrenceFrequency,
} from './dto/recurring.dto';
import {
  AppointmentEntity,
  PaginatedResponse,
  AvailabilitySlot,
} from './entities/appointment.entity';
import { AppointmentValidation } from './validators/appointment-validation';
import { AppointmentStatusTransitions } from './validators/status-transitions';
import {
  Appointment,
  AppointmentType as ModelAppointmentType,
  AppointmentStatus as ModelAppointmentStatus,
} from '../database/models/appointment.model';
import {
  AppointmentReminder,
  MessageType,
  ReminderStatus,
} from '../database/models/appointment-reminder.model';
import {
  AppointmentWaitlist,
  WaitlistPriority,
  WaitlistStatus,
} from '../database/models/appointment-waitlist.model';
import { User } from '../database/models/user.model';

/**
 * Appointment Service
 *
 * Handles all business logic for appointment management:
 * - CRUD operations with validation
 * - Scheduling with conflict detection and availability checking
 * - Status lifecycle management (scheduled → in-progress → completed)
 * - Recurring appointment support
 * - Waitlist management integration
 * - Healthcare workflow optimization
 * - Business hours and schedule validation
 * - Reminder scheduling and notification
 * - Comprehensive error handling and logging
 */
@Injectable()
export class AppointmentService implements OnModuleDestroy {
  private readonly logger = new Logger(AppointmentService.name);
  private cleanupInterval?: NodeJS.Timeout;

  constructor(
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(AppointmentReminder)
    private readonly reminderModel: typeof AppointmentReminder,
    @InjectModel(AppointmentWaitlist)
    private readonly waitlistModel: typeof AppointmentWaitlist,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly eventEmitter: EventEmitter2,
    private readonly config: AppConfigService,
  ) {
    // Start periodic cleanup of expired waitlist entries
    // Only run in production to avoid interfering with dev/test
    if (this.config.isProduction) {
      this.cleanupInterval = setInterval(
        () => this.cleanupExpiredWaitlistEntries(),
        24 * 60 * 60 * 1000, // Daily cleanup
      );
      this.logger.log('Appointment service initialized with daily cleanup interval');
    }
  }

  /**
   * Cleanup resources on module destroy
   * Implements graceful shutdown for intervals and pending operations
   */
  async onModuleDestroy() {
    this.logger.log('AppointmentService shutting down - cleaning up resources');

    // Clear intervals
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.logger.log('Cleanup interval cleared');
    }

    // Flush any pending reminder processing
    try {
      await this.processPendingReminders();
      this.logger.log('Pending reminders processed before shutdown');
    } catch (error) {
      this.logger.warn(`Error processing pending reminders during shutdown: ${error.message}`);
    }

    this.logger.log('AppointmentService destroyed, resources cleaned up');
  }

  /**
   * Clean up expired waitlist entries
   * Runs periodically to remove stale waitlist entries
   */
  private async cleanupExpiredWaitlistEntries(): Promise<void> {
    try {
      const now = new Date();
      const result = await this.waitlistModel.update(
        { status: WaitlistStatus.EXPIRED },
        {
          where: {
            expiresAt: { [Op.lt]: now },
            status: WaitlistStatus.WAITING,
          },
        },
      );

      if (result[0] > 0) {
        this.logger.log(`Cleaned up ${result[0]} expired waitlist entries`);
      }
    } catch (error) {
      this.logger.error(`Error cleaning up expired waitlist entries: ${error.message}`, error.stack);
    }
  }

  // ==================== CRUD Operations ====================

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
      // Query with pagination and joins using appointmentModel
      // OPTIMIZATION: Includes nurse relation - student relation would be added here if available
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
          // Note: Student association not included as Appointment model doesn't have
          // a BelongsTo relationship to Student - studentId is just a foreign key
          // Consider adding this relationship in the Appointment model if needed
        ],
        // Prevent duplicate counts when using includes
        distinct: true,
      });

      // Map to entity format
      const data = rows.map((row) => this.mapToEntity(row));

      const totalPages = Math.ceil(count / limit);
      return {
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error fetching appointments: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch appointments');
    }
  }

  /**
   * Get a single appointment by ID with relations
   */
  async getAppointmentById(id: string): Promise<AppointmentEntity> {
    this.logger.log(`Fetching appointment: ${id}`);

    try {
      const appointment = await this.appointmentModel.findByPk(id, {
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: [
              'id',
              'firstName',
              'lastName',
              'email',
              'role',
              'phone',
            ],
          },
        ],
      });

      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }

      return this.mapToEntity(appointment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error fetching appointment ${id}: ${error.message}`,
        error.stack,
      );
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
    this.logger.log(`Creating appointment for student ${createDto.studentId}`);

    // Apply defaults
    const duration =
      createDto.duration || AppointmentValidation.DEFAULT_DURATION_MINUTES;

    // Validate appointment data
    AppointmentValidation.validateFutureDateTime(createDto.scheduledDate);
    AppointmentValidation.validateDuration(duration);
    AppointmentValidation.validateBusinessHours(
      createDto.scheduledDate,
      duration,
    );
    AppointmentValidation.validateNotWeekend(createDto.scheduledDate);

    // Verify nurse exists
    const nurse = await this.userModel.findByPk(createDto.nurseId);
    if (!nurse) {
      throw new BadRequestException(
        `Nurse with ID ${createDto.nurseId} not found`,
      );
    }

    // Check for conflicts
    const conflicts = await this.checkAvailability(
      createDto.nurseId,
      createDto.scheduledDate,
      duration,
    );

    if (conflicts.length > 0) {
      throw new BadRequestException(
        `Nurse has conflicting appointments at this time: ${conflicts.map((c) => c.id).join(', ')}`,
      );
    }

    // Check daily appointment limit for nurse
    await this.validateDailyAppointmentLimit(
      createDto.nurseId,
      createDto.scheduledDate,
    );

    try {
      // Create appointment within transaction
      // TRANSACTION ISOLATION: READ_COMMITTED
      // - Prevents dirty reads while allowing concurrent writes
      // - Appropriate for appointment creation (no "exactly N" constraints)
      // - Good balance between consistency and performance
      const result = await this.sequelize.transaction(
        {
          isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        },
        async (transaction: Transaction) => {
          // Create appointment
          const appointment = await this.appointmentModel.create(
            {
              studentId: createDto.studentId,
              nurseId: createDto.nurseId,
              type: createDto.appointmentType as unknown as ModelAppointmentType,
              scheduledAt: createDto.scheduledDate,
              duration,
              reason: createDto.reason || 'Scheduled appointment',
              notes: createDto.notes,
              status: ModelAppointmentStatus.SCHEDULED,
            },
            { transaction },
          );

          // Schedule reminders
          await this.scheduleReminders(
            appointment.id,
            createDto.scheduledDate,
            transaction,
          );

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
        },
      );

      // Fetch complete appointment with relations
      const appointment = await this.getAppointmentById(result.id);

      // Emit domain event for decoupled notification handling
      this.eventEmitter.emit(
        'appointment.created',
        new AppointmentCreatedEvent(
          {
            id: appointment.id,
            studentId: appointment.studentId,
            nurseId: appointment.nurseId,
            type: appointment.type as any,
            scheduledAt: appointment.scheduledAt,
            duration: appointment.duration,
            status: appointment.status as any,
            reason: appointment.reason,
          },
          {
            userId: createDto.studentId, // In real implementation, get from request context
            userRole: 'SYSTEM',
            timestamp: new Date(),
          },
        ),
      );

      return appointment;
    } catch (error) {
      this.logger.error(
        `Error creating appointment: ${error.message}`,
        error.stack,
      );
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
    this.logger.log(`Updating appointment: ${id}`);

    // Fetch existing appointment
    const existingAppointment = await this.appointmentModel.findByPk(id);
    if (!existingAppointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Validate not in final state
    AppointmentValidation.validateNotFinalState(
      existingAppointment.status as unknown as AppointmentStatus,
    );

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
      AppointmentValidation.validateBusinessHours(
        updateDto.scheduledDate,
        duration,
      );
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
        ...(updateDto.scheduledDate && {
          scheduledAt: updateDto.scheduledDate,
        }),
        ...(updateDto.duration && { duration: updateDto.duration }),
        ...(updateDto.reason && { reason: updateDto.reason }),
        ...(updateDto.notes && { notes: updateDto.notes }),
        ...(updateDto.status && {
          status: updateDto.status as unknown as ModelAppointmentStatus,
        }),
      });

      // If rescheduled, update reminders
      if (updateDto.scheduledDate) {
        // TRANSACTION ISOLATION: READ_COMMITTED
        // - Reminder updates don't require stricter isolation
        // - Prevents dirty reads while maintaining good performance
        await this.sequelize.transaction(
          {
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
          },
          async (transaction: Transaction) => {
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
          await this.scheduleReminders(
            id,
            updateDto.scheduledDate!,
            transaction,
          );
        });
      }

      const appointment = await this.getAppointmentById(id);

      // Emit domain event for decoupled notification handling
      this.eventEmitter.emit(
        'appointment.updated',
        new AppointmentUpdatedEvent(
          {
            id: appointment.id,
            studentId: appointment.studentId,
            nurseId: appointment.nurseId,
            type: appointment.type as any,
            scheduledAt: appointment.scheduledAt,
            duration: appointment.duration,
            status: appointment.status as any,
            reason: appointment.reason,
          },
          updateDto as any,
          {
            userId: existingAppointment.nurseId, // In real implementation, get from request context
            userRole: 'NURSE',
            timestamp: new Date(),
          },
        ),
      );

      return appointment;
    } catch (error) {
      this.logger.error(
        `Error updating appointment ${id}: ${error.message}`,
        error.stack,
      );
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
  async cancelAppointment(
    id: string,
    reason?: string,
  ): Promise<AppointmentEntity> {
    this.logger.log(`Cancelling appointment: ${id}`);

    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Validate can be cancelled
    AppointmentValidation.validateCanBeCancelled(
      appointment.status as unknown as AppointmentStatus,
    );
    AppointmentValidation.validateCancellationNotice(appointment.scheduledAt);

    try {
      // TRANSACTION ISOLATION: READ_COMMITTED
      // - Cancellation is a status update, not a resource allocation
      // - READ_COMMITTED is sufficient for consistency
      await this.sequelize.transaction(
        {
          isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        },
        async (transaction: Transaction) => {
          // Update status to CANCELLED
        await appointment.update(
          {
            status: ModelAppointmentStatus.CANCELLED,
            notes: reason
              ? `${appointment.notes || ''}\nCancellation reason: ${reason}`
              : appointment.notes,
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

      const cancelledAppointment = await this.getAppointmentById(id);

      // Emit domain event
      this.eventEmitter.emit(
        'appointment.cancelled',
        new AppointmentCancelledEvent(
          cancelledAppointment.id,
          {
            id: cancelledAppointment.id,
            studentId: cancelledAppointment.studentId,
            nurseId: cancelledAppointment.nurseId,
            type: cancelledAppointment.type as any,
            scheduledAt: cancelledAppointment.scheduledAt,
            duration: cancelledAppointment.duration,
            status: cancelledAppointment.status as any,
          },
          reason || 'Cancelled',
          {
            userId: cancelledAppointment.nurseId,
            userRole: 'NURSE',
            timestamp: new Date(),
          },
        ),
      );

      return cancelledAppointment;
    } catch (error) {
      this.logger.error(
        `Error cancelling appointment ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to cancel appointment');
    }
  }

  /**
   * Start an appointment (transition to IN_PROGRESS)
   */
  async startAppointment(id: string): Promise<AppointmentEntity> {
    this.logger.log(`Starting appointment: ${id}`);

    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Validate can be started
    AppointmentValidation.validateCanBeStarted(
      appointment.status as unknown as AppointmentStatus,
    );
    AppointmentValidation.validateStartTiming(appointment.scheduledAt);

    await appointment.update({
      status: ModelAppointmentStatus.IN_PROGRESS,
    });

    const updatedAppointment = await this.getAppointmentById(id);

    // Emit domain event
    this.eventEmitter.emit(
      'appointment.started',
      new AppointmentStartedEvent(
        {
          id: updatedAppointment.id,
          studentId: updatedAppointment.studentId,
          nurseId: updatedAppointment.nurseId,
          type: updatedAppointment.type as any,
          scheduledAt: updatedAppointment.scheduledAt,
          duration: updatedAppointment.duration,
          status: updatedAppointment.status as any,
        },
        {
          userId: updatedAppointment.nurseId,
          userRole: 'NURSE',
          timestamp: new Date(),
        },
      ),
    );

    return updatedAppointment;
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
    this.logger.log(`Completing appointment: ${id}`);

    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Validate can be completed
    AppointmentValidation.validateCanBeCompleted(
      appointment.status as unknown as AppointmentStatus,
    );

    let notes = appointment.notes || '';
    if (completionData?.notes) {
      notes = `${notes}\nCompletion: ${completionData.notes}`;
    }
    if (completionData?.outcomes) {
      notes = `${notes}\nOutcomes: ${completionData.outcomes}`;
    }
    if (completionData?.followUpRequired) {
      notes = `${notes}\nFollow-up required: ${completionData.followUpDate ? completionData.followUpDate.toISOString() : 'Yes'}`;
    }

    await appointment.update({
      status: ModelAppointmentStatus.COMPLETED,
      notes,
    });

    const completedAppointment = await this.getAppointmentById(id);

    // Emit domain event
    this.eventEmitter.emit(
      'appointment.completed',
      new AppointmentCompletedEvent(
        {
          id: completedAppointment.id,
          studentId: completedAppointment.studentId,
          nurseId: completedAppointment.nurseId,
          type: completedAppointment.type as any,
          scheduledAt: completedAppointment.scheduledAt,
          duration: completedAppointment.duration,
          status: completedAppointment.status as any,
        },
        completionData?.notes,
        completionData?.outcomes,
        completionData?.followUpRequired,
        {
          userId: completedAppointment.nurseId,
          userRole: 'NURSE',
          timestamp: new Date(),
        },
      ),
    );

    return completedAppointment;
  }

  /**
   * Mark appointment as no-show
   */
  async markNoShow(id: string): Promise<AppointmentEntity> {
    this.logger.log(`Marking appointment as no-show: ${id}`);

    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Validate can be marked no-show
    AppointmentValidation.validateCanBeMarkedNoShow(
      appointment.status as unknown as AppointmentStatus,
    );
    AppointmentValidation.validateAppointmentPassed(appointment.scheduledAt);

    await appointment.update({
      status: ModelAppointmentStatus.NO_SHOW,
    });

    const noShowAppointment = await this.getAppointmentById(id);

    // Emit domain event
    this.eventEmitter.emit(
      'appointment.no-show',
      new AppointmentNoShowEvent(
        {
          id: noShowAppointment.id,
          studentId: noShowAppointment.studentId,
          nurseId: noShowAppointment.nurseId,
          type: noShowAppointment.type as any,
          scheduledAt: noShowAppointment.scheduledAt,
          duration: noShowAppointment.duration,
          status: noShowAppointment.status as any,
        },
        {
          userId: noShowAppointment.nurseId,
          userRole: 'NURSE',
          timestamp: new Date(),
        },
      ),
    );

    // Try to fill slot from waitlist
    // TRANSACTION ISOLATION: SERIALIZABLE
    // - Waitlist processing requires strict consistency
    // - Prevents race conditions when multiple appointments complete simultaneously
    // - Ensures "first in queue" constraint is honored
    // - Critical for fair resource allocation
    await this.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      },
      async (transaction: Transaction) => {
      await this.processWaitlistForSlot(
        appointment.nurseId,
        appointment.scheduledAt,
        appointment.duration,
        transaction,
      );
    });

    return noShowAppointment;
  }

  // ==================== Query Operations ====================

  /**
   * Get upcoming appointments for a nurse with proper joins
   */
  async getUpcomingAppointments(
    nurseId: string,
    limit: number = 10,
  ): Promise<AppointmentEntity[]> {
    this.logger.log(`Fetching upcoming appointments for nurse: ${nurseId}`);

    try {
      const appointments = await this.appointmentModel.findAll({
        where: {
          nurseId,
          scheduledAt: {
            [Op.gt]: new Date(),
          },
          status: {
            [Op.in]: [
              ModelAppointmentStatus.SCHEDULED,
              ModelAppointmentStatus.IN_PROGRESS,
            ],
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

      return appointments.map((apt) => this.mapToEntity(apt));
    } catch (error) {
      this.logger.error(
        `Error fetching upcoming appointments: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch upcoming appointments');
    }
  }

  /**
   * Get appointments by a specific date
   */
  async getAppointmentsByDate(
    dateStr: string,
  ): Promise<{ data: AppointmentEntity[] }> {
    this.logger.log(`Fetching appointments for date: ${dateStr}`);

    try {
      // Parse the date string and create start/end of day boundaries
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new BadRequestException(
          'Invalid date format. Expected YYYY-MM-DD',
        );
      }

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const appointments = await this.appointmentModel.findAll({
        where: {
          scheduledAt: {
            [Op.gte]: dayStart,
            [Op.lte]: dayEnd,
          },
        },
        order: [['scheduledAt', 'ASC']],
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          },
        ],
      });

      const data = appointments.map((apt) => this.mapToEntity(apt));
      return { data };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Error fetching appointments by date: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch appointments by date');
    }
  }

  /**
   * Get upcoming appointments for the next N days (not nurse-specific)
   */
  async getGeneralUpcomingAppointments(
    days: number = 7,
    limit: number = 50,
  ): Promise<{ data: AppointmentEntity[] }> {
    this.logger.log(`Fetching upcoming appointments for next ${days} days`);

    try {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + days);

      const appointments = await this.appointmentModel.findAll({
        where: {
          scheduledAt: {
            [Op.gte]: now,
            [Op.lte]: futureDate,
          },
          status: {
            [Op.in]: [
              ModelAppointmentStatus.SCHEDULED,
              ModelAppointmentStatus.IN_PROGRESS,
            ],
          },
        },
        order: [['scheduledAt', 'ASC']],
        limit,
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          },
        ],
      });

      const data = appointments.map((apt) => this.mapToEntity(apt));
      return { data };
    } catch (error) {
      this.logger.error(
        `Error fetching general upcoming appointments: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch upcoming appointments');
    }
  }

  // ==================== Availability Operations ====================

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
    this.logger.log(`Checking availability for nurse: ${nurseId}`);

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
          [Op.in]: [
            ModelAppointmentStatus.SCHEDULED,
            ModelAppointmentStatus.IN_PROGRESS,
          ],
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
              Sequelize.where(
                Sequelize.fn(
                  'DATE_ADD',
                  Sequelize.col('scheduled_at'),
                  Sequelize.literal('INTERVAL duration MINUTE'),
                ),
                Op.gt,
                slotStart,
              ),
              Sequelize.where(Sequelize.col('scheduled_at'), Op.lt, slotEnd),
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

      return conflicts.map((apt) => this.mapToEntity(apt));
    } catch (error) {
      this.logger.error(
        `Error checking availability: ${error.message}`,
        error.stack,
      );
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
    this.logger.log(`Getting available slots for nurse: ${nurseId} on ${date}`);

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
        startTime: new Date(currentSlotStart),
        endTime: currentSlotEnd,
        nurseId,
        isAvailable: conflicts.length === 0,
        duration: slotDuration,
        unavailabilityReason:
          conflicts.length > 0
            ? `Conflicting appointment: ${conflicts[0].reason || 'Scheduled'}`
            : undefined,
      });

      // Move to next slot
      currentSlotStart = new Date(
        currentSlotStart.getTime() + slotDuration * 60000,
      );
    }

    return slots;
  }

  // ==================== Waitlist Operations ====================

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
    this.logger.log(`Adding student ${data.studentId} to waitlist`);

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
      this.logger.error(
        `Error adding to waitlist: ${error.message}`,
        error.stack,
      );
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
    this.logger.log(`Fetching appointment history for student: ${studentId}`);

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

      return appointments.map((apt) => this.mapToEntity(apt));
    } catch (error) {
      this.logger.error(
        `Error fetching appointment history: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch appointment history');
    }
  }

  /**
   * Get no-show statistics for a student (for cancellation policy enforcement)
   */
  async getNoShowCount(
    studentId: string,
    daysBack: number = 90,
  ): Promise<number> {
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

  // ==================== Private Helper Methods ====================

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
          { status: WaitlistStatus.WAITING, nurseId: null },
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

        this.logger.log(
          `Notified waitlist entry ${entry.id} about available slot`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error processing waitlist: ${error.message}`,
        error.stack,
      );
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
          [Op.in]: [
            ModelAppointmentStatus.SCHEDULED,
            ModelAppointmentStatus.IN_PROGRESS,
          ],
        },
      },
    });

    if (count >= 20) {
      throw new BadRequestException(
        'Nurse has reached maximum daily appointment limit (20)',
      );
    }
  }

  // ==================== NEW WAITLIST METHODS ====================

  /**
   * Get waitlist with filtering and pagination
   */
  async getWaitlist(
    filters: WaitlistFiltersDto = {},
  ): Promise<{ waitlist: any[] }> {
    this.logger.log('Fetching waitlist entries');

    try {
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

      if (filters.priority) {
        whereClause.priority = filters.priority;
      }

      if (filters.type) {
        whereClause.type = filters.type;
      }

      const waitlistEntries = await this.waitlistModel.findAll({
        where: whereClause,
        order: [
          ['priority', 'DESC'],
          ['createdAt', 'ASC'],
        ],
        limit: filters.limit || 50,
        offset: filters.page ? (filters.page - 1) * (filters.limit || 50) : 0,
      });

      return { waitlist: waitlistEntries };
    } catch (error) {
      this.logger.error(
        `Error fetching waitlist: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch waitlist');
    }
  }

  /**
   * Update waitlist entry priority
   */
  async updateWaitlistPriority(
    id: string,
    priority: DtoWaitlistPriority,
  ): Promise<{ entry: any }> {
    this.logger.log(`Updating waitlist priority: ${id}`);

    try {
      const entry = await this.waitlistModel.findByPk(id);
      if (!entry) {
        throw new NotFoundException(`Waitlist entry with ID ${id} not found`);
      }

      await entry.update({ priority: priority as any });
      return { entry };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error updating waitlist priority: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to update waitlist priority');
    }
  }

  /**
   * Get waitlist position
   */
  async getWaitlistPosition(
    id: string,
  ): Promise<{ position: number; total: number }> {
    this.logger.log(`Getting waitlist position: ${id}`);

    try {
      const entry = await this.waitlistModel.findByPk(id);
      if (!entry) {
        throw new NotFoundException(`Waitlist entry with ID ${id} not found`);
      }

      // Count entries with higher priority or same priority but earlier creation
      const position = await this.waitlistModel.count({
        where: {
          status: WaitlistStatus.WAITING,
          [Op.or]: [
            { priority: { [Op.gt]: entry.priority } },
            {
              priority: entry.priority,
              createdAt: { [Op.lt]: entry.createdAt },
            },
          ],
        },
      });

      const total = await this.waitlistModel.count({
        where: { status: WaitlistStatus.WAITING },
      });

      return { position: position + 1, total };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error getting waitlist position: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to get waitlist position');
    }
  }

  /**
   * Notify waitlist entry
   */
  async notifyWaitlistEntry(
    id: string,
    message?: string,
  ): Promise<{ entry: any; notification: any }> {
    this.logger.log(`Notifying waitlist entry: ${id}`);

    try {
      const entry = await this.waitlistModel.findByPk(id);
      if (!entry) {
        throw new NotFoundException(`Waitlist entry with ID ${id} not found`);
      }

      await entry.update({
        status: WaitlistStatus.NOTIFIED,
        notifiedAt: new Date(),
      });

      // Mock notification response
      const notification = {
        sent: true,
        message: message || 'An appointment slot has become available',
        sentAt: new Date(),
      };

      return { entry, notification };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error notifying waitlist entry: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to notify waitlist entry');
    }
  }

  /**
   * Remove from waitlist
   */
  async removeFromWaitlist(
    id: string,
    reason?: string,
  ): Promise<{ entry: any }> {
    this.logger.log(`Removing from waitlist: ${id}`);

    try {
      const entry = await this.waitlistModel.findByPk(id);
      if (!entry) {
        throw new NotFoundException(`Waitlist entry with ID ${id} not found`);
      }

      await entry.update({
        status: WaitlistStatus.CANCELLED,
      });

      return { entry };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error removing from waitlist: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to remove from waitlist');
    }
  }

  // ==================== REMINDER METHODS ====================

  /**
   * Process pending reminders
   */
  async processPendingReminders(): Promise<ReminderProcessingResultDto> {
    this.logger.log('Processing pending reminders');

    try {
      const now = new Date();
      const cutoffTime = new Date(now.getTime() + 5 * 60000); // Next 5 minutes

      const pendingReminders = await this.reminderModel.findAll({
        where: {
          status: ReminderStatus.SCHEDULED,
          scheduledFor: {
            [Op.lte]: cutoffTime,
          },
        },
      });

      let sent = 0;
      let failed = 0;
      const errors: Array<{ reminderId: string; error: string }> = [];

      for (const reminder of pendingReminders) {
        try {
          // Mock sending reminder
          await reminder.update({
            status: ReminderStatus.SENT,
            sentAt: new Date(),
          });
          sent++;
        } catch (error) {
          await reminder.update({
            status: ReminderStatus.FAILED,
          });
          failed++;
          errors.push({
            reminderId: reminder.id!,
            error: error.message,
          });
        }
      }

      return {
        total: pendingReminders.length,
        sent,
        failed,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      this.logger.error(
        `Error processing reminders: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to process reminders');
    }
  }

  /**
   * Get appointment reminders
   */
  async getAppointmentReminders(
    appointmentId: string,
  ): Promise<{ reminders: any[] }> {
    this.logger.log(`Getting reminders for appointment: ${appointmentId}`);

    try {
      const reminders = await this.reminderModel.findAll({
        where: { appointmentId },
        order: [['scheduledFor', 'ASC']],
      });

      return { reminders };
    } catch (error) {
      this.logger.error(
        `Error getting appointment reminders: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to get appointment reminders');
    }
  }

  /**
   * Schedule reminder
   */
  async scheduleReminder(
    createDto: CreateReminderDto,
  ): Promise<{ reminder: any }> {
    this.logger.log('Scheduling custom reminder');

    try {
      // Verify appointment exists
      const appointment = await this.appointmentModel.findByPk(
        createDto.appointmentId,
      );
      if (!appointment) {
        throw new NotFoundException(
          `Appointment with ID ${createDto.appointmentId} not found`,
        );
      }

      const reminder = await this.reminderModel.create({
        id: uuidv4(),
        appointmentId: createDto.appointmentId,
        type: createDto.type as any,
        scheduledFor: createDto.scheduleTime,
        status: ReminderStatus.SCHEDULED,
        message: createDto.message || 'Appointment reminder',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { reminder };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error scheduling reminder: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to schedule reminder');
    }
  }

  /**
   * Cancel reminder
   */
  async cancelReminder(reminderId: string): Promise<{ reminder: any }> {
    this.logger.log(`Cancelling reminder: ${reminderId}`);

    try {
      const reminder = await this.reminderModel.findByPk(reminderId);
      if (!reminder) {
        throw new NotFoundException(`Reminder with ID ${reminderId} not found`);
      }

      await reminder.update({ status: ReminderStatus.CANCELLED });
      return { reminder };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error cancelling reminder: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to cancel reminder');
    }
  }

  // ==================== STATISTICS METHODS ====================

  /**
   * Get appointment statistics
   */
  async getStatistics(filters: StatisticsFiltersDto = {}): Promise<any> {
    this.logger.log('Getting appointment statistics');

    try {
      const whereClause: any = {};

      if (filters.nurseId) {
        whereClause.nurseId = filters.nurseId;
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

      const total = await this.appointmentModel.count({ where: whereClause });

      const byStatus = await this.appointmentModel.findAll({
        where: whereClause,
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        ],
        group: ['status'],
        raw: true,
      });

      const byType = await this.appointmentModel.findAll({
        where: whereClause,
        attributes: [
          'type',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        ],
        group: ['type'],
        raw: true,
      });

      const noShowCount = await this.appointmentModel.count({
        where: { ...whereClause, status: ModelAppointmentStatus.NO_SHOW },
      });

      const completedCount = await this.appointmentModel.count({
        where: { ...whereClause, status: ModelAppointmentStatus.COMPLETED },
      });

      return {
        total,
        byStatus: byStatus.reduce((acc, item: any) => {
          acc[item.status] = parseInt(item.count);
          return acc;
        }, {} as Record<string, number>),
        byType: byType.reduce((acc, item: any) => {
          acc[item.type] = parseInt(item.count);
          return acc;
        }, {} as Record<string, number>),
        noShowRate: total > 0 ? (noShowCount / total) * 100 : 0,
        completionRate: total > 0 ? (completedCount / total) * 100 : 0,
      };
    } catch (error) {
      this.logger.error(
        `Error getting statistics: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to get statistics');
    }
  }

  /**
   * Search appointments
   */
  async searchAppointments(
    searchDto: SearchAppointmentsDto,
  ): Promise<PaginatedResponse<AppointmentEntity>> {
    this.logger.log('Searching appointments');

    try {
      const whereClause: any = {};
      const page = searchDto.page || 1;
      const limit = searchDto.limit || 20;
      const offset = (page - 1) * limit;

      // Add filters
      if (searchDto.nurseId) {
        whereClause.nurseId = searchDto.nurseId;
      }

      if (searchDto.studentId) {
        whereClause.studentId = searchDto.studentId;
      }

      if (searchDto.status) {
        whereClause.status = searchDto.status;
      }

      if (searchDto.type) {
        whereClause.type = searchDto.type;
      }

      if (searchDto.dateFrom || searchDto.dateTo) {
        whereClause.scheduledAt = {};
        if (searchDto.dateFrom) {
          whereClause.scheduledAt[Op.gte] = searchDto.dateFrom;
        }
        if (searchDto.dateTo) {
          whereClause.scheduledAt[Op.lte] = searchDto.dateTo;
        }
      }

      // Add search query
      if (searchDto.search) {
        whereClause[Op.or] = [
          { reason: { [Op.like]: `%${searchDto.search}%` } },
          { notes: { [Op.like]: `%${searchDto.search}%` } },
        ];
      }

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

      const data = rows.map((row) => this.mapToEntity(row));
      const totalPages = Math.ceil(count / limit);

      return {
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error searching appointments: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to search appointments');
    }
  }

  // ==================== REMAINING MISSING METHODS ====================

  /**
   * Get appointments by date range
   */
  async getAppointmentsByDateRange(
    dateRange: DateRangeDto,
  ): Promise<{ appointments: AppointmentEntity[] }> {
    this.logger.log('Getting appointments by date range');

    try {
      const whereClause: any = {
        scheduledAt: {
          [Op.gte]: dateRange.dateFrom,
          [Op.lte]: dateRange.dateTo,
        },
      };

      if (dateRange.nurseId) {
        whereClause.nurseId = dateRange.nurseId;
      }

      const appointments = await this.appointmentModel.findAll({
        where: whereClause,
        order: [['scheduledAt', 'ASC']],
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          },
        ],
      });

      const data = appointments.map((apt) => this.mapToEntity(apt));
      return { appointments: data };
    } catch (error) {
      this.logger.error(
        `Error getting appointments by date range: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to get appointments by date range');
    }
  }

  /**
   * Get appointment trends
   */
  async getAppointmentTrends(
    dateFrom: string,
    dateTo: string,
    groupBy: 'day' | 'week' | 'month' = 'day',
  ): Promise<{ trends: any[] }> {
    this.logger.log('Getting appointment trends');

    try {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);

      // Mock trend data for now - in real implementation would use proper aggregation
      const trends: Array<{ date: string; count: number }> = [];
      const current = new Date(fromDate);

      while (current <= toDate) {
        const count = await this.appointmentModel.count({
          where: {
            scheduledAt: {
              [Op.gte]: current,
              [Op.lt]: new Date(current.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        });

        trends.push({
          date: current.toISOString().split('T')[0],
          count,
        });

        current.setDate(current.getDate() + 1);
      }

      return { trends };
    } catch (error) {
      this.logger.error(
        `Error getting appointment trends: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to get appointment trends');
    }
  }

  /**
   * Get no-show statistics
   */
  async getNoShowStats(
    nurseId?: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<any> {
    this.logger.log('Getting no-show statistics');

    try {
      const whereClause: any = {};

      if (nurseId) {
        whereClause.nurseId = nurseId;
      }

      if (dateFrom || dateTo) {
        whereClause.scheduledAt = {};
        if (dateFrom) {
          whereClause.scheduledAt[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          whereClause.scheduledAt[Op.lte] = new Date(dateTo);
        }
      }

      const total = await this.appointmentModel.count({ where: whereClause });
      const noShows = await this.appointmentModel.count({
        where: { ...whereClause, status: ModelAppointmentStatus.NO_SHOW },
      });

      const rate = total > 0 ? (noShows / total) * 100 : 0;

      return {
        rate,
        total,
        noShows,
        byStudent: [], // Mock - would implement proper aggregation
      };
    } catch (error) {
      this.logger.error(
        `Error getting no-show stats: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to get no-show statistics');
    }
  }

  /**
   * Get utilization statistics
   */
  async getUtilizationStats(
    nurseId: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<any> {
    this.logger.log('Getting utilization statistics');

    try {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);

      const totalAppointments = await this.appointmentModel.count({
        where: {
          nurseId,
          scheduledAt: {
            [Op.gte]: fromDate,
            [Op.lte]: toDate,
          },
        },
      });

      const bookedSlots = await this.appointmentModel.count({
        where: {
          nurseId,
          scheduledAt: {
            [Op.gte]: fromDate,
            [Op.lte]: toDate,
          },
          status: {
            [Op.in]: [
              ModelAppointmentStatus.SCHEDULED,
              ModelAppointmentStatus.IN_PROGRESS,
              ModelAppointmentStatus.COMPLETED,
            ],
          },
        },
      });

      // Calculate business days between dates
      const businessDays = this.calculateBusinessDays(fromDate, toDate);
      const businessHours = AppointmentValidation.getBusinessHours();
      const hoursPerDay = businessHours.end - businessHours.start;
      const slotsPerDay = (hoursPerDay * 60) / 30; // 30-minute slots
      const totalSlots = businessDays * slotsPerDay;
      const availableSlots = totalSlots - bookedSlots;
      const utilizationRate =
        totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;

      return {
        utilizationRate,
        totalSlots,
        bookedSlots,
        availableSlots,
        byDay: [], // Mock - would implement proper daily breakdown
      };
    } catch (error) {
      this.logger.error(
        `Error getting utilization stats: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to get utilization statistics');
    }
  }

  /**
   * Create recurring appointments
   */
  async createRecurringAppointments(
    createDto: CreateRecurringAppointmentDto,
  ): Promise<{ appointments: AppointmentEntity[]; count: number }> {
    this.logger.log('Creating recurring appointments');

    try {
      const appointments: AppointmentEntity[] = [];
      const startDate = new Date(createDto.scheduledAt);
      const endDate = new Date(createDto.recurrence.endDate);
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        // Check if this date should have an appointment based on recurrence pattern
        let shouldCreate = false;

        switch (createDto.recurrence.frequency) {
          case RecurrenceFrequency.DAILY:
            shouldCreate = true;
            break;
          case RecurrenceFrequency.WEEKLY:
            if (
              !createDto.recurrence.daysOfWeek ||
              createDto.recurrence.daysOfWeek.includes(currentDate.getDay())
            ) {
              shouldCreate = true;
            }
            break;
          case RecurrenceFrequency.MONTHLY:
            if (currentDate.getDate() === startDate.getDate()) {
              shouldCreate = true;
            }
            break;
        }

        if (shouldCreate) {
          try {
            const appointmentDto: CreateAppointmentDto = {
              studentId: createDto.studentId,
              nurseId: createDto.nurseId,
              appointmentType: createDto.type as any,
              scheduledDate: new Date(currentDate),
              duration: createDto.duration,
              reason: createDto.reason,
              notes: createDto.notes,
            };

            const appointment = await this.createAppointment(appointmentDto);
            appointments.push(appointment);
          } catch (error) {
            this.logger.warn(
              `Failed to create recurring appointment for ${currentDate.toISOString()}: ${error.message}`,
            );
          }
        }

        // Move to next occurrence
        switch (createDto.recurrence.frequency) {
          case RecurrenceFrequency.DAILY:
            currentDate.setDate(
              currentDate.getDate() + createDto.recurrence.interval,
            );
            break;
          case RecurrenceFrequency.WEEKLY:
            currentDate.setDate(
              currentDate.getDate() + 7 * createDto.recurrence.interval,
            );
            break;
          case RecurrenceFrequency.MONTHLY:
            currentDate.setMonth(
              currentDate.getMonth() + createDto.recurrence.interval,
            );
            break;
        }
      }

      return { appointments, count: appointments.length };
    } catch (error) {
      this.logger.error(
        `Error creating recurring appointments: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to create recurring appointments');
    }
  }

  /**
   * Bulk cancel appointments
   * OPTIMIZED: Replaced sequential cancellations with bulk update operation
   */
  async bulkCancelAppointments(
    bulkCancelDto: BulkCancelDto,
  ): Promise<{ cancelled: number; failed: number }> {
    this.logger.log('Bulk cancelling appointments');

    try {
      // OPTIMIZATION: Use transaction and bulk operations instead of loop
      // Before: N individual cancelAppointment calls = N * (query + reminder updates + waitlist processing)
      // After: 1 bulk update + 1 bulk reminder update = 2 queries total
      const result = await this.sequelize.transaction(async (transaction) => {
        // First, validate that all appointments can be cancelled
        const appointments = await this.appointmentModel.findAll({
          where: this.sequelize.where(
            this.sequelize.col('id'),
            Op.in,
            bulkCancelDto.appointmentIds,
          ) as any,
          transaction,
        });

        // Track validation results
        const validAppointments: string[] = [];
        const invalidAppointments: string[] = [];

        for (const appointment of appointments) {
          try {
            // Validate can be cancelled (not in final state)
            AppointmentValidation.validateCanBeCancelled(
              appointment.status as unknown as AppointmentStatus,
            );
            AppointmentValidation.validateCancellationNotice(
              appointment.scheduledAt,
            );
            validAppointments.push(appointment.id);
          } catch (error) {
            this.logger.warn(
              `Cannot cancel appointment ${appointment.id}: ${error.message}`,
            );
            invalidAppointments.push(appointment.id);
          }
        }

        if (validAppointments.length === 0) {
          return { cancelled: 0, failed: bulkCancelDto.appointmentIds.length };
        }

        // OPTIMIZATION: Bulk update all valid appointments in one query
        const [affectedCount] = await this.appointmentModel.update(
          {
            status: ModelAppointmentStatus.CANCELLED,
            notes: this.sequelize.fn(
              'CONCAT',
              this.sequelize.col('notes'),
              bulkCancelDto.reason
                ? `\nCancellation reason: ${bulkCancelDto.reason}`
                : '\nBulk cancelled',
            ) as any,
          },
          {
            where: this.sequelize.where(
              this.sequelize.col('id'),
              Op.in,
              validAppointments,
            ) as any,
            transaction,
          },
        );

        // OPTIMIZATION: Bulk cancel all related reminders in one query
        if (validAppointments.length > 0) {
          await this.reminderModel.update(
            { status: ReminderStatus.CANCELLED },
            {
              where: this.sequelize.and(
                this.sequelize.where(
                  this.sequelize.col('appointment_id'),
                  Op.in,
                  validAppointments,
                ),
                { status: ReminderStatus.SCHEDULED },
              ) as any,
              transaction,
            },
          );
        }

        // Note: Waitlist processing skipped in bulk operations for performance
        // Individual cancellations should be used if waitlist processing is required

        return {
          cancelled: affectedCount,
          failed: bulkCancelDto.appointmentIds.length - affectedCount,
        };
      });

      this.logger.log(
        `Bulk cancellation completed: ${result.cancelled} cancelled, ${result.failed} failed`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error in bulk cancellation: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to bulk cancel appointments');
    }
  }

  /**
   * Get appointments for multiple students
   */
  async getAppointmentsForStudents(
    studentIds: string[],
    filters?: Partial<AppointmentFiltersDto>,
  ): Promise<{ appointments: AppointmentEntity[] }> {
    this.logger.log('Getting appointments for multiple students');

    try {
      const whereClause: any = {
        studentId: {
          [Op.in]: studentIds,
        },
      };

      if (filters?.status) {
        whereClause.status = filters.status;
      }

      if (filters?.dateFrom || filters?.dateTo) {
        whereClause.scheduledAt = {};
        if (filters.dateFrom) {
          whereClause.scheduledAt[Op.gte] = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.scheduledAt[Op.lte] = filters.dateTo;
        }
      }

      const appointments = await this.appointmentModel.findAll({
        where: whereClause,
        order: [['scheduledAt', 'ASC']],
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          },
        ],
      });

      const data = appointments.map((apt) => this.mapToEntity(apt));
      return { appointments: data };
    } catch (error) {
      this.logger.error(
        `Error getting appointments for students: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to get appointments for students');
    }
  }

  /**
   * Check for scheduling conflicts
   */
  async checkConflicts(
    nurseId: string,
    startTime: string,
    duration: number,
    excludeAppointmentId?: string,
  ): Promise<any> {
    this.logger.log('Checking scheduling conflicts');

    try {
      const startDateTime = new Date(startTime);
      const conflicts = await this.checkAvailability(
        nurseId,
        startDateTime,
        duration,
        excludeAppointmentId,
      );

      const availableSlots = await this.getAvailableSlots(
        nurseId,
        startDateTime,
        duration,
      );

      return {
        hasConflict: conflicts.length > 0,
        conflicts,
        availableSlots: availableSlots.filter((slot) => slot.isAvailable),
      };
    } catch (error) {
      this.logger.error(
        `Error checking conflicts: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to check conflicts');
    }
  }

  /**
   * Export calendar
   */
  async exportCalendar(
    nurseId: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<string> {
    this.logger.log('Exporting calendar');

    try {
      const whereClause: any = { nurseId };

      if (dateFrom || dateTo) {
        whereClause.scheduledAt = {};
        if (dateFrom) {
          whereClause.scheduledAt[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          whereClause.scheduledAt[Op.lte] = new Date(dateTo);
        }
      }

      const appointments = await this.appointmentModel.findAll({
        where: whereClause,
        order: [['scheduledAt', 'ASC']],
      });

      // Generate basic iCal format
      let icalContent =
        'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//White Cross//Appointments//EN\r\n';

      for (const appointment of appointments) {
        const startTime =
          appointment.scheduledAt
            .toISOString()
            .replace(/[-:]/g, '')
            .split('.')[0] + 'Z';
        const endTime =
          new Date(
            appointment.scheduledAt.getTime() + appointment.duration * 60000,
          )
            .toISOString()
            .replace(/[-:]/g, '')
            .split('.')[0] + 'Z';

        icalContent += 'BEGIN:VEVENT\r\n';
        icalContent += `UID:${appointment.id}@whitecross.edu\r\n`;
        icalContent += `DTSTART:${startTime}\r\n`;
        icalContent += `DTEND:${endTime}\r\n`;
        icalContent += `SUMMARY:${appointment.reason || 'Appointment'}\r\n`;
        icalContent += `DESCRIPTION:${appointment.notes || ''}\r\n`;
        icalContent += 'END:VEVENT\r\n';
      }

      icalContent += 'END:VCALENDAR\r\n';

      return icalContent;
    } catch (error) {
      this.logger.error(
        `Error exporting calendar: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to export calendar');
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Calculate business days between two dates
   */
  private calculateBusinessDays(startDate: Date, endDate: Date): number {
    let businessDays = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Not Sunday or Saturday
        businessDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return businessDays;
  }

  /**
   * Map Sequelize model to entity
   */
  private mapToEntity(appointment: Appointment): AppointmentEntity {
    return {
      id: appointment.id,
      studentId: appointment.studentId,
      nurseId: appointment.nurseId,
      type: appointment.type as any,
      appointmentType: appointment.type as any,
      scheduledAt: appointment.scheduledAt,
      duration: appointment.duration,
      reason: appointment.reason,
      notes: appointment.notes,
      status: appointment.status as any,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      nurse: appointment.nurse
        ? {
            id: appointment.nurse.id,
            firstName: appointment.nurse.firstName,
            lastName: appointment.nurse.lastName,
            email: appointment.nurse.email,
            role: appointment.nurse.role || 'NURSE',
          }
        : undefined,
    };
  }

}
