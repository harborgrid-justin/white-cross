/**
 * @fileoverview Appointment Read Service
 * @module appointme@/services/appointment-read.service
 * @description Business logic for reading appointment data
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AppointmentFiltersDto } from '../dto/appointment-filters.dto';
import { AppointmentEntity, PaginatedResponse } from '../entities/appointment.entity';
import { Appointment } from '@/database/models';
import { User } from '@/database/models';

import { BaseService } from '@/common/base';
/**
 * Appointment Read Service
 *
 * Handles read operations for appointments:
 * - List appointments with filtering and pagination
 * - Get single appointment by ID
 */
@Injectable()
export class AppointmentReadService extends BaseService {
  constructor(
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {
    super('AppointmentReadService');
  }

  /**
   * Get appointments with filtering and pagination
   */
  async getAppointments(
    filters: AppointmentFiltersDto,
  ): Promise<PaginatedResponse<AppointmentEntity>> {
    this.logInfo(`Getting appointments with filters: ${JSON.stringify(filters)}`);

    try {
      const {
        page = 1,
        limit = 10,
        status,
        nurseId,
        studentId,
        startDate,
        endDate,
        type,
        sortBy = 'scheduledFor',
        sortOrder = 'ASC' as const,
      } = filters;

      const offset = (page - 1) * limit;
      const where: Record<string, any> = {};

      // Apply filters
      if (status) {
        where.status = status;
      }
      if (nurseId) {
        where.nurseId = nurseId;
      }
      if (studentId) {
        where.studentId = studentId;
      }
      if (type) {
        where.type = type;
      }
      // Date range filtering
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (startDate || endDate) {
        where.scheduledFor = {};
        if (startDate) {
          where.scheduledFor[Op.gte] = new Date(startDate);
        }
        if (endDate) {
          where.scheduledFor[Op.lte] = new Date(endDate);
        }
      }

      const { rows: appointments, count: total } = await this.appointmentModel.findAndCountAll({
        where,
        include: [
          {
            model: this.userModel,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
          {
            model: this.userModel,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data: appointments.map((appointment) => this.mapToEntity(appointment)),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      this.logError(
        `Error getting appointments: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Get appointment by ID
   */
  async getAppointmentById(id: string): Promise<AppointmentEntity> {
    this.logInfo(`Getting appointment by ID: ${id}`);

    try {
      const appointment = await this.appointmentModel.findByPk(id, {
        include: [
          {
            model: this.userModel,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
          {
            model: this.userModel,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'email'],
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
      this.logError(
        `Error getting appointment by ID: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToEntity(appointment: Appointment): AppointmentEntity {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      nurse: appointment.nurse
        ? {
            id: appointment.nurse.id,
            firstName: appointment.nurse.firstName,
            lastName: appointment.nurse.lastName,
            email: appointment.nurse.email,
          }
        : undefined,
      student: appointment.student
        ? {
            id: appointment.student.id,
            firstName: appointment.student.firstName,
            lastName: appointment.student.lastName,
            email: appointment.student.email,
          }
        : undefined,
    };
  }
}
