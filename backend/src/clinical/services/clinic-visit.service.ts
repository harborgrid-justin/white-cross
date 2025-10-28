import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull } from 'typeorm';
import { ClinicVisit } from '../entities/clinic-visit.entity';
import { VisitDisposition } from '../enums/visit-disposition.enum';
import { CheckInDto } from '../dto/visit/check-in.dto';
import { CheckOutDto } from '../dto/visit/check-out.dto';
import { VisitFiltersDto } from '../dto/visit/visit-filters.dto';
import { VisitStatistics } from '../interfaces/visit-statistics.interface';
import { StudentVisitSummary } from '../interfaces/student-visit-summary.interface';

/**
 * Clinic Visit Service
 * Feature 17: Clinic Visit Tracking
 *
 * Manages student clinic visits with check-in/check-out workflow
 */
@Injectable()
export class ClinicVisitService {
  private readonly logger = new Logger(ClinicVisitService.name);

  constructor(
    @InjectRepository(ClinicVisit)
    private clinicVisitRepository: Repository<ClinicVisit>,
  ) {}

  /**
   * Check in a student to the clinic
   */
  async checkIn(data: CheckInDto): Promise<ClinicVisit> {
    this.logger.log(`Checking in student ${data.studentId}`);

    // Validate student doesn't have an active visit
    const activeVisit = await this.clinicVisitRepository.findOne({
      where: {
        studentId: data.studentId,
        checkOutTime: IsNull(),
      },
    });

    if (activeVisit) {
      throw new ConflictException('Student already has an active clinic visit');
    }

    // Create new visit
    const visit = this.clinicVisitRepository.create({
      ...data,
      checkInTime: new Date(),
      disposition: VisitDisposition.OTHER, // Temporary, will be set at checkout
    });

    return this.clinicVisitRepository.save(visit);
  }

  /**
   * Check out a student from the clinic
   */
  async checkOut(visitId: string, data: CheckOutDto): Promise<ClinicVisit> {
    this.logger.log(`Checking out visit ${visitId}`);

    const visit = await this.clinicVisitRepository.findOne({
      where: { id: visitId },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.checkOutTime) {
      throw new BadRequestException('Visit already checked out');
    }

    // Update visit with checkout data
    Object.assign(visit, {
      ...data,
      checkOutTime: new Date(),
    });

    return this.clinicVisitRepository.save(visit);
  }

  /**
   * Get active clinic visits
   */
  async getActiveVisits(): Promise<ClinicVisit[]> {
    return this.clinicVisitRepository.find({
      where: { checkOutTime: IsNull() },
      order: { checkInTime: 'ASC' },
    });
  }

  /**
   * Get visits with filtering and pagination
   */
  async getVisits(filters: VisitFiltersDto): Promise<{ visits: ClinicVisit[]; total: number }> {
    const queryBuilder = this.clinicVisitRepository.createQueryBuilder('visit');

    if (filters.studentId) {
      queryBuilder.andWhere('visit.studentId = :studentId', { studentId: filters.studentId });
    }

    if (filters.attendedBy) {
      queryBuilder.andWhere('visit.attendedBy = :attendedBy', { attendedBy: filters.attendedBy });
    }

    if (filters.disposition) {
      queryBuilder.andWhere('visit.disposition = :disposition', {
        disposition: filters.disposition,
      });
    }

    if (filters.activeOnly) {
      queryBuilder.andWhere('visit.checkOutTime IS NULL');
    }

    if (filters.dateFrom || filters.dateTo) {
      if (filters.dateFrom && filters.dateTo) {
        queryBuilder.andWhere('visit.checkInTime BETWEEN :dateFrom AND :dateTo', {
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        });
      } else if (filters.dateFrom) {
        queryBuilder.andWhere('visit.checkInTime >= :dateFrom', { dateFrom: filters.dateFrom });
      } else if (filters.dateTo) {
        queryBuilder.andWhere('visit.checkInTime <= :dateTo', { dateTo: filters.dateTo });
      }
    }

    const [visits, total] = await queryBuilder
      .skip(filters.offset || 0)
      .take(filters.limit || 20)
      .orderBy('visit.checkInTime', 'DESC')
      .getManyAndCount();

    return { visits, total };
  }

  /**
   * Get visit by ID
   */
  async getVisitById(id: string): Promise<ClinicVisit> {
    const visit = await this.clinicVisitRepository.findOne({
      where: { id },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    return visit;
  }

  /**
   * Get visits for a student
   */
  async getVisitsByStudent(studentId: string, limit: number = 10): Promise<ClinicVisit[]> {
    return this.clinicVisitRepository.find({
      where: { studentId },
      order: { checkInTime: 'DESC' },
      take: limit,
    });
  }

  /**
   * Update a visit
   */
  async updateVisit(id: string, updates: Partial<CheckInDto & CheckOutDto>): Promise<ClinicVisit> {
    const visit = await this.getVisitById(id);

    Object.assign(visit, updates);
    return this.clinicVisitRepository.save(visit);
  }

  /**
   * Delete a visit
   */
  async deleteVisit(id: string): Promise<void> {
    const result = await this.clinicVisitRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Visit not found');
    }

    this.logger.log(`Deleted visit ${id}`);
  }

  /**
   * Get visit statistics
   */
  async getStatistics(startDate: Date, endDate: Date): Promise<VisitStatistics> {
    const visits = await this.clinicVisitRepository.find({
      where: {
        checkInTime: Between(startDate, endDate),
      },
    });

    const stats: VisitStatistics = {
      totalVisits: visits.length,
      averageVisitDuration: 0,
      byReason: {},
      byDisposition: {},
      totalMinutesMissed: 0,
      averageMinutesMissed: 0,
      activeVisits: 0,
      mostCommonSymptoms: [],
    };

    let totalDuration = 0;
    let durationCount = 0;
    const symptomCounts: Record<string, number> = {};

    for (const visit of visits) {
      // Calculate duration
      const duration = visit.getDuration();
      if (duration !== null) {
        totalDuration += duration;
        durationCount++;
      } else {
        stats.activeVisits++;
      }

      // Count by reason
      for (const reason of visit.reasonForVisit) {
        stats.byReason[reason] = (stats.byReason[reason] || 0) + 1;
      }

      // Count by disposition
      stats.byDisposition[visit.disposition] = (stats.byDisposition[visit.disposition] || 0) + 1;

      // Sum minutes missed
      if (visit.minutesMissed) {
        stats.totalMinutesMissed += visit.minutesMissed;
      }

      // Count symptoms
      if (visit.symptoms) {
        for (const symptom of visit.symptoms) {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        }
      }
    }

    // Calculate averages
    stats.averageVisitDuration = durationCount > 0 ? totalDuration / durationCount : 0;
    stats.averageMinutesMissed = visits.length > 0 ? stats.totalMinutesMissed / visits.length : 0;

    // Get most common symptoms
    stats.mostCommonSymptoms = Object.entries(symptomCounts)
      .map(([symptom, count]) => ({ symptom, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  }

  /**
   * Get visit summary for a student
   */
  async getStudentVisitSummary(
    studentId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<StudentVisitSummary> {
    const queryBuilder = this.clinicVisitRepository
      .createQueryBuilder('visit')
      .where('visit.studentId = :studentId', { studentId });

    if (startDate && endDate) {
      queryBuilder.andWhere('visit.checkInTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const visits = await queryBuilder.orderBy('visit.checkInTime', 'DESC').getMany();

    const summary: StudentVisitSummary = {
      studentId,
      totalVisits: visits.length,
      averageDuration: 0,
      totalMinutesMissed: 0,
      mostCommonReasons: [],
      lastVisitDate: visits[0]?.checkInTime || new Date(),
      visitFrequency: 0,
    };

    if (visits.length === 0) {
      return summary;
    }

    // Calculate average duration
    let totalDuration = 0;
    let durationCount = 0;
    const reasonCounts: Record<string, number> = {};

    for (const visit of visits) {
      const duration = visit.getDuration();
      if (duration !== null) {
        totalDuration += duration;
        durationCount++;
      }

      if (visit.minutesMissed) {
        summary.totalMinutesMissed += visit.minutesMissed;
      }

      for (const reason of visit.reasonForVisit) {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      }
    }

    summary.averageDuration = durationCount > 0 ? totalDuration / durationCount : 0;

    // Get most common reasons
    summary.mostCommonReasons = Object.entries(reasonCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([reason]) => reason);

    // Calculate visit frequency (visits per month)
    if (startDate && endDate) {
      const months = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      summary.visitFrequency = visits.length / (months || 1);
    } else if (visits.length > 1) {
      // Use actual date range from visits
      const oldestVisit = visits[visits.length - 1].checkInTime;
      const newestVisit = visits[0].checkInTime;
      const months = (newestVisit.getTime() - oldestVisit.getTime()) / (1000 * 60 * 60 * 24 * 30);
      summary.visitFrequency = visits.length / (months || 1);
    }

    return summary;
  }

  /**
   * Get frequent visitors (students with high visit frequency)
   */
  async getFrequentVisitors(
    startDate: Date,
    endDate: Date,
    limit: number = 10,
  ): Promise<StudentVisitSummary[]> {
    const visits = await this.clinicVisitRepository.find({
      where: {
        checkInTime: Between(startDate, endDate),
      },
      order: { checkInTime: 'DESC' },
    });

    // Group by student
    const studentVisits: Map<string, ClinicVisit[]> = new Map();
    for (const visit of visits) {
      const existing = studentVisits.get(visit.studentId) || [];
      existing.push(visit);
      studentVisits.set(visit.studentId, existing);
    }

    // Calculate summaries
    const summaries: StudentVisitSummary[] = [];
    for (const [studentId] of studentVisits) {
      const summary = await this.getStudentVisitSummary(studentId, startDate, endDate);
      summaries.push(summary);
    }

    // Sort by total visits and return top N
    return summaries.sort((a, b) => b.totalVisits - a.totalVisits).slice(0, limit);
  }

  /**
   * Get visits by time of day distribution
   */
  async getVisitsByTimeOfDay(startDate: Date, endDate: Date): Promise<Record<string, number>> {
    const visits = await this.clinicVisitRepository.find({
      where: {
        checkInTime: Between(startDate, endDate),
      },
    });

    const distribution: Record<string, number> = {
      'Morning (6-9am)': 0,
      'Mid-Morning (9am-12pm)': 0,
      'Afternoon (12-3pm)': 0,
      'Late Afternoon (3-6pm)': 0,
      'Evening (6pm+)': 0,
    };

    for (const visit of visits) {
      const hour = visit.checkInTime.getHours();
      if (hour >= 6 && hour < 9) {
        distribution['Morning (6-9am)']++;
      } else if (hour >= 9 && hour < 12) {
        distribution['Mid-Morning (9am-12pm)']++;
      } else if (hour >= 12 && hour < 15) {
        distribution['Afternoon (12-3pm)']++;
      } else if (hour >= 15 && hour < 18) {
        distribution['Late Afternoon (3-6pm)']++;
      } else {
        distribution['Evening (6pm+)']++;
      }
    }

    return distribution;
  }
}
