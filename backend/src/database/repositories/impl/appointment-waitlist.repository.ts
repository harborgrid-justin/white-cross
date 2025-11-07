import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AppointmentWaitlist, WaitlistPriority, WaitlistStatus } from '../../models/appointment-waitlist.model';
import { AppointmentType } from '../../models/appointment.model';

export interface CreateAppointmentWaitlistDTO {
  studentId: string;
  nurseId?: string;
  type: AppointmentType;
  preferredDate?: Date;
  duration: number;
  priority: WaitlistPriority;
  reason: string;
  notes?: string;
  status: WaitlistStatus;
}

export interface UpdateAppointmentWaitlistDTO {
  nurseId?: string;
  type?: AppointmentType;
  preferredDate?: Date;
  duration?: number;
  priority?: WaitlistPriority;
  reason?: string;
  notes?: string;
  status?: WaitlistStatus;
  notifiedAt?: Date;
  expiresAt?: Date;
}

/**
 * AppointmentWaitlist Repository Implementation
 *
 * Provides data access operations for appointment waitlist entries.
 * Handles CRUD operations and business logic related to appointment waiting lists.
 */
@Injectable()
export class AppointmentWaitlistRepository {
  constructor(
    @InjectModel(AppointmentWaitlist)
    private readonly appointmentWaitlistModel: typeof AppointmentWaitlist,
  ) {}

  /**
   * Find all waitlist entries
   */
  async findAll(): Promise<AppointmentWaitlist[]> {
    return this.appointmentWaitlistModel.findAll();
  }

  /**
   * Find waitlist entry by ID
   */
  async findById(id: string): Promise<AppointmentWaitlist | null> {
    return this.appointmentWaitlistModel.findByPk(id);
  }

  /**
   * Create new waitlist entry
   */
  async create(data: CreateAppointmentWaitlistDTO): Promise<AppointmentWaitlist> {
    return this.appointmentWaitlistModel.create(data);
  }

  /**
   * Update waitlist entry
   */
  async update(id: string, data: UpdateAppointmentWaitlistDTO): Promise<AppointmentWaitlist | null> {
    const [affectedCount] = await this.appointmentWaitlistModel.update(data, {
      where: { id },
    });

    if (affectedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  /**
   * Delete waitlist entry
   */
  async delete(id: string): Promise<boolean> {
    const affectedCount = await this.appointmentWaitlistModel.destroy({
      where: { id },
    });

    return affectedCount > 0;
  }

  /**
   * Find waitlist entries by student ID
   */
  async findByStudentId(studentId: string): Promise<AppointmentWaitlist[]> {
    return this.appointmentWaitlistModel.findAll({
      where: { studentId },
      order: [
        ['priority', 'ASC'],
        ['createdAt', 'ASC'],
      ],
    });
  }
}
