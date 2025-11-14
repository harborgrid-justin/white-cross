import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { FollowUpAppointment } from '@/database/models/follow-up-appointment.model';
import { FollowUpStatus } from '../enums/follow-up-status.enum';
import { ScheduleFollowUpDto } from '../dto/follow-up/schedule-follow-up.dto';
import { UpdateFollowUpDto } from '../dto/follow-up/update-follow-up.dto';
import { CompleteFollowUpDto } from '../dto/follow-up/complete-follow-up.dto';
import { FollowUpFiltersDto } from '../dto/follow-up/follow-up-filters.dto';

import { BaseService } from '@/common/base';
@Injectable()
export class FollowUpService extends BaseService {
  constructor(
    @InjectModel(FollowUpAppointment)
    private followUpModel: typeof FollowUpAppointment,
  ) {
    super("FollowUpService");
  }

  async schedule(
    scheduleDto: ScheduleFollowUpDto,
  ): Promise<FollowUpAppointment> {
    return this.followUpModel.create(scheduleDto as any);
  }

  async findOne(id: string): Promise<FollowUpAppointment> {
    const appointment = await this.followUpModel.findByPk(id, {
      include: ['originalVisit', 'completedVisit'],
    });
    if (!appointment) throw new NotFoundException(`Follow-up ${id} not found`);
    return appointment;
  }

  async findAll(
    filters: FollowUpFiltersDto,
  ): Promise<{ appointments: FollowUpAppointment[]; total: number }> {
    const whereClause: any = {};

    if (filters.studentId) whereClause.studentId = filters.studentId;
    if (filters.originalVisitId)
      whereClause.originalVisitId = filters.originalVisitId;
    if (filters.status) whereClause.status = filters.status;
    if (filters.assignedTo) whereClause.assignedTo = filters.assignedTo;

    if (filters.pendingOnly) {
      whereClause.status = {
        [Op.in]: [
          FollowUpStatus.SCHEDULED,
          FollowUpStatus.REMINDED,
          FollowUpStatus.CONFIRMED,
        ],
      };
    }

    if (filters.upcomingOnly) {
      whereClause.scheduledDate = { [Op.gt]: new Date() };
    }

    if (filters.dateFrom || filters.dateTo) {
      if (filters.dateFrom && filters.dateTo) {
        whereClause.scheduledDate = {
          [Op.between]: [filters.dateFrom, filters.dateTo],
        };
      } else if (filters.dateFrom) {
        whereClause.scheduledDate = { [Op.gte]: filters.dateFrom };
      } else if (filters.dateTo) {
        whereClause.scheduledDate = { [Op.lte]: filters.dateTo };
      }
    }

    const { rows: appointments, count: total } =
      await this.followUpModel.findAndCountAll({
        where: whereClause,
        offset: filters.offset || 0,
        limit: filters.limit || 20,
        order: [['scheduledDate', 'ASC']],
      });

    return { appointments, total };
  }

  async findByStudent(
    studentId: string,
    limit: number = 10,
  ): Promise<FollowUpAppointment[]> {
    return this.followUpModel.findAll({
      where: { studentId },
      order: [['scheduledDate', 'DESC']],
      limit,
    });
  }

  async findPending(): Promise<FollowUpAppointment[]> {
    return this.followUpModel.findAll({
      where: {
        status: FollowUpStatus.SCHEDULED,
      },
      order: [['scheduledDate', 'ASC']],
    });
  }

  async update(
    id: string,
    updateDto: UpdateFollowUpDto,
  ): Promise<FollowUpAppointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, updateDto);
    await appointment.save();
    return appointment;
  }

  async confirm(id: string): Promise<FollowUpAppointment> {
    const appointment = await this.findOne(id);
    appointment.confirm();
    await appointment.save();
    return appointment;
  }

  async complete(
    id: string,
    completeDto: CompleteFollowUpDto,
  ): Promise<FollowUpAppointment> {
    const appointment = await this.findOne(id);
    appointment.complete(completeDto.completedVisitId);
    if (completeDto.notes) appointment.notes = completeDto.notes;
    await appointment.save();
    return appointment;
  }

  async cancel(id: string, reason: string): Promise<FollowUpAppointment> {
    const appointment = await this.findOne(id);
    appointment.cancel(reason);
    await appointment.save();
    return appointment;
  }

  async remove(id: string): Promise<void> {
    const result = await this.followUpModel.destroy({ where: { id } });
    if (result === 0) throw new NotFoundException(`Follow-up ${id} not found`);
    this.logInfo(`Deleted follow-up ${id}`);
  }

  async findNeedingReminders(
    reminderHours: number = 24,
  ): Promise<FollowUpAppointment[]> {
    const reminderDate = new Date();
    reminderDate.setHours(reminderDate.getHours() + reminderHours);

    return this.followUpModel.findAll({
      where: {
        status: FollowUpStatus.SCHEDULED,
        reminderSent: false,
        scheduledDate: { [Op.lt]: reminderDate },
      },
      order: [['scheduledDate', 'ASC']],
    });
  }
}
