import ClinicVisit, { VisitDisposition } from '../../database/models/clinical/ClinicVisit';
import { Op } from 'sequelize';

export interface CheckInDTO {
  studentId: string;
  reasonForVisit: string[];
  symptoms?: string[];
  attendedBy: string;
  notes?: string;
}

export interface CheckOutDTO {
  treatment?: string;
  disposition: VisitDisposition;
  classesMissed?: string[];
  minutesMissed?: number;
  notes?: string;
}

export interface VisitFilters {
  studentId?: string;
  attendedBy?: string;
  disposition?: VisitDisposition;
  dateFrom?: Date;
  dateTo?: Date;
  activeOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface VisitStatistics {
  totalVisits: number;
  averageVisitDuration: number;
  byReason: Record<string, number>;
  byDisposition: Record<string, number>;
  totalMinutesMissed: number;
  averageMinutesMissed: number;
  activeVisits: number;
  mostCommonSymptoms: Array<{ symptom: string; count: number }>;
}

export interface StudentVisitSummary {
  studentId: string;
  totalVisits: number;
  averageDuration: number;
  totalMinutesMissed: number;
  mostCommonReasons: string[];
  lastVisitDate: Date;
  visitFrequency: number; // visits per month
}

/**
 * Clinic Visit Service
 * Feature 17: Clinic Visit Tracking
 *
 * Manages student clinic visits with check-in/out workflow
 */
export class ClinicVisitService {
  /**
   * Check in a student to the clinic
   */
  async checkIn(data: CheckInDTO): Promise<ClinicVisit> {
    // Validate student doesn't have an active visit
    const activeVisit = await ClinicVisit.findOne({
      where: {
        studentId: data.studentId,
        checkOutTime: null,
      },
    });

    if (activeVisit) {
      throw new Error('Student already has an active clinic visit');
    }

    // Create new visit
    const visit = await ClinicVisit.create({
      ...data,
      checkInTime: new Date(),
      disposition: VisitDisposition.OTHER, // Temporary, will be set at checkout
    });

    return visit;
  }

  /**
   * Check out a student from the clinic
   */
  async checkOut(visitId: string, data: CheckOutDTO): Promise<ClinicVisit> {
    const visit = await ClinicVisit.findByPk(visitId);
    if (!visit) {
      throw new Error('Visit not found');
    }

    if (visit.checkOutTime) {
      throw new Error('Visit already checked out');
    }

    // Update visit with checkout data
    await visit.update({
      ...data,
      checkOutTime: new Date(),
    });

    return visit;
  }

  /**
   * Get active clinic visits
   */
  async getActiveVisits(): Promise<ClinicVisit[]> {
    return ClinicVisit.findActiveVisits();
  }

  /**
   * Get visits with filtering and pagination
   */
  async getVisits(filters: VisitFilters): Promise<{ visits: ClinicVisit[]; total: number }> {
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
      where.checkOutTime = null;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.checkInTime = {};
      if (filters.dateFrom) {
        where.checkInTime[Op.gte] = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.checkInTime[Op.lte] = filters.dateTo;
      }
    }

    const { rows, count } = await ClinicVisit.findAndCountAll({
      where,
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      order: [['checkInTime', 'DESC']],
      include: ['student', 'nurse'],
    });

    return { visits: rows, total: count };
  }

  /**
   * Get visit by ID
   */
  async getVisitById(id: string): Promise<ClinicVisit | null> {
    return ClinicVisit.findByPk(id, {
      include: ['student', 'nurse'],
    });
  }

  /**
   * Get visits for a student
   */
  async getVisitsByStudent(studentId: string, limit: number = 10): Promise<ClinicVisit[]> {
    return ClinicVisit.findByStudentId(studentId, limit);
  }

  /**
   * Update a visit
   */
  async updateVisit(
    id: string,
    updates: Partial<CheckInDTO & CheckOutDTO>
  ): Promise<ClinicVisit> {
    const visit = await ClinicVisit.findByPk(id);
    if (!visit) {
      throw new Error('Visit not found');
    }

    await visit.update(updates);
    return visit;
  }

  /**
   * Get visit statistics
   */
  async getStatistics(startDate: Date, endDate: Date, schoolId?: string): Promise<VisitStatistics> {
    const where: any = {
      checkInTime: {
        [Op.between]: [startDate, endDate],
      },
    };

    const visits = await ClinicVisit.findAll({
      where,
      include: ['student'],
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
    endDate?: Date
  ): Promise<StudentVisitSummary> {
    const where: any = { studentId };

    if (startDate && endDate) {
      where.checkInTime = {
        [Op.between]: [startDate, endDate],
      };
    }

    const visits = await ClinicVisit.findAll({
      where,
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
    limit: number = 10
  ): Promise<StudentVisitSummary[]> {
    const visits = await ClinicVisit.findAll({
      where: {
        checkInTime: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: ['student'],
      order: [['checkInTime', 'DESC']],
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
    for (const [studentId, studentVisitList] of studentVisits) {
      const summary = await this.getStudentVisitSummary(studentId, startDate, endDate);
      summaries.push(summary);
    }

    // Sort by total visits and return top N
    return summaries.sort((a, b) => b.totalVisits - a.totalVisits).slice(0, limit);
  }

  /**
   * Get visits by time of day distribution
   */
  async getVisitsByTimeOfDay(
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, number>> {
    const visits = await ClinicVisit.findAll({
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

  /**
   * Delete a visit (soft delete if paranoid, hard delete otherwise)
   */
  async deleteVisit(id: string): Promise<void> {
    const visit = await ClinicVisit.findByPk(id);
    if (!visit) {
      throw new Error('Visit not found');
    }

    await visit.destroy();
  }
}

export default new ClinicVisitService();
