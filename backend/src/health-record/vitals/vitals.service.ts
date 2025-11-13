/**
 * @fileoverview Vitals Service
 * @module health-record/vitals
 * @description Vital signs tracking and monitoring with BMI calculation and growth charts
 * HIPAA Compliance: All vital signs data is PHI and requires audit logging
 */

import { BadRequestException, Injectable, NotFoundException, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { VitalSigns   } from "../../database/models";
import { Student   } from "../../database/models";

@Injectable()
export class VitalsService extends BaseService {
  constructor(
    @Inject(LoggerService) logger: LoggerService,
    @InjectModel(VitalSigns)
    private readonly vitalSignsModel: typeof VitalSigns,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {
    super({
      serviceName: 'VitalsService',
      logger,
      enableAuditLogging: true,
    });
  }

  async recordVitals(data: any): Promise<VitalSigns> {
    this.logInfo(`Recording vitals for student ${data.studentId}`);

    // Verify student exists
    const student = await this.studentModel.findByPk(data.studentId);
    if (!student) {
      throw new BadRequestException(
        `Student with ID ${data.studentId} not found`,
      );
    }

    // Calculate BMI if height and weight provided
    let bmi: number | null = null;
    let isAbnormal = false;
    const abnormalFlags: string[] = [];

    if (data.height && data.weight) {
      // BMI = weight(kg) / (height(m))^2
      const heightInMeters =
        data.heightUnit === 'cm' ? data.height / 100 : data.height;
      const weightInKg =
        data.weightUnit === 'lbs' ? data.weight * 0.453592 : data.weight;
      bmi = parseFloat(
        (weightInKg / (heightInMeters * heightInMeters)).toFixed(2),
      );

      // Check BMI range (simplified pediatric ranges)
      if (bmi < 14 || bmi > 30) {
        isAbnormal = true;
        abnormalFlags.push('BMI_OUT_OF_RANGE');
      }
    }

    // Check blood pressure
    if (data.bloodPressureSystolic && data.bloodPressureDiastolic) {
      if (
        data.bloodPressureSystolic > 130 ||
        data.bloodPressureDiastolic > 90
      ) {
        isAbnormal = true;
        abnormalFlags.push('HIGH_BLOOD_PRESSURE');
      }
    }

    // Check heart rate
    if (data.heartRate) {
      if (data.heartRate > 120 || data.heartRate < 60) {
        isAbnormal = true;
        abnormalFlags.push('ABNORMAL_HEART_RATE');
      }
    }

    // Check temperature
    if (data.temperature) {
      const temp =
        data.temperatureUnit === 'F'
          ? ((data.temperature - 32) * 5) / 9
          : data.temperature;
      if (temp > 38 || temp < 35) {
        isAbnormal = true;
        abnormalFlags.push('ABNORMAL_TEMPERATURE');
      }
    }

    // Check oxygen saturation
    if (data.oxygenSaturation && data.oxygenSaturation < 95) {
      isAbnormal = true;
      abnormalFlags.push('LOW_OXYGEN_SATURATION');
    }

    const vital = await this.vitalSignsModel.create({
      ...data,
      bmi,
      isAbnormal,
      abnormalFlags,
    });

    this.logInfo(
      `PHI Created: Vital signs recorded for student ${data.studentId}`,
    );
    return vital;
  }

  async getVitalsHistory(
    studentId: string,
    limit?: number,
  ): Promise<VitalSigns[]> {
    this.logInfo(
      `Getting vitals history for student ${studentId}, limit: ${limit || 'all'}`,
    );

    // Verify student exists
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const queryOptions: any = {
      where: { studentId },
      order: [['measurementDate', 'DESC']],
    };

    if (limit) {
      queryOptions.limit = limit;
    }

    return await this.vitalSignsModel.findAll(queryOptions);
  }

  async detectAnomalies(studentId: string): Promise<any> {
    this.logInfo(`Detecting vital sign anomalies for student ${studentId}`);

    const history = await this.getVitalsHistory(studentId, 10); // Last 10 measurements

    if (history.length === 0) {
      return { anomalies: [], warnings: [] };
    }

    const anomalies: any[] = [];
    const warnings: any[] = [];

    // Check for abnormal readings in recent measurements
    const recentAbnormal = history.filter((v) => v.isAbnormal);
    if (recentAbnormal.length > 0) {
      anomalies.push({
        type: 'RECENT_ABNORMAL_READINGS',
        count: recentAbnormal.length,
        message: `${recentAbnormal.length} recent measurements show abnormalities`,
        severity: 'HIGH',
        flags: [...new Set(recentAbnormal.flatMap((v) => v.abnormalFlags))],
      });
    }

    // Check for trends (simplified)
    if (history.length >= 3) {
      const recent = history.slice(0, 3);
      const tempReadings = recent.filter(
        (v) => v.temperature !== null && v.temperature !== undefined,
      );
      if (tempReadings.length > 0) {
        const avgTemp =
          tempReadings.reduce((sum, v) => sum + (v.temperature || 0), 0) /
          tempReadings.length;

        if (avgTemp > 37.5) {
          warnings.push({
            type: 'ELEVATED_TEMPERATURE_TREND',
            value: avgTemp.toFixed(1),
            message: 'Recent temperature readings are elevated',
            severity: 'MEDIUM',
          });
        }
      }
    }

    return { anomalies, warnings };
  }

  /**
   * Get latest vital signs for a student
   */
  async getLatest(studentId: string): Promise<VitalSigns | null> {
    this.logInfo(`Getting latest vitals for student ${studentId}`);

    const history = await this.getVitalsHistory(studentId, 1);
    return history[0] || null;
  }

  /**
   * Get growth chart data (height/weight over time)
   */
  async getGrowthChart(studentId: string): Promise<any> {
    this.logInfo(`Getting growth chart data for student ${studentId}`);

    const vitals = await this.vitalSignsModel.findAll({
      where: {
        studentId,
      },
      order: [['measurementDate', 'ASC']],
    });

    // Filter for records with height or weight
    const growthVitals = vitals.filter(
      (v) => v.height !== null || v.weight !== null,
    );

    const growthData = growthVitals.map((v) => ({
      date: v.measurementDate,
      height: v.height,
      heightUnit: v.heightUnit,
      weight: v.weight,
      weightUnit: v.weightUnit,
      bmi: v.bmi,
    }));

    return {
      studentId,
      dataPoints: growthData,
      totalMeasurements: growthData.length,
    };
  }

  /**
   * Calculate BMI percentile for age (simplified)
   */
  calculateBMIPercentile(
    bmi: number,
    ageInMonths: number,
    gender: 'M' | 'F',
  ): any {
    // This is a simplified version - real implementation would use CDC growth charts
    this.logInfo(
      `Calculating BMI percentile for BMI ${bmi}, age ${ageInMonths} months, gender ${gender}`,
    );

    // Rough approximations for demonstration
    let percentile = 50; // Default to 50th percentile

    if (bmi < 16) percentile = 5;
    else if (bmi < 17) percentile = 10;
    else if (bmi < 18.5) percentile = 25;
    else if (bmi < 25) percentile = 50;
    else if (bmi < 30) percentile = 85;
    else if (bmi < 35) percentile = 95;
    else percentile = 99;

    return {
      bmi,
      percentile,
      category: this.getBMICategory(percentile),
    };
  }

  /**
   * Get BMI category based on percentile
   */
  private getBMICategory(percentile: number): string {
    if (percentile < 5) return 'UNDERWEIGHT';
    if (percentile < 85) return 'HEALTHY_WEIGHT';
    if (percentile < 95) return 'OVERWEIGHT';
    return 'OBESE';
  }

  /**
   * Get vital signs trends
   */
  async getTrends(
    studentId: string,
    metric: string,
    days: number = 30,
  ): Promise<any> {
    this.logInfo(
      `Getting ${metric} trends for student ${studentId} over ${days} days`,
    );

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const vitals = await this.vitalSignsModel.findAll({
      where: {
        studentId,
        measurementDate: {
          [Op.gte]: cutoffDate,
        },
        [metric]: {
          [Op.ne]: null,
        },
      },
      order: [['measurementDate', 'ASC']],
    });

    const values = vitals.map((v: any) => v[metric]).filter((v: any) => v !== null);
    const average =
      values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const min = values.length > 0 ? Math.min(...values) : 0;
    const max = values.length > 0 ? Math.max(...values) : 0;

    return {
      metric,
      period: `${days} days`,
      dataPoints: vitals.map((v: any) => ({
        date: v.measurementDate,
        value: v[metric],
      })),
      statistics: {
        average: average.toFixed(2),
        min,
        max,
        count: values.length,
      },
    };
  }

  /**
   * Get abnormal vital signs for review
   */
  async getAbnormalVitals(
    studentId?: string,
    days: number = 7,
  ): Promise<VitalSigns[]> {
    this.logInfo(
      `Getting abnormal vitals${studentId ? ` for student ${studentId}` : ''} over ${days} days`,
    );

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const whereClause: any = {
      isAbnormal: true,
      measurementDate: {
        [Op.gte]: cutoffDate,
      },
    };

    if (studentId) {
      whereClause.studentId = studentId;
    }

    return await this.vitalSignsModel.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['measurementDate', 'DESC']],
    });
  }

  /**
   * Get vital signs summary statistics
   */
  async getVitalsSummary(studentId: string): Promise<any> {
    this.logInfo(`Getting vitals summary for student ${studentId}`);

    const vitals = await this.vitalSignsModel.findAll({
      where: { studentId },
      order: [['measurementDate', 'DESC']],
    });

    if (vitals.length === 0) {
      return {
        studentId,
        totalMeasurements: 0,
        averageVitals: {
          temperature: null,
          heartRate: null,
          bloodPressure: null,
          oxygenSaturation: null,
          bmi: null,
        },
        lastMeasurementDate: null,
        abnormalCount: 0,
      };
    }

    // Calculate averages manually
    const tempReadings = vitals
      .filter((v) => v.temperature !== null)
      .map((v) => v.temperature!);
    const heartRateReadings = vitals
      .filter((v) => v.heartRate !== null)
      .map((v) => v.heartRate!);
    const systolicReadings = vitals
      .filter((v) => v.bloodPressureSystolic !== null)
      .map((v) => v.bloodPressureSystolic!);
    const diastolicReadings = vitals
      .filter((v) => v.bloodPressureDiastolic !== null)
      .map((v) => v.bloodPressureDiastolic!);
    const oxygenReadings = vitals
      .filter((v) => v.oxygenSaturation !== null)
      .map((v) => v.oxygenSaturation!);
    const bmiReadings = vitals.filter((v) => v.bmi !== null).map((v) => v.bmi!);

    const avgTemp =
      tempReadings.length > 0
        ? tempReadings.reduce((a, b) => a + b, 0) / tempReadings.length
        : null;
    const avgHeartRate =
      heartRateReadings.length > 0
        ? heartRateReadings.reduce((a, b) => a + b, 0) /
          heartRateReadings.length
        : null;
    const avgSystolic =
      systolicReadings.length > 0
        ? systolicReadings.reduce((a, b) => a + b, 0) / systolicReadings.length
        : null;
    const avgDiastolic =
      diastolicReadings.length > 0
        ? diastolicReadings.reduce((a, b) => a + b, 0) /
          diastolicReadings.length
        : null;
    const avgOxygen =
      oxygenReadings.length > 0
        ? oxygenReadings.reduce((a, b) => a + b, 0) / oxygenReadings.length
        : null;
    const avgBMI =
      bmiReadings.length > 0
        ? bmiReadings.reduce((a, b) => a + b, 0) / bmiReadings.length
        : null;

    const abnormalCount = vitals.filter((v) => v.isAbnormal).length;

    return {
      studentId,
      totalMeasurements: vitals.length,
      averageVitals: {
        temperature: avgTemp ? parseFloat(avgTemp.toFixed(1)) : null,
        heartRate: avgHeartRate ? Math.round(avgHeartRate) : null,
        bloodPressure:
          avgSystolic && avgDiastolic
            ? `${Math.round(avgSystolic)}/${Math.round(avgDiastolic)}`
            : null,
        oxygenSaturation: avgOxygen ? Math.round(avgOxygen) : null,
        bmi: avgBMI ? parseFloat(avgBMI.toFixed(1)) : null,
      },
      lastMeasurementDate: vitals[0].measurementDate,
      abnormalCount,
    };
  }
}
