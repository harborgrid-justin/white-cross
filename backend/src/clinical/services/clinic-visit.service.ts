import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ClinicVisit } from '../../database/models/clinic-visit.model';
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
    @InjectModel(ClinicVisit)
    private readonly clinicVisitModel: typeof ClinicVisit,
  ) {}

  /**
   * Check in a student to the clinic
   */
  async checkIn(data: CheckInDto): Promise<ClinicVisit> {
    this.logger.log(`Checking in student ${data.studentId}`);

    // Validate student doesn't have an active visit
    const activeVisit = await this.clinicVisitModel.findOne({
      where: {
        studentId: data.studentId,
        checkOutTime: null as any,
      },
    });

    if (activeVisit) {
      throw new ConflictException('Student already has an active clinic visit');
    }

    // Create new visit
    const visit = await this.clinicVisitModel.create({
      ...data,
      checkInTime: new Date(),
      disposition: VisitDisposition.OTHER, // Temporary, will be set at checkout
    } as any);

    return visit;
  }

  /**
   * Check out a student from the clinic
   */
  async checkOut(visitId: string, data: CheckOutDto): Promise<ClinicVisit> {
    this.logger.log(`Checking out visit ${visitId}`);

    const visit = await this.clinicVisitModel.findOne({
      where: { id: visitId },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.checkOutTime) {
      throw new BadRequestException('Visit already checked out');
    }

    // Update visit with checkout data
    await visit.update({
      ...data,
      checkOutTime: new Date(),
    });

    return visit.reload();
  }

  /**
   * Get active clinic visits
   */
  async getActiveVisits(): Promise<ClinicVisit[]> {
    return this.clinicVisitModel.findAll({
      where: {
        checkOutTime: null as any,
      },
      order: [['checkInTime', 'ASC']],
    });
  }

  /**
   * Get visits with filtering and pagination
   */
  async getVisits(
    filters: VisitFiltersDto,
  ): Promise<{ visits: ClinicVisit[]; total: number }> {
    const where: any = {};

    if (filters.studentId) {
      where.studentId = filters.studentId;
    }

    if (filters.attendedBy) {
      where.attendedBy = filters.attendedBy;
    }

    if (filters.disposition) {
      where.disposition = filters.disposition;
    }

    if (filters.activeOnly) {
      where.checkOutTime = null as any;
    }

    if (filters.dateFrom || filters.dateTo) {
      if (filters.dateFrom && filters.dateTo) {
        where.checkInTime = {
          [Op.between]: [filters.dateFrom, filters.dateTo],
        };
      } else if (filters.dateFrom) {
        where.checkInTime = { [Op.gte]: filters.dateFrom };
      } else if (filters.dateTo) {
        where.checkInTime = { [Op.lte]: filters.dateTo };
      }
    }

    const { rows: visits, count: total } =
      await this.clinicVisitModel.findAndCountAll({
        where,
        offset: filters.offset || 0,
        limit: filters.limit || 20,
        order: [['checkInTime', 'DESC']],
      });

    return { visits, total };
  }

  /**
   * Get visit by ID
   */
  async getVisitById(id: string): Promise<ClinicVisit> {
    const visit = await this.clinicVisitModel.findOne({
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
  async getVisitsByStudent(
    studentId: string,
    limit: number = 10,
  ): Promise<ClinicVisit[]> {
    return this.clinicVisitModel.findAll({
      where: { studentId },
      order: [['checkInTime', 'DESC']],
      limit,
    });
  }

  /**
   * Update a visit
   */
  async updateVisit(
    id: string,
    updates: Partial<CheckInDto & CheckOutDto>,
  ): Promise<ClinicVisit> {
    const visit = await this.getVisitById(id);

    await visit.update(updates);
    return visit.reload();
  }

  /**
   * Delete a visit
   */
  async deleteVisit(id: string): Promise<void> {
    const result = await this.clinicVisitModel.destroy({
      where: { id },
    });

    if (result === 0) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }

    this.logger.log(`Deleted visit ${id}`);
  }

  /**
   * Get visit statistics
   */
  async getStatistics(
    startDate: Date,
    endDate: Date,
  ): Promise<VisitStatistics> {
    const visits = await this.clinicVisitModel.findAll({
      where: {
        checkInTime: {
          [Op.between]: [startDate, endDate],
        },
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
      stats.byDisposition[visit.disposition] =
        (stats.byDisposition[visit.disposition] || 0) + 1;

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
    stats.averageVisitDuration =
      durationCount > 0 ? totalDuration / durationCount : 0;
    stats.averageMinutesMissed =
      visits.length > 0 ? stats.totalMinutesMissed / visits.length : 0;

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
    const whereClause: any = { studentId };

    if (startDate && endDate) {
      whereClause.checkInTime = {
        [Op.between]: [startDate, endDate],
      };
    }

    const visits = await this.clinicVisitModel.findAll({
      where: whereClause,
      order: [['checkInTime', 'DESC']],
    });

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

    summary.averageDuration =
      durationCount > 0 ? totalDuration / durationCount : 0;

    // Get most common reasons
    summary.mostCommonReasons = Object.entries(reasonCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([reason]) => reason);

    // Calculate visit frequency (visits per month)
    if (startDate && endDate) {
      const months =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      summary.visitFrequency = visits.length / (months || 1);
    } else if (visits.length > 1) {
      // Use actual date range from visits
      const oldestVisit = visits[visits.length - 1].checkInTime;
      const newestVisit = visits[0].checkInTime;
      const months =
        (newestVisit.getTime() - oldestVisit.getTime()) /
        (1000 * 60 * 60 * 24 * 30);
      summary.visitFrequency = visits.length / (months || 1);
    }

    return summary;
  }

  /**
   * Get frequent visitors (students with high visit frequency)
   *
   * OPTIMIZATION: Fixed N+1 query problem
   * Before: 1 + N queries (1 for visits + N for each student's summary) = 101 queries for 100 students
   * After: 1 query (calculate summaries from already-fetched visits data) = 1 query
   * Performance improvement: ~99% query reduction
   */
  async getFrequentVisitors(
    startDate: Date,
    endDate: Date,
    limit: number = 10,
  ): Promise<StudentVisitSummary[]> {
    const visits = await this.clinicVisitModel.findAll({
      where: {
        checkInTime: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['checkInTime', 'DESC']],
    });

    // Group by student
    const studentVisits: Map<string, ClinicVisit[]> = new Map();
    for (const visit of visits) {
      const existing = studentVisits.get(visit.studentId) || [];
      existing.push(visit);
      studentVisits.set(visit.studentId, existing);
    }

    // OPTIMIZATION: Calculate summaries from already-fetched data instead of N additional queries
    const summaries: StudentVisitSummary[] = [];
    for (const [studentId, studentVisitList] of studentVisits.entries()) {
      // Calculate summary directly from visits data without additional query
      const summary: StudentVisitSummary = {
        studentId,
        totalVisits: studentVisitList.length,
        averageDuration: 0,
        totalMinutesMissed: 0,
        mostCommonReasons: [],
        lastVisitDate: studentVisitList[0]?.checkInTime || new Date(),
        visitFrequency: 0,
      };

      // Calculate average duration
      let totalDuration = 0;
      let durationCount = 0;
      const reasonCounts: Record<string, number> = {};

      for (const visit of studentVisitList) {
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

      summary.averageDuration =
        durationCount > 0 ? totalDuration / durationCount : 0;

      // Get most common reasons
      summary.mostCommonReasons = Object.entries(reasonCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([reason]) => reason);

      // Calculate visit frequency (visits per month)
      const months =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      summary.visitFrequency = studentVisitList.length / (months || 1);

      summaries.push(summary);
    }

    // Sort by total visits and return top N
    return summaries
      .sort((a, b) => b.totalVisits - a.totalVisits)
      .slice(0, limit);
  }

  /**
   * Get visits by time of day distribution
   */
  async getVisitsByTimeOfDay(
    startDate: Date,
    endDate: Date,
  ): Promise<Record<string, number>> {
    const visits = await this.clinicVisitModel.findAll({
      where: {
        checkInTime: {
          [Op.between]: [startDate, endDate],
        },
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
