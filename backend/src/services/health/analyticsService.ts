/**
 * LOC: FAD12F86D8
 * WC-GEN-251 | analyticsService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - types.ts (services/health/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - healthRecordService.ts (services/health/healthRecordService.ts)
 */

/**
 * WC-GEN-251 | analyticsService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { 
  HealthRecord, 
  Allergy, 
  ChronicCondition, 
  Vaccination, 
  Student, 
  sequelize 
} from '../../database/models';
import { HealthStatistics } from './types';

/**
 * Analytics Service - Provides health record analytics and reporting
 */
export class AnalyticsService {
  /**
   * Get comprehensive health record statistics
   */
  static async getHealthRecordStatistics(): Promise<HealthStatistics> {
    try {
      const [
        totalRecords,
        activeAllergies,
        chronicConditions,
        vaccinationsDue,
        recentRecords
      ] = await Promise.all([
        HealthRecord.count(),
        Allergy.count({
          where: { verified: true }
        }),
        ChronicCondition.count({
          where: { status: 'ACTIVE' }
        }),
        HealthRecord.count({
          where: {
            recordType: 'VACCINATION' as any,
            createdAt: {
              [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
            }
          } as any
        }),
        HealthRecord.count({
          where: {
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        })
      ]);

      return {
        totalRecords,
        activeAllergies,
        chronicConditions,
        vaccinationsDue,
        recentRecords
      };
    } catch (error) {
      logger.error('Error getting health record statistics:', error);
      throw error;
    }
  }

  /**
   * Get health trends over time
   */
  static async getHealthTrends(startDate: Date, endDate: Date) {
    try {
      const monthlyData = await sequelize.query(`
        SELECT 
          DATE_TRUNC('month', "recordDate") as month,
          "recordType",
          COUNT(*) as count
        FROM health_records 
        WHERE "recordDate" BETWEEN :startDate AND :endDate
        GROUP BY DATE_TRUNC('month', "recordDate"), "recordType"
        ORDER BY month, "recordType"
      `, {
        replacements: { startDate, endDate },
        type: require('sequelize').QueryTypes.SELECT
      });

      const trends: Record<string, any[]> = {};
      
      monthlyData.forEach((record: any) => {
        if (!trends[record.recordType]) {
          trends[record.recordType] = [];
        }
        trends[record.recordType].push({
          month: record.month,
          count: parseInt(record.count, 10)
        });
      });

      return trends;
    } catch (error) {
      logger.error('Error getting health trends:', error);
      throw error;
    }
  }

  /**
   * Get allergy distribution analysis
   */
  static async getAllergyAnalytics() {
    try {
      const [
        severityDistribution,
        topAllergens,
        verificationStatus,
        ageGroupAnalysis
      ] = await Promise.all([
        // Severity distribution
        Allergy.findAll({
          attributes: [
            'severity',
            [sequelize.fn('COUNT', sequelize.col('severity')), 'count']
          ],
          group: ['severity'],
          raw: true
        }),

        // Top allergens
        Allergy.findAll({
          attributes: [
            'allergen',
            [sequelize.fn('COUNT', sequelize.col('allergen')), 'count']
          ],
          group: ['allergen'],
          order: [[sequelize.fn('COUNT', sequelize.col('allergen')), 'DESC']],
          limit: 10,
          raw: true
        }),

        // Verification status
        Allergy.findAll({
          attributes: [
            'verified',
            [sequelize.fn('COUNT', sequelize.col('verified')), 'count']
          ],
          group: ['verified'],
          raw: true
        }),

        // Age group analysis (simplified)
        sequelize.query(`
          SELECT 
            CASE 
              WHEN EXTRACT(YEAR FROM AGE(s."dateOfBirth")) < 6 THEN 'Elementary'
              WHEN EXTRACT(YEAR FROM AGE(s."dateOfBirth")) < 12 THEN 'Middle School'
              ELSE 'High School'
            END as age_group,
            COUNT(a.id) as allergy_count
          FROM allergies a
          JOIN students s ON a."studentId" = s.id
          WHERE s."dateOfBirth" IS NOT NULL
          GROUP BY age_group
          ORDER BY allergy_count DESC
        `, {
          type: require('sequelize').QueryTypes.SELECT
        })
      ]);

      return {
        severityDistribution: severityDistribution.map((item: any) => ({
          severity: item.severity,
          count: parseInt(item.count, 10)
        })),
        topAllergens: topAllergens.map((item: any) => ({
          allergen: item.allergen,
          count: parseInt(item.count, 10)
        })),
        verificationStatus: verificationStatus.map((item: any) => ({
          verified: item.verified,
          count: parseInt(item.count, 10)
        })),
        ageGroupAnalysis: ageGroupAnalysis.map((item: any) => ({
          ageGroup: item.age_group,
          count: parseInt(item.allergy_count, 10)
        }))
      };
    } catch (error) {
      logger.error('Error getting allergy analytics:', error);
      throw error;
    }
  }

  /**
   * Get vaccination compliance analytics
   */
  static async getVaccinationAnalytics() {
    try {
      const [
        completionRates,
        vaccineTypes,
        complianceByGrade,
        monthlyVaccinations
      ] = await Promise.all([
        // Series completion rates
        Vaccination.findAll({
          attributes: [
            'seriesComplete',
            [sequelize.fn('COUNT', sequelize.col('seriesComplete')), 'count']
          ],
          group: ['seriesComplete'],
          raw: true
        }),

        // Vaccine type distribution  
        Vaccination.findAll({
          attributes: [
            'vaccineName',
            [sequelize.fn('COUNT', sequelize.col('vaccineName')), 'count']
          ],
          group: ['vaccineName'],
          order: [[sequelize.fn('COUNT', sequelize.col('vaccineName')), 'DESC']],
          limit: 10,
          raw: true
        }),

        // Compliance by grade
        sequelize.query(`
          SELECT 
            s.grade,
            COUNT(v.id) as vaccination_count,
            COUNT(DISTINCT s.id) as student_count
          FROM students s
          LEFT JOIN vaccinations v ON s.id = v."studentId"
          WHERE s.grade IS NOT NULL
          GROUP BY s.grade
          ORDER BY s.grade
        `, {
          type: require('sequelize').QueryTypes.SELECT
        }),

        // Monthly vaccination trends
        sequelize.query(`
          SELECT 
            DATE_TRUNC('month', "administrationDate") as month,
            COUNT(*) as count
          FROM vaccinations 
          WHERE "administrationDate" >= NOW() - INTERVAL '12 months'
          GROUP BY DATE_TRUNC('month', "administrationDate")
          ORDER BY month
        `, {
          type: require('sequelize').QueryTypes.SELECT
        })
      ]);

      return {
        completionRates: completionRates.map((item: any) => ({
          seriesComplete: item.seriesComplete,
          count: parseInt(item.count, 10)
        })),
        vaccineTypes: vaccineTypes.map((item: any) => ({
          vaccine: item.vaccineName,
          count: parseInt(item.count, 10)
        })),
        complianceByGrade: complianceByGrade.map((item: any) => ({
          grade: item.grade,
          vaccinationCount: parseInt(item.vaccination_count, 10),
          studentCount: parseInt(item.student_count, 10),
          averageVaccinationsPerStudent: item.student_count > 0 
            ? parseFloat((item.vaccination_count / item.student_count).toFixed(2))
            : 0
        })),
        monthlyTrends: monthlyVaccinations.map((item: any) => ({
          month: item.month,
          count: parseInt(item.count, 10)
        }))
      };
    } catch (error) {
      logger.error('Error getting vaccination analytics:', error);
      throw error;
    }
  }

  /**
   * Get chronic conditions analytics
   */
  static async getChronicConditionsAnalytics() {
    try {
      const [
        statusDistribution,
        severityDistribution,
        topConditions,
        reviewStatus
      ] = await Promise.all([
        // Status distribution
        ChronicCondition.findAll({
          attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('status')), 'count']
          ],
          group: ['status'],
          raw: true
        }),

        // Severity distribution
        ChronicCondition.findAll({
          attributes: [
            'severity',
            [sequelize.fn('COUNT', sequelize.col('severity')), 'count']
          ],
          group: ['severity'],
          raw: true
        }),

        // Top conditions
        ChronicCondition.findAll({
          attributes: [
            'condition',
            [sequelize.fn('COUNT', sequelize.col('condition')), 'count']
          ],
          where: { status: 'ACTIVE' },
          group: ['condition'],
          order: [[sequelize.fn('COUNT', sequelize.col('condition')), 'DESC']],
          limit: 10,
          raw: true
        }),

        // Review status
        sequelize.query(`
          SELECT 
            CASE 
              WHEN "lastReviewDate" IS NULL THEN 'Never Reviewed'
              WHEN "lastReviewDate" < NOW() - INTERVAL '1 year' THEN 'Review Overdue'
              WHEN "nextReviewDate" <= NOW() THEN 'Review Due'
              ELSE 'Up to Date'
            END as review_status,
            COUNT(*) as count
          FROM chronic_conditions
          WHERE status = 'ACTIVE'
          GROUP BY review_status
        `, {
          type: require('sequelize').QueryTypes.SELECT
        })
      ]);

      return {
        statusDistribution: statusDistribution.map((item: any) => ({
          status: item.status,
          count: parseInt(item.count, 10)
        })),
        severityDistribution: severityDistribution.map((item: any) => ({
          severity: item.severity,
          count: parseInt(item.count, 10)
        })),
        topConditions: topConditions.map((item: any) => ({
          condition: item.condition,
          count: parseInt(item.count, 10)
        })),
        reviewStatus: reviewStatus.map((item: any) => ({
          status: item.review_status,
          count: parseInt(item.count, 10)
        }))
      };
    } catch (error) {
      logger.error('Error getting chronic conditions analytics:', error);
      throw error;
    }
  }

  /**
   * Get vital signs analytics and trends
   */
  static async getVitalSignsAnalytics() {
    try {
      const vitalSignsData = await sequelize.query(`
        SELECT 
          (vital->>'temperature')::float as temperature,
          (vital->>'heartRate')::float as heart_rate,
          (vital->>'bloodPressureSystolic')::float as systolic_bp,
          (vital->>'bloodPressureDiastolic')::float as diastolic_bp,
          (vital->>'height')::float as height,
          (vital->>'weight')::float as weight,
          (vital->>'bmi')::float as bmi,
          "recordDate",
          EXTRACT(YEAR FROM AGE(s."dateOfBirth", hr."recordDate")) as age_at_measurement
        FROM health_records hr
        JOIN students s ON hr."studentId" = s.id
        WHERE hr.vital IS NOT NULL 
        AND s."dateOfBirth" IS NOT NULL
        AND hr."recordDate" >= NOW() - INTERVAL '2 years'
      `, {
        type: require('sequelize').QueryTypes.SELECT
      });

      // Calculate statistics for each vital sign
      const vitalTypes = ['temperature', 'heart_rate', 'systolic_bp', 'diastolic_bp', 'height', 'weight', 'bmi'];
      const analytics: Record<string, any> = {};

      vitalTypes.forEach(vitalType => {
        const values = vitalSignsData
          .map((record: any) => record[vitalType])
          .filter((value: any) => value !== null && !isNaN(value));

        if (values.length > 0) {
          const sorted = values.sort((a: number, b: number) => a - b);
          analytics[vitalType] = {
            count: values.length,
            min: sorted[0],
            max: sorted[sorted.length - 1],
            mean: values.reduce((sum: number, val: number) => sum + val, 0) / values.length,
            median: sorted[Math.floor(sorted.length / 2)],
            percentile25: sorted[Math.floor(sorted.length * 0.25)],
            percentile75: sorted[Math.floor(sorted.length * 0.75)]
          };
        }
      });

      // Age group analysis for BMI
      const bmiByAgeGroup = await sequelize.query(`
        SELECT 
          CASE 
            WHEN EXTRACT(YEAR FROM AGE(s."dateOfBirth", hr."recordDate")) < 6 THEN 'Under 6'
            WHEN EXTRACT(YEAR FROM AGE(s."dateOfBirth", hr."recordDate")) < 12 THEN '6-11'
            WHEN EXTRACT(YEAR FROM AGE(s."dateOfBirth", hr."recordDate")) < 18 THEN '12-17'
            ELSE '18+'
          END as age_group,
          AVG((vital->>'bmi')::float) as avg_bmi,
          COUNT(*) as count
        FROM health_records hr
        JOIN students s ON hr."studentId" = s.id
        WHERE hr.vital->>'bmi' IS NOT NULL 
        AND s."dateOfBirth" IS NOT NULL
        GROUP BY age_group
        ORDER BY age_group
      `, {
        type: require('sequelize').QueryTypes.SELECT
      });

      return {
        vitalSignsStatistics: analytics,
        bmiByAgeGroup: bmiByAgeGroup.map((item: any) => ({
          ageGroup: item.age_group,
          averageBMI: parseFloat(item.avg_bmi).toFixed(2),
          count: parseInt(item.count, 10)
        })),
        totalMeasurements: vitalSignsData.length
      };
    } catch (error) {
      logger.error('Error getting vital signs analytics:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive health dashboard data
   */
  static async getHealthDashboard() {
    try {
      const [
        overallStats,
        allergyStats,
        vaccinationStats,
        chronicConditionStats,
        recentActivity
      ] = await Promise.all([
        this.getHealthRecordStatistics(),
        this.getAllergyAnalytics(),
        this.getVaccinationAnalytics(),
        this.getChronicConditionsAnalytics(),
        this.getRecentHealthActivity()
      ]);

      return {
        overview: overallStats,
        allergies: allergyStats,
        vaccinations: vaccinationStats,
        chronicConditions: chronicConditionStats,
        recentActivity,
        generatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error generating health dashboard:', error);
      throw error;
    }
  }

  /**
   * Get recent health activity
   */
  static async getRecentHealthActivity(limit: number = 20) {
    try {
      const recentRecords = await HealthRecord.findAll({
        limit,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        attributes: ['id', 'recordType', 'title', 'recordDate', 'createdAt']
      });

      const recentAllergies = await Allergy.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        attributes: ['id', 'allergen', 'severity', 'createdAt']
      });

      const recentVaccinations = await Vaccination.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        attributes: ['id', 'vaccineName', 'administrationDate', 'createdAt']
      });

      return {
        healthRecords: recentRecords.map(record => ({
          ...record.get({ plain: true }),
          type: 'health_record'
        })),
        allergies: recentAllergies.map(allergy => ({
          ...allergy.get({ plain: true }),
          type: 'allergy'
        })),
        vaccinations: recentVaccinations.map(vaccination => ({
          ...vaccination.get({ plain: true }),
          type: 'vaccination'
        }))
      };
    } catch (error) {
      logger.error('Error getting recent health activity:', error);
      throw error;
    }
  }

  /**
   * Get health compliance report
   */
  static async getHealthComplianceReport() {
    try {
      const [
        totalStudents,
        studentsWithAllergies,
        studentsWithConditions,
        fullyVaccinatedStudents,
        studentsNeedingAttention
      ] = await Promise.all([
        Student.count({ where: { isActive: true } }),
        
        Student.count({
          where: { isActive: true },
          include: [{ model: Allergy, as: 'allergies', required: true }]
        }),

        Student.count({
          where: { isActive: true },
          include: [{ 
            model: ChronicCondition, 
            as: 'chronicConditions', 
            where: { status: 'ACTIVE' },
            required: true 
          }]
        }),

        // Simplified vaccination compliance check
        Student.count({
          where: { isActive: true },
          include: [{
            model: Vaccination,
            as: 'vaccinations',
            where: { seriesComplete: true },
            required: true
          }]
        }),

        // Students needing attention (critical conditions, severe allergies, etc.)
        sequelize.query(`
          SELECT COUNT(DISTINCT s.id) as count
          FROM students s
          WHERE s."isActive" = true
          AND (
            EXISTS (
              SELECT 1 FROM allergies a 
              WHERE a."studentId" = s.id 
              AND a.severity IN ('SEVERE', 'LIFE_THREATENING')
            )
            OR EXISTS (
              SELECT 1 FROM chronic_conditions cc 
              WHERE cc."studentId" = s.id 
              AND cc.status = 'ACTIVE'
              AND cc.severity IN ('SEVERE', 'CRITICAL')
            )
          )
        `, {
          type: require('sequelize').QueryTypes.SELECT
        })
      ]);

      const needingAttentionCount = (studentsNeedingAttention as any[])[0]?.count || 0;

      return {
        totalStudents,
        healthMetrics: {
          studentsWithAllergies,
          studentsWithConditions,
          fullyVaccinatedStudents,
          studentsNeedingAttention: parseInt(needingAttentionCount, 10)
        },
        complianceRates: {
          allergyDocumentation: ((studentsWithAllergies / totalStudents) * 100).toFixed(1),
          conditionManagement: ((studentsWithConditions / totalStudents) * 100).toFixed(1),
          vaccinationCompliance: ((fullyVaccinatedStudents / totalStudents) * 100).toFixed(1),
          highRiskStudents: ((parseInt(needingAttentionCount, 10) / totalStudents) * 100).toFixed(1)
        }
      };
    } catch (error) {
      logger.error('Error generating health compliance report:', error);
      throw error;
    }
  }

  /**
   * Generate monthly health summary report
   */
  static async getMonthlyHealthSummary(year: number, month: number) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const [
        newRecords,
        newAllergies,
        newVaccinations,
        newConditions,
        emergencyContacts
      ] = await Promise.all([
        HealthRecord.count({
          where: {
            createdAt: { [Op.between]: [startDate, endDate] }
          }
        }),

        Allergy.count({
          where: {
            createdAt: { [Op.between]: [startDate, endDate] }
          }
        }),

        Vaccination.count({
          where: {
            administrationDate: { [Op.between]: [startDate, endDate] }
          }
        }),

        ChronicCondition.count({
          where: {
            createdAt: { [Op.between]: [startDate, endDate] }
          }
        }),

        // Critical incidents or emergency-related records
        HealthRecord.count({
          where: {
            recordType: ['INJURY', 'ILLNESS'],
            recordDate: { [Op.between]: [startDate, endDate] },
            title: { [Op.iLike]: '%emergency%' }
          } as any
        })
      ]);

      return {
        period: {
          year,
          month,
          monthName: new Date(year, month - 1).toLocaleString('default', { month: 'long' })
        },
        summary: {
          newHealthRecords: newRecords,
          newAllergiesRecorded: newAllergies,
          vaccinationsAdministered: newVaccinations,
          newChronicConditions: newConditions,
          emergencyIncidents: emergencyContacts
        },
        generatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error generating monthly health summary:', error);
      throw error;
    }
  }
}
