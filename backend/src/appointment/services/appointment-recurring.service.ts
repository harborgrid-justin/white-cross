/**
 * @fileoverview Appointment Recurring Service
 * @module appointment/services/appointment-recurring.service
 * @description Business logic for recurring appointments and bulk operations
 */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, Transaction } from 'sequelize';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { CreateRecurringAppointmentDto, RecurrenceFrequency } from '../dto/recurring.dto';
import { BulkCancelDto } from '../dto/statistics.dto';
import { AppointmentEntity } from '../entities/appointment.entity';
import { AppointmentValidation } from '../validators/appointment-validation';
import { AppointmentStatus } from '../dto/update-appointment.dto';
import { BaseService } from '@/common/base';
import {
  Appointment,
  AppointmentStatus as ModelAppointmentStatus,
} from '../../database/models/appointment.model';
import {
  AppointmentReminder,
  ReminderStatus,
} from '../../database/models/appointment-reminder.model';

/**
 * Appointment Recurring Service
 *
 * Handles recurring appointment and bulk operations:
 * - Creating recurring appointment series
 * - Bulk cancellation of appointments
 * - Pattern-based appointment generation
 */
@Injectable()
export class AppointmentRecurringService extends BaseService {
  constructor(
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(AppointmentReminder)
    private readonly reminderModel: typeof AppointmentReminder,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Create recurring appointments based on recurrence pattern
   *
   * @param createDto Recurring appointment creation DTO
   * @param createAppointmentFn Function to create individual appointments
   * @returns Array of created appointments and count
   */
  async createRecurringAppointments(
    createDto: CreateRecurringAppointmentDto,
    createAppointmentFn: (dto: CreateAppointmentDto) => Promise<AppointmentEntity>,
  ): Promise<{ appointments: AppointmentEntity[]; count: number }> {
    this.logInfo('Creating recurring appointments');

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

            const appointment = await createAppointmentFn(appointmentDto);
            appointments.push(appointment);
          } catch (error) {
            this.logWarning(
              `Failed to create recurring appointment for ${currentDate.toISOString()}: ${error.message}`,
            );
          }
        }

        // Move to next occurrence
        switch (createDto.recurrence.frequency) {
          case RecurrenceFrequency.DAILY:
            currentDate.setDate(currentDate.getDate() + createDto.recurrence.interval);
            break;
          case RecurrenceFrequency.WEEKLY:
            currentDate.setDate(currentDate.getDate() + 7 * createDto.recurrence.interval);
            break;
          case RecurrenceFrequency.MONTHLY:
            currentDate.setMonth(currentDate.getMonth() + createDto.recurrence.interval);
            break;
        }
      }

      return { appointments, count: appointments.length };
    } catch (error) {
      this.logError(`Error creating recurring appointments: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create recurring appointments');
    }
  }

  /**
   * Bulk cancel appointments
   * OPTIMIZED: Uses bulk update operation instead of individual cancellations
   *
   * @param bulkCancelDto Bulk cancellation DTO
   * @returns Result with cancelled and failed counts
   */
  async bulkCancelAppointments(
    bulkCancelDto: BulkCancelDto,
  ): Promise<{ cancelled: number; failed: number }> {
    this.logInfo('Bulk cancelling appointments');

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
            AppointmentValidation.validateCancellationNotice(appointment.scheduledAt);
            validAppointments.push(appointment.id);
          } catch (error) {
            this.logWarning(`Cannot cancel appointment ${appointment.id}: ${error.message}`);
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
            where: this.sequelize.where(this.sequelize.col('id'), Op.in, validAppointments) as any,
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

      this.logInfo(
        `Bulk cancellation completed: ${result.cancelled} cancelled, ${result.failed} failed`,
      );
      return result;
    } catch (error) {
      this.logError(`Error in bulk cancellation: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to bulk cancel appointments');
    }
  }
}
