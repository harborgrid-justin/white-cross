import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { FollowUpAppointment } from '../entities/follow-up-appointment.entity';
import { FollowUpStatus } from '../enums/follow-up-status.enum';
import { ScheduleFollowUpDto } from '../dto/follow-up/schedule-follow-up.dto';
import { UpdateFollowUpDto } from '../dto/follow-up/update-follow-up.dto';
import { CompleteFollowUpDto } from '../dto/follow-up/complete-follow-up.dto';
import { FollowUpFiltersDto } from '../dto/follow-up/follow-up-filters.dto';

@Injectable()
export class FollowUpService {
  private readonly logger = new Logger(FollowUpService.name);

  constructor(
    @InjectRepository(FollowUpAppointment)
    private followUpRepository: Repository<FollowUpAppointment>,
  ) {}

  async schedule(scheduleDto: ScheduleFollowUpDto): Promise<FollowUpAppointment> {
    const appointment = this.followUpRepository.create(scheduleDto);
    return this.followUpRepository.save(appointment);
  }

  async findOne(id: string): Promise<FollowUpAppointment> {
    const appointment = await this.followUpRepository.findOne({
      where: { id },
      relations: ['originalVisit', 'completedVisit'],
    });
    if (!appointment) throw new NotFoundException(`Follow-up ${id} not found`);
    return appointment;
  }

  async findAll(filters: FollowUpFiltersDto): Promise<{ appointments: FollowUpAppointment[]; total: number }> {
    const queryBuilder = this.followUpRepository.createQueryBuilder('followUp');

    if (filters.studentId) queryBuilder.andWhere('followUp.studentId = :studentId', { studentId: filters.studentId });
    if (filters.originalVisitId) queryBuilder.andWhere('followUp.originalVisitId = :originalVisitId', { originalVisitId: filters.originalVisitId });
    if (filters.status) queryBuilder.andWhere('followUp.status = :status', { status: filters.status });
    if (filters.assignedTo) queryBuilder.andWhere('followUp.assignedTo = :assignedTo', { assignedTo: filters.assignedTo });

    if (filters.pendingOnly) {
      queryBuilder.andWhere('followUp.status IN (:...pendingStatuses)', {
        pendingStatuses: [FollowUpStatus.SCHEDULED, FollowUpStatus.REMINDED, FollowUpStatus.CONFIRMED],
      });
    }

    if (filters.upcomingOnly) {
      queryBuilder.andWhere('followUp.scheduledDate > :now', { now: new Date() });
    }

    if (filters.dateFrom || filters.dateTo) {
      if (filters.dateFrom && filters.dateTo) {
        queryBuilder.andWhere('followUp.scheduledDate BETWEEN :dateFrom AND :dateTo', {
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        });
      } else if (filters.dateFrom) {
        queryBuilder.andWhere('followUp.scheduledDate >= :dateFrom', { dateFrom: filters.dateFrom });
      } else if (filters.dateTo) {
        queryBuilder.andWhere('followUp.scheduledDate <= :dateTo', { dateTo: filters.dateTo });
      }
    }

    const [appointments, total] = await queryBuilder
      .skip(filters.offset || 0)
      .take(filters.limit || 20)
      .orderBy('followUp.scheduledDate', 'ASC')
      .getManyAndCount();

    return { appointments, total };
  }

  async findByStudent(studentId: string, limit: number = 10): Promise<FollowUpAppointment[]> {
    return this.followUpRepository.find({
      where: { studentId },
      order: { scheduledDate: 'DESC' },
      take: limit,
    });
  }

  async findPending(): Promise<FollowUpAppointment[]> {
    return this.followUpRepository.find({
      where: {
        status: FollowUpStatus.SCHEDULED,
      },
      order: { scheduledDate: 'ASC' },
    });
  }

  async update(id: string, updateDto: UpdateFollowUpDto): Promise<FollowUpAppointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, updateDto);
    return this.followUpRepository.save(appointment);
  }

  async confirm(id: string): Promise<FollowUpAppointment> {
    const appointment = await this.findOne(id);
    appointment.confirm();
    return this.followUpRepository.save(appointment);
  }

  async complete(id: string, completeDto: CompleteFollowUpDto): Promise<FollowUpAppointment> {
    const appointment = await this.findOne(id);
    appointment.complete(completeDto.completedVisitId);
    if (completeDto.notes) appointment.notes = completeDto.notes;
    return this.followUpRepository.save(appointment);
  }

  async cancel(id: string, reason: string): Promise<FollowUpAppointment> {
    const appointment = await this.findOne(id);
    appointment.cancel(reason);
    return this.followUpRepository.save(appointment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.followUpRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Follow-up ${id} not found`);
    this.logger.log(`Deleted follow-up ${id}`);
  }

  async findNeedingReminders(reminderHours: number = 24): Promise<FollowUpAppointment[]> {
    const reminderDate = new Date();
    reminderDate.setHours(reminderDate.getHours() + reminderHours);

    return this.followUpRepository.find({
      where: {
        status: FollowUpStatus.SCHEDULED,
        reminderSent: false,
        scheduledDate: LessThan(reminderDate),
      },
      order: { scheduledDate: 'ASC' },
    });
  }
}
