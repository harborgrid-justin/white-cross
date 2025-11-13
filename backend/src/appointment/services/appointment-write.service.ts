/**
 * @fileoverview Appointment Write Service
 * @module appointment/services/appointment-write.service
 * @description Business logic for appointment write operations
 */

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Op, Sequelize, Transaction } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { AppConfigService } from '../../config/app-config.service';
import {
  AppointmentCancelledEvent,
  AppointmentCreatedEvent,
  AppointmentUpdatedEvent,
} from '../events/appointment.events';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { AppointmentEntity } from '../entities/appointment.entity';
import { AppointmentValidation } from '../validators/appointment-validation';
import { AppointmentStatusTransitions } from '../validators/status-transitions';
import {
  Appointment,
  AppointmentStatus as ModelAppointmentStatus,
} from '../../database/models/appointment.model';
import {
  AppointmentReminder,
  ReminderStatus,
} from '../../database/models/appointment-reminder.model';
import {
  AppointmentWaitlist,
  WaitlistStatus,
} from '../../database/models/appointment-waitlist.model';
import { User } from '../../database/models/user.model';

import { BaseService } from '@/common/base';
/**
 * Appointment Write Service
 *
 * Handles write operations for appointments:
 * - Create new appointment
 * - Update existing appointment
 * - Cancel appointment
 */
@Injectable()
export class AppointmentWriteService extends BaseService {
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(AppointmentReminder)
    private readonly reminderModel: typeof AppointmentReminder,
    @InjectModel(AppointmentWaitlist)
    private readonly waitlistModel: typeof AppointmentWaitlist,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: AppConfigService,
  ) {}

  /**
   * Create new appointment
   */

  async createAppointment(createDto: CreateAppointmentDto): Promise<AppointmentEntity> {
    this.logInfo(`Creating appointment for student: ${createDto.studentId}`);

    const transaction = await this.sequelize.transaction();

    try {
      // Validate appointment data
      await AppointmentValidation.validateCreateAppointment(createDto);

      // Check availability
      await this.checkAvailability(createDto, transaction);

      // Validate daily appointment limit
      await this.validateDailyAppointmentLimit(
        createDto.nurseId,
        createDto.scheduledFor,
        transaction,
      );

      const appointment = await this.appointmentModel.create(
        {
          id: uuidv4(),
          nurseId: createDto.nurseId,
          studentId: createDto.studentId,
          scheduledFor: createDto.scheduledFor,
          duration: createDto.duration,
          type: createDto.type,
          status: ModelAppointmentStatus.SCHEDULED,
          notes: createDto.notes,
          reason: createDto.reason,
          location: createDto.location,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { transaction },
      );

      // Schedule reminders
      await this.scheduleReminders(appointment, transaction);

      // Process waitlist for this slot
      await this.processWaitlistForSlot(createDto.scheduledFor, createDto.nurseId, transaction);

      await transaction.commit();

      // Emit event
      this.eventEmitter.emit(
        'appointment.created',
        new AppointmentCreatedEvent(appointment.id, appointment.nurseId, appointment.studentId),
      );

      return this.mapToEntity(appointment);
    } catch (error) {
      await transaction.rollback();
      this.logError(
        `Error creating appointment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Update existing appointment
   */
  async updateAppointment(id: string, updateDto: UpdateAppointmentDto): Promise<AppointmentEntity> {
    this.logInfo(`Updating appointment: ${id}`);

    const transaction = await this.sequelize.transaction();

    try {
      const appointment = await this.appointmentModel.findByPk(id, { transaction });
      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }

      // Validate status transition if status is being updated
      if (updateDto.status && updateDto.status !== appointment.status) {
        AppointmentStatusTransitions.validateTransition(appointment.status, updateDto.status);
      }

      // Check availability if time is being changed
      if (updateDto.scheduledFor && updateDto.scheduledFor !== appointment.scheduledFor) {
        await this.checkAvailability(
          {
            ...appointment.toJSON(),
            scheduledFor: updateDto.scheduledFor,
          },
          transaction,
          id,
        );
      }

      const updatedAppointment = await appointment.update(
        {
          ...updateDto,
          updatedAt: new Date(),
        },
        { transaction },
      );

      await transaction.commit();

      // Emit event
      this.eventEmitter.emit(
        'appointment.updated',
        new AppointmentUpdatedEvent(id, updatedAppointment.nurseId, updatedAppointment.studentId),
      );

      return this.mapToEntity(updatedAppointment);
    } catch (error) {
      await transaction.rollback();
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logError(
        `Error updating appointment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(id: string, reason?: string): Promise<AppointmentEntity> {
    this.logInfo(`Cancelling appointment: ${id}`);

    const transaction = await this.sequelize.transaction();

    try {
      const appointment = await this.appointmentModel.findByPk(id, { transaction });
      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }

      // Validate status transition
      AppointmentStatusTransitions.validateTransition(
        appointment.status,
        ModelAppointmentStatus.CANCELLED,
      );

      const updatedAppointment = await appointment.update(
        {
          status: ModelAppointmentStatus.CANCELLED,
          notes: reason
            ? `${appointment.notes || ''}\nCancellation reason: ${reason}`.trim()
            : appointment.notes,
          updatedAt: new Date(),
        },
        { transaction },
      );

      // Cancel associated reminders
      await this.reminderModel.update(
        { status: ReminderStatus.CANCELLED },
        {
          where: { appointmentId: id },
          transaction,
        },
      );

      // Process waitlist for this slot
      await this.processWaitlistForSlot(appointment.scheduledFor, appointment.nurseId, transaction);

      await transaction.commit();

      // Emit event
      this.eventEmitter.emit(
        'appointment.cancelled',
        new AppointmentCancelledEvent(id, appointment.nurseId, appointment.studentId, reason),
      );

      return this.mapToEntity(updatedAppointment);
    } catch (error) {
      await transaction.rollback();
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logError(
        `Error cancelling appointment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Check availability for appointment
   */
  private async checkAvailability(
    appointmentData: Partial<CreateAppointmentDto & { id?: string }>,
    transaction: Transaction,
    excludeId?: string,
  ): Promise<void> {
    const { scheduledFor, duration = 30, nurseId } = appointmentData;
    const endTime = new Date(scheduledFor.getTime() + duration * 60000);

    const conflictingAppointment = await this.appointmentModel.findOne({
      where: {
        nurseId,
        status: {
          [Op.in]: [ModelAppointmentStatus.SCHEDULED, ModelAppointmentStatus.CONFIRMED],
        },
        [Op.or]: [
          {
            [Op.and]: [
              { scheduledFor: { [Op.lt]: endTime } },
              {
                [Op.and]: Sequelize.where(
                  Sequelize.fn(
                    'DATE_ADD',
                    Sequelize.col('scheduledFor'),
                    Sequelize.literal('INTERVAL `Appointment`.`duration` MINUTE'),
                  ),
                  '>',
                  scheduledFor,
                ),
              },
            ],
          },
        ],
        ...(excludeId && { id: { [Op.ne]: excludeId } }),
      },
      transaction,
    });

    if (conflictingAppointment) {
      throw new BadRequestException('Time slot is not available');
    }
  }

  /**
   * Validate daily appointment limit
   */
  private async validateDailyAppointmentLimit(
    nurseId: string,
    date: Date,
    transaction: Transaction,
  ): Promise<void> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dailyCount = await this.appointmentModel.count({
      where: {
        nurseId,
        scheduledFor: {
          [Op.between]: [startOfDay, endOfDay],
        },
        status: {
          [Op.in]: [ModelAppointmentStatus.SCHEDULED, ModelAppointmentStatus.CONFIRMED],
        },
      },
      transaction,
    });

    const maxDailyAppointments = this.configService.get('MAX_DAILY_APPOINTMENTS') || 8;
    if (dailyCount >= maxDailyAppointments) {
      throw new BadRequestException(
        `Daily appointment limit (${maxDailyAppointments}) exceeded for this nurse`,
      );
    }
  }

  /**
   * Schedule reminders for appointment
   */
  private async scheduleReminders(
    appointment: Appointment,
    transaction: Transaction,
  ): Promise<void> {
    const reminderTimes = [
      { minutes: 60, type: '1_hour_before' },
      { minutes: 24 * 60, type: '1_day_before' },
    ];

    for (const { minutes, type } of reminderTimes) {
      const reminderTime = new Date(appointment.scheduledFor.getTime() - minutes * 60000);

      if (reminderTime > new Date()) {
        await this.reminderModel.create(
          {
            id: uuidv4(),
            appointmentId: appointment.id,
            scheduledFor: reminderTime,
            type,
            status: ReminderStatus.SCHEDULED,
            message: `Appointment reminder: ${appointment.reason || 'Scheduled appointment'}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { transaction },
        );
      }
    }
  }

  /**
   * Process waitlist for slot
   */
  private async processWaitlistForSlot(
    scheduledFor: Date,
    nurseId: string,
    transaction: Transaction,
  ): Promise<void> {
    // Find waitlist entries for this time slot
    const waitlistEntries = await this.waitlistModel.findAll({
      where: {
        nurseId,
        preferredDate: scheduledFor,
        status: WaitlistStatus.WAITING,
      },
      order: [['createdAt', 'ASC']],
      transaction,
    });

    if (waitlistEntries.length > 0) {
      // Update first entry to notified
      await waitlistEntries[0].update({ status: WaitlistStatus.NOTIFIED }, { transaction });

      // TODO: Send notification to student
      this.logInfo(`Notified student ${waitlistEntries[0].studentId} about available slot`);
    }
  }

  /**
   * Map database model to entity
   */

  private mapToEntity(appointment: Appointment): AppointmentEntity {
    return {
      id: appointment.id,
      nurseId: appointment.nurseId,
      studentId: appointment.studentId,
      scheduledFor: appointment.scheduledFor,
      duration: appointment.duration,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
      reason: appointment.reason,
      location: appointment.location,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }
}
