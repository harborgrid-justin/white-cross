/**
 * @fileoverview Health Record Statistics Service
 * @module health-record/statistics
 * @description Health statistics and analytics with aggregation and reporting
 * HIPAA Compliance: Statistics aggregate PHI data but do not expose individual records
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Student   } from '@/database/models';
import { Vaccination   } from '@/database/models';
import { Allergy   } from '@/database/models';
import { ChronicCondition   } from '@/database/models';
import { VitalSigns   } from '@/database/models';
import { ClinicVisit   } from '@/database/models';
import { School   } from '@/database/models';

import { BaseService } from '@/common/base';
@Injectable()
export class StatisticsService extends BaseService {
  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
    @InjectModel(Allergy)
    private readonly allergyModel: typeof Allergy,
    @InjectModel(ChronicCondition)
    private readonly chronicConditionModel: typeof ChronicCondition,
    @InjectModel(VitalSigns)
    private readonly vitalSignsModel: typeof VitalSigns,
    @InjectModel(ClinicVisit)
    private readonly clinicVisitModel: typeof ClinicVisit,
    @InjectModel(School)
    private readonly schoolModel: typeof School,
  ) {}

  async getStudentStatistics(studentId: string): Promise<any> {
    this.logInfo(`Getting statistics for student ${studentId}`);

    // Verify student exists
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Aggregate data across all health modules using Sequelize queries
    const [vaccinations, allergies, chronicConditions, vitals, visits] =
      await Promise.all([
        this.vaccinationModel.findAll({
          where: { studentId },
          attributes: ['id', 'vaccineName', 'administeredAt'],
        }),
        this.allergyModel.findAll({
          where: { studentId, active: true },
          attributes: ['id', 'allergen', 'severity'],
        }),
        this.chronicConditionModel.findAll({
          where: { studentId, status: 'ACTIVE' },
          attributes: ['id', 'conditionName', 'severity'],
        }),
        this.vitalSignsModel.findAll({
          where: { studentId },
          attributes: [
            'measurementDate',
            'height',
            'weight',
            'bmi',
            'bloodPressureSystolic',
            'bloodPressureDiastolic',
          ],
          order: [['measurementDate', 'DESC']],
          limit: 1,
        }),
        this.clinicVisitModel.findAll({
          where: { studentId },
          attributes: ['id', 'visitDate'],
        }),
      ]);

    const latestVital = vitals[0];

    return {
      studentId,
      totalVaccinations: vaccinations.length,
      totalAllergies: allergies.length,
      activeChronicConditions: chronicConditions.length,
      totalVisits: visits.length,
      latestVitals: latestVital
        ? {
            recordedAt: latestVital.measurementDate,
            height: latestVital.height,
            weight: latestVital.weight,
            bmi: latestVital.bmi,
            bloodPressure:
              latestVital.bloodPressureSystolic &&
              latestVital.bloodPressureDiastolic
                ? `${latestVital.bloodPressureSystolic}/${latestVital.bloodPressureDiastolic}`
                : null,
          }
        : null,
      vaccinationStatus: this.calculateVaccinationStatus(vaccinations),
      healthRiskLevel: this.calculateHealthRiskLevel({
        allergies: allergies.length,
        chronicConditions: chronicConditions.length,
      }),
    };
  }

  async getSchoolStatistics(schoolId: string): Promise<any> {
    this.logInfo(`Getting statistics for school ${schoolId}`);

    // Verify school exists
    const school = await this.schoolModel.findByPk(schoolId);
    if (!school) {
      throw new NotFoundException(`School with ID ${schoolId} not found`);
    }

    // Get all students for this school
    const students = await this.studentModel.findAll({
      where: { schoolId },
      attributes: ['id'],
    });
    const studentIds = students.map((s) => s.id);

    if (studentIds.length === 0) {
      return {
        schoolId,
        totalStudents: 0,
        totalVaccinations: 0,
        totalAllergies: 0,
        activeChronicConditions: 0,
        vaccinationRate: 0,
        fullyVaccinatedCount: 0,
        studentsWithAllergies: 0,
        studentsWithChronicConditions: 0,
      };
    }

    // Aggregate data using Sequelize queries
    const [vaccinations, allergies, chronicConditions] = await Promise.all([
      this.vaccinationModel.findAll({
        where: { studentId: { [Op.in]: studentIds } },
        attributes: ['studentId', 'vaccineName', 'administeredAt'],
      }),
      this.allergyModel.findAll({
        where: { studentId: { [Op.in]: studentIds }, active: true },
        attributes: ['studentId'],
      }),
      this.chronicConditionModel.findAll({
        where: { studentId: { [Op.in]: studentIds }, status: 'ACTIVE' },
        attributes: ['studentId'],
      }),
    ]);

    // Calculate vaccination compliance per student
    const studentVaccinationMap = new Map<string, any[]>();
    vaccinations.forEach((v) => {
      if (!studentVaccinationMap.has(v.studentId)) {
        studentVaccinationMap.set(v.studentId, []);
      }
      studentVaccinationMap.get(v.studentId)!.push(v);
    });

    let fullyVaccinatedCount = 0;
    studentVaccinationMap.forEach((vaccs) => {
      if (this.calculateVaccinationStatus(vaccs) === 'COMPLIANT') {
        fullyVaccinatedCount++;
      }
    });

    const vaccinationRate =
      studentIds.length > 0
        ? (fullyVaccinatedCount / studentIds.length) * 100
        : 0;

    const uniqueStudentsWithAllergies = Array.from(
      new Set(allergies.map((a) => a.studentId)),
    );
    const uniqueStudentsWithChronicConditions = Array.from(
      new Set(chronicConditions.map((c) => c.studentId)),
    );

    return {
      schoolId,
      totalStudents: studentIds.length,
      totalVaccinations: vaccinations.length,
      totalAllergies: allergies.length,
      activeChronicConditions: chronicConditions.length,
      vaccinationRate: parseFloat(vaccinationRate.toFixed(2)),
      fullyVaccinatedCount,
      studentsWithAllergies: uniqueStudentsWithAllergies.length,
      studentsWithChronicConditions: uniqueStudentsWithChronicConditions.length,
    };
  }

  async getTrendAnalysis(type: string, timeframe: string): Promise<any> {
    this.logInfo(`Analyzing trends: ${type} over ${timeframe}`);

    const days = this.parseTimeframe(timeframe);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    let data: any[] = [];
    let dateField: string;

    switch (type) {
      case 'vaccinations':
        dateField = 'administrationDate';
        data = await this.vaccinationModel.findAll({
          where: { administrationDate: { [Op.gte]: cutoffDate } },
          attributes: ['administrationDate'],
          raw: true,
        });
        break;
      case 'visits':
        dateField = 'checkInTime';
        data = await this.clinicVisitModel.findAll({
          where: { checkInTime: { [Op.gte]: cutoffDate } },
          attributes: ['checkInTime'],
          raw: true,
        });
        break;
      case 'allergies':
        // Note: createdAt not available in AllergyAttributes interface
        // Using diagnosedDate as alternative for trend analysis
        data = await this.allergyModel.findAll({
          where: {
            active: true,
            diagnosedDate: { [Op.gte]: cutoffDate },
          },
          attributes: ['diagnosedDate'],
          raw: true,
        });
        dateField = 'diagnosedDate';
        break;
      default:
        return {
          type,
          timeframe,
          trend: 'unsupported_type',
          data: [],
          totalCount: 0,
        };
    }

    const groupedByDay = this.groupByDay(data, dateField);
    const trend = this.calculateTrend(groupedByDay);

    return {
      type,
      timeframe,
      trend,
      data: groupedByDay,
      totalCount: data.length,
    };
  }

  /**
   * Get overall system statistics
   */
  async getOverallStatistics(): Promise<any> {
    this.logInfo('Getting overall system statistics');

    // Use Promise.all for parallel queries
    const [
      totalStudents,
      totalVaccinations,
      totalAllergies,
      totalChronicConditions,
      totalVisits,
      totalVitalRecords,
      studentsWithAllergies,
      studentsWithChronicConditions,
    ] = await Promise.all([
      this.studentModel.count(),
      this.vaccinationModel.count(),
      this.allergyModel.count({ where: { active: true } }),
      this.chronicConditionModel.count({ where: { status: 'ACTIVE' } }),
      this.clinicVisitModel.count(),
      this.vitalSignsModel.count(),
      this.allergyModel.count({
        where: { active: true },
        distinct: true,
        col: 'studentId',
      }),
      this.chronicConditionModel.count({
        where: { status: 'ACTIVE' },
        distinct: true,
        col: 'studentId',
      }),
    ]);

    return {
      totalStudents,
      totalVaccinations,
      totalAllergies,
      totalChronicConditions,
      totalVisits,
      totalVitalRecords,
      averageVaccinationsPerStudent:
        totalStudents > 0
          ? (totalVaccinations / totalStudents).toFixed(2)
          : '0',
      studentsWithAllergies,
      studentsWithChronicConditions,
    };
  }

  /**
   * Get health alerts summary
   */
  async getHealthAlerts(schoolId?: string): Promise<any> {
    this.logInfo(
      `Getting health alerts${schoolId ? ` for school ${schoolId}` : ''}`,
    );

    let studentIds: string[];

    if (schoolId) {
      // Verify school exists
      const school = await this.schoolModel.findByPk(schoolId);
      if (!school) {
        throw new NotFoundException(`School with ID ${schoolId} not found`);
      }

      const students = await this.studentModel.findAll({
        where: { schoolId },
        attributes: ['id'],
      });
      studentIds = students.map((s) => s.id);
    } else {
      const students = await this.studentModel.findAll({
        attributes: ['id'],
      });
      studentIds = students.map((s) => s.id);
    }

    if (studentIds.length === 0) {
      return {
        criticalAllergies: { count: 0, students: [] },
        overdueVaccinations: { count: 0, students: [] },
        unmanagedConditions: { count: 0, students: [] },
      };
    }

    // Critical allergies
    const criticalAllergies = await this.allergyModel.findAll({
      where: {
        studentId: { [Op.in]: studentIds },
        active: true,
        severity: { [Op.in]: ['SEVERE', 'LIFE_THREATENING'] },
      },
      attributes: ['studentId'],
    });

    // Overdue vaccinations (simplified logic - would need CDC schedule integration)
    const allVaccinations = await this.vaccinationModel.findAll({
      where: { studentId: { [Op.in]: studentIds } },
      attributes: ['studentId', 'vaccineName', 'administeredAt'],
    });

    const studentVaccinationMap = new Map<string, any[]>();
    allVaccinations.forEach((v) => {
      if (!studentVaccinationMap.has(v.studentId)) {
        studentVaccinationMap.set(v.studentId, []);
      }
      studentVaccinationMap.get(v.studentId)!.push(v);
    });

    const overdueVaccinations = studentIds.filter((studentId) => {
      const vaccs = studentVaccinationMap.get(studentId) || [];
      return this.calculateVaccinationStatus(vaccs) === 'OVERDUE';
    });

    // Unmanaged chronic conditions (no care plan or inactive)
    const allActiveConditions = await this.chronicConditionModel.findAll({
      where: {
        studentId: { [Op.in]: studentIds },
        status: 'ACTIVE',
      },
      attributes: ['studentId', 'carePlan'],
    });

    const unmanagedConditions = allActiveConditions.filter(
      (condition) => !condition.carePlan || condition.carePlan.trim() === '',
    );

    return {
      criticalAllergies: {
        count: criticalAllergies.length,
        students: Array.from(
          new Set(criticalAllergies.map((a) => a.studentId)),
        ),
      },
      overdueVaccinations: {
        count: overdueVaccinations.length,
        students: overdueVaccinations,
      },
      unmanagedConditions: {
        count: unmanagedConditions.length,
        students: Array.from(
          new Set(unmanagedConditions.map((c) => c.studentId)),
        ),
      },
    };
  }

  // Private helper methods

  private calculateVaccinationStatus(vaccinations: any[]): string {
    // Simplified logic - in real implementation would check CDC requirements
    if (vaccinations.length === 0) return 'NONE';
    if (vaccinations.length < 5) return 'OVERDUE';
    if (vaccinations.length < 10) return 'PARTIAL';
    return 'COMPLIANT';
  }

  private calculateHealthRiskLevel(factors: {
    allergies: number;
    chronicConditions: number;
  }): string {
    const riskScore = factors.allergies * 2 + factors.chronicConditions * 3;
    if (riskScore === 0) return 'LOW';
    if (riskScore < 5) return 'MEDIUM';
    return 'HIGH';
  }

  private parseTimeframe(timeframe: string): number {
    const match = timeframe.match(/(\d+)\s*(day|week|month|year)s?/);
    if (!match) return 30; // Default 30 days

    const [, value, unit] = match;
    const multipliers: Record<string, number> = { day: 1, week: 7, month: 30, year: 365 };
    return parseInt(value) * (multipliers[unit] || 1);
  }

  private groupByDay(data: any[], dateField: string): any[] {
    const grouped = new Map<string, number>();

    data.forEach((item) => {
      const date = new Date(item[dateField]);
      const dateKey = date.toISOString().split('T')[0];
      grouped.set(dateKey, (grouped.get(dateKey) || 0) + 1);
    });

    return Array.from(grouped.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }

  private calculateTrend(data: any[]): string {
    if (data.length < 2) return 'insufficient_data';

    const counts = data.map((d) => d.count);
    const firstHalf = counts.slice(0, Math.floor(counts.length / 2));
    const secondHalf = counts.slice(Math.floor(counts.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (secondAvg > firstAvg * 1.1) return 'increasing';
    if (secondAvg < firstAvg * 0.9) return 'decreasing';
    return 'stable';
  }
}
