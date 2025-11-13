import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ClinicVisit } from '@/database/models';
import { VisitStatistics } from '../interfaces/visit-statistics.interface';
import { StudentVisitSummary } from '../interfaces/student-visit-summary.interface';

import { BaseService } from '@/common/base';
/**
 * Clinic Visit Analytics Service
 * Handles analytics and statistics for clinic visits
 */
@Injectable()
export class ClinicVisitAnalyticsService extends BaseService {
  constructor(
    @InjectModel(ClinicVisit)
    private readonly clinicVisitModel: typeof ClinicVisit,
  ) {}

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

    // Calculate summaries from already-fetched data
    const summaries: StudentVisitSummary[] = [];
    for (const [studentId, studentVisitList] of studentVisits.entries()) {
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
