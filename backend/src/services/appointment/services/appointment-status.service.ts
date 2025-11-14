/**
 * @fileoverview Appointment Status Service
 * @module appointme@/services/appointment-status.service
 * @description Business logic for appointment status transitions
 */

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '@/database/models';
import {
  AppointmentStartedEvent,
  AppointmentCompletedEvent,
  AppointmentNoShowEvent,
} from '../events/appointment.events';
import { AppointmentStatus } from '../dto/update-appointment.dto';
import { Appointment } from '@/database/models';
import { AppointmentValidation } from '../validators/appointment-validation';
import { BaseService } from '@/common/base';
import {
  Appointment,
  AppointmentStatus as ModelAppointmentStatus,
} from '@/database/models';

/**
 * Appointment Status Service
 *
 * Handles status transition business logic:
 * - Start appointment (SCHEDULED → IN_PROGRESS)
 * - Complete appointment (IN_PROGRESS → COMPLETED)
 * - Mark as no-show (SCHEDULED → NO_SHOW)
 */
@Injectable()
export class AppointmentStatusService extends BaseService {
  constructor(
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super('AppointmentStatusService');
  }

  /**
   * Start an appointment (transition to IN_PROGRESS)
   */
  async startAppointment(id: string): Promise<Appointment> {
    this.logInfo(`Starting appointment: ${id}`);

    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Validate can be started
    AppointmentValidation.validateCanBeStarted(appointment.status as unknown as AppointmentStatus);
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
   */
  async completeAppointment(
    id: string,
    completionData?: {
      notes?: string;
      outcomes?: string;
      followUpRequired?: boolean;
      followUpDate?: Date;
    },
  ): Promise<Appointment> {
    this.logInfo(`Completing appointment: ${id}`);

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
  async markNoShow(id: string): Promise<Appointment> {
    this.logInfo(`Marking appointment as no-show: ${id}`);

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

    return noShowAppointment;
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Get appointment by ID with relations (simplified version)
   */
  private async getAppointmentById(id: string): Promise<Appointment> {
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
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return this.mapToEntity(appointment);
  }

  /**
   * Map Sequelize model to entity
   */
  private mapToEntity(appointment: Appointment): Appointment {
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
