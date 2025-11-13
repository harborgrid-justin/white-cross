/**
 * @fileoverview Reminder Service
 * @module appointment/services/reminder.service
 * @description Business logic for appointment reminder management
 */

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { ReminderProcessingResultDto } from '../dto/reminder.dto';
import {
  AppointmentReminder,
  ReminderStatus,
} from '@/database/models';
import { Appointment } from '@/database/models';

import { BaseService } from '@/common/base';
/**
 * Reminder Service
 *
 * Handles reminder management operations:
 * - Process pending reminders
 * - Get appointment reminders
 * - Create appointment reminders
 */
@Injectable()
export class ReminderService extends BaseService {
  constructor(
    @InjectModel(AppointmentReminder)
    private readonly reminderModel: typeof AppointmentReminder,
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
  ) {}

  /**
   * Process pending reminders
   */
  async processPendingReminders(): Promise<ReminderProcessingResultDto> {
    this.logInfo('Processing pending reminders');

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
            reminderId: reminder.id,
            error: error instanceof Error ? error.message : 'Unknown error',
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
      this.logError(
        `Error processing reminders: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new BadRequestException('Failed to process reminders');
    }
  }

  /**
   * Get appointment reminders
   */
  async getAppointmentReminders(appointmentId: string): Promise<{ reminders: any[] }> {
    this.logInfo(`Getting reminders for appointment: ${appointmentId}`);

    try {
      const reminders = await this.reminderModel.findAll({
        where: { appointmentId },
        order: [['scheduledFor', 'ASC']],
      });

      return { reminders };
    } catch (error) {
      this.logError(
        `Error getting appointment reminders: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new BadRequestException('Failed to get appointment reminders');
    }
  }

  /**
   * Create appointment reminder
   */
  async createAppointmentReminder(
    appointmentId: string,
    createDto: { scheduledFor: Date; type: string; message: string },
  ) {
    this.logInfo(`Creating reminder for appointment: ${appointmentId}`);

    try {
      // Verify appointment exists
      const appointment = await this.appointmentModel.findByPk(appointmentId);
      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${appointmentId} not found`);
      }

      const reminder = await this.reminderModel.create({
        id: uuidv4(),
        appointmentId,
        scheduledFor: createDto.scheduledFor,
        type: createDto.type,
        status: ReminderStatus.SCHEDULED,
        message: createDto.message,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { reminder };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logError(
        `Error creating reminder: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new BadRequestException('Failed to create reminder');
    }
  }
}
