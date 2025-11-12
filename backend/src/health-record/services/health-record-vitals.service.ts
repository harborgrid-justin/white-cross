/**
 * @fileoverview Health Record Vitals Service - Growth and Vital Signs Management
 * @module health-record/services
 * @description Service providing growth tracking and vital signs management operations.
 * Handles growth chart data, BMI calculations, and vital signs retrieval with
 * HIPAA-compliant audit logging.
 *
 * HIPAA CRITICAL - This service manages Protected Health Information (PHI)
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { HealthRecord   } from "../../database/models";
import { GrowthDataPoint } from '../interfaces/pagination.interface';
import { VitalSigns } from '../interfaces/vital-signs.interface';

/**
 * HealthRecordVitalsService
 *
 * Provides growth tracking and vital signs management operations with BMI calculations,
 * growth chart data compilation, and HIPAA-compliant audit logging.
 *
 * Responsibilities:
 * - Generate growth chart data (height/weight over time)
 * - Calculate BMI from height and weight measurements
 * - Retrieve recent vital signs measurements
 * - Extract vital signs from health record metadata
 */
@Injectable()
export class HealthRecordVitalsService {
  private readonly logger = new Logger(HealthRecordVitalsService.name);

  constructor(
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
  ) {}

  /**
   * Get growth chart data for student (height/weight over time)
   * @param studentId - Student UUID
   * @returns Array of growth data points
   */
  async getGrowthChartData(studentId: string): Promise<GrowthDataPoint[]> {
    // Query health records with vital signs metadata using Sequelize
    const records = await this.healthRecordModel.findAll({
      where: {
        studentId,
        [Op.or]: [
          { metadata: { height: { [Op.ne]: null } } },
          { metadata: { weight: { [Op.ne]: null } } },
        ],
      },
      order: [['recordDate', 'ASC']],
    });

    // Extract growth data points
    const growthData: GrowthDataPoint[] = records
      .map((record) => {
        const height = record.metadata?.height
          ? parseFloat(record.metadata.height)
          : undefined;
        const weight = record.metadata?.weight
          ? parseFloat(record.metadata.weight)
          : undefined;

        // Calculate BMI if both height and weight available
        let bmi: number | undefined;
        if (height && weight) {
          // BMI = weight (kg) / (height (m))^2
          const heightInMeters = height / 100;
          bmi = parseFloat(
            (weight / (heightInMeters * heightInMeters)).toFixed(1),
          );
        }

        return {
          date: record.recordDate,
          height,
          weight,
          bmi,
          recordType: record.recordType,
        };
      })
      .filter(
        (point) => point.height !== undefined || point.weight !== undefined,
      );

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Growth chart data retrieved for student ${studentId}, data points: ${growthData.length}`,
    );

    return growthData;
  }

  /**
   * Get recent vital signs for student
   * @param studentId - Student UUID
   * @param limit - Number of records to retrieve
   * @returns Array of recent vital signs
   */
  async getRecentVitals(
    studentId: string,
    limit: number = 10,
  ): Promise<VitalSigns[]> {
    const records = await this.healthRecordModel.findAll({
      where: {
        studentId,
        recordType: {
          [Op.in]: ['VITAL_SIGNS_CHECK', 'CHECKUP', 'PHYSICAL_EXAM'],
        },
      },
      order: [['recordDate', 'DESC']],
      limit,
    });

    // Extract vital signs from metadata
    const vitals: VitalSigns[] = records
      .map((record) => ({
        studentId,
        measurementDate: record.recordDate,
        isAbnormal: false, // Default value
        temperature: record.metadata?.temperature,
        bloodPressureSystolic: record.metadata?.bloodPressureSystolic,
        bloodPressureDiastolic: record.metadata?.bloodPressureDiastolic,
        heartRate: record.metadata?.heartRate,
        respiratoryRate: record.metadata?.respiratoryRate,
        oxygenSaturation: record.metadata?.oxygenSaturation,
        height: record.metadata?.height,
        weight: record.metadata?.weight,
        bmi: record.metadata?.bmi,
      }))
      .filter((vital) => Object.values(vital).some((v) => v !== undefined));

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Recent vitals retrieved for student ${studentId}, count: ${vitals.length}`,
    );

    return vitals;
  }
}
