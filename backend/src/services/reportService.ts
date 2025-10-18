/**
 * WC-GEN-291 | reportService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../utils/logger, ../database/models, ../database/types/enums | Dependencies: sequelize, ../utils/logger, ../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op, fn, col, literal, QueryTypes } from 'sequelize';
import { logger } from '../utils/logger';
import {
  sequelize,
  HealthRecord,
  Allergy,
  ChronicCondition,
  Student,
  MedicationLog,
  StudentMedication,
  Medication,
  User,
  IncidentReport,
  Appointment,
  InventoryItem,
  AuditLog,
  PerformanceMetric
} from '../database/models';
import {
  HealthRecordType,
  AllergySeverity,
  IncidentType,
  IncidentSeverity,
  ComplianceStatus,
  AppointmentStatus,
  MetricType,
  AuditAction
} from '../database/types/enums';

/**
 * Report Data Transfer Objects (DTOs)
 */

export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

export interface HealthTrendsReport {
  healthRecords: Array<{ type: HealthRecordType; count: number }>;
  chronicConditions: Array<{ condition: string; count: number }>;
  allergies: Array<{ allergen: string; severity: AllergySeverity; count: number }>;
  monthlyTrends: Array<{ month: Date; type: HealthRecordType; count: number }>;
}

export interface MedicationUsageReport {
  administrationLogs: MedicationLog[];
  totalScheduled: number;
  totalLogs: number;
  topMedications: Array<{ medicationName: string; count: number }>;
  adverseReactions: MedicationLog[];
}

export interface IncidentStatisticsReport {
  incidents: IncidentReport[];
  incidentsByType: Array<{ type: IncidentType; count: number }>;
  incidentsBySeverity: Array<{ severity: IncidentSeverity; count: number }>;
  incidentsByMonth: Array<{ month: Date; type: IncidentType; count: number }>;
  injuryStats: Array<{ type: IncidentType; severity: IncidentSeverity; count: number }>;
  notificationStats: Array<{ parentNotified: boolean; count: number }>;
  complianceStats: Array<{ legalComplianceStatus: ComplianceStatus; count: number }>;
  totalIncidents: number;
}

export interface AttendanceCorrelationReport {
  healthVisits: Array<{ studentId: string; count: number; student: Student }>;
  incidentVisits: Array<{ studentId: string; count: number; student: Student }>;
  chronicStudents: ChronicCondition[];
  appointmentFrequency: Array<{ studentId: string; count: number; student: Student }>;
}

export interface DashboardMetrics {
  activeStudents: number;
  todaysAppointments: number;
  pendingMedications: number;
  recentIncidents: number;
  lowStockItems: number;
  activeAllergies: number;
  chronicConditions: number;
  timestamp: Date;
}

export interface ComplianceReport {
  hipaaLogs: AuditLog[];
  medicationCompliance: Array<{ isActive: boolean; count: number }>;
  incidentCompliance: Array<{ legalComplianceStatus: ComplianceStatus; count: number }>;
  vaccinationRecords: number;
}

export interface ReportFilters extends Record<string, unknown> {
  startDate?: Date | string;
  endDate?: Date | string;
}

export class ReportService {
  // ==================== Health Trend Analysis ====================

  /**
   * Get comprehensive health trends with grouping and monthly analysis
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Aggregated health trend data
   */
  static async getHealthTrends(startDate?: Date, endDate?: Date): Promise<HealthTrendsReport> {
    try {
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt[Op.gte] = startDate;
        if (endDate) whereClause.createdAt[Op.lte] = endDate;
      }

      // Get health records summary grouped by type
      const healthRecordsRaw = await HealthRecord.findAll({
        where: whereClause,
        attributes: [
          'type',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['type'],
        raw: true
      });

      const healthRecords = healthRecordsRaw.map((record: any) => ({
        type: record.type as HealthRecordType,
        count: parseInt(record.count, 10)
      }));

      // Get chronic conditions trends (top 10)
      const chronicConditionsRaw = await ChronicCondition.findAll({
        attributes: [
          'condition',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['condition'],
        order: [[literal('count'), 'DESC']],
        limit: 10,
        raw: true
      });

      const chronicConditions = chronicConditionsRaw.map((record: any) => ({
        condition: record.condition,
        count: parseInt(record.count, 10)
      }));

      // Get allergies summary (top 10)
      const allergiesRaw = await Allergy.findAll({
        attributes: [
          'allergen',
          'severity',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['allergen', 'severity'],
        order: [[literal('"count"'), 'DESC']],
        limit: 10,
        raw: true
      });

      const allergies = allergiesRaw.map((record: any) => ({
        allergen: record.allergen,
        severity: record.severity as AllergySeverity,
        count: parseInt(record.count, 10)
      }));

      // Get monthly health record trends using raw SQL for date truncation
      const defaultStartDate = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 12 months ago
      const defaultEndDate = endDate || new Date();

      const monthlyTrendsRaw = await sequelize.query<{
        month: Date;
        type: HealthRecordType;
        count: number;
      }>(
        `SELECT
          DATE_TRUNC('month', "createdAt") as month,
          type,
          COUNT(*)::integer as count
        FROM health_records
        WHERE "createdAt" >= :startDate
          AND "createdAt" <= :endDate
        GROUP BY month, type
        ORDER BY month DESC`,
        {
          replacements: {
            startDate: defaultStartDate,
            endDate: defaultEndDate
          },
          type: QueryTypes.SELECT
        }
      );

      const monthlyTrends = monthlyTrendsRaw.map(record => ({
        month: new Date(record.month),
        type: record.type,
        count: parseInt(String(record.count), 10)
      }));

      return {
        healthRecords,
        chronicConditions,
        allergies,
        monthlyTrends
      };
    } catch (error) {
      logger.error('Error getting health trends:', error);
      throw error;
    }
  }

  // ==================== Medication Usage & Compliance ====================

  /**
   * Generate comprehensive medication usage and compliance report
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Medication usage statistics and compliance data
   */
  static async getMedicationUsageReport(startDate?: Date, endDate?: Date): Promise<MedicationUsageReport> {
    try {
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.timeGiven = {};
        if (startDate) whereClause.timeGiven[Op.gte] = startDate;
        if (endDate) whereClause.timeGiven[Op.lte] = endDate;
      }

      // Get medication administration logs with full details
      const administrationLogs = await MedicationLog.findAll({
        where: whereClause,
        include: [
          {
            model: StudentMedication,
            as: 'studentMedication',
            include: [
              {
                model: Medication,
                as: 'medication',
                attributes: ['id', 'name', 'genericName', 'category']
              },
              {
                model: Student,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'studentNumber']
              }
            ]
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [['timeGiven', 'DESC']],
        limit: 100
      });

      // Get compliance statistics
      const totalScheduled = await StudentMedication.count({
        where: { isActive: true }
      });

      const totalLogs = await MedicationLog.count({ where: whereClause });

      // Get most administered medications with medication names
      const topMedicationsRaw = await sequelize.query<{
        medicationId: string;
        medicationName: string;
        count: number;
      }>(
        `SELECT
          m.id as "medicationId",
          m.name as "medicationName",
          COUNT(ml.id)::integer as count
        FROM medication_logs ml
        INNER JOIN student_medications sm ON ml."studentMedicationId" = sm.id
        INNER JOIN medications m ON sm."medicationId" = m.id
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `ml."timeGiven" >= :startDate` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate ? `ml."timeGiven" <= :endDate` : ''}
        GROUP BY m.id, m.name
        ORDER BY count DESC
        LIMIT 10`,
        {
          replacements: {
            startDate: startDate || null,
            endDate: endDate || null
          },
          type: QueryTypes.SELECT
        }
      );

      const topMedications = topMedicationsRaw.map(record => ({
        medicationName: record.medicationName,
        count: parseInt(String(record.count), 10)
      }));

      // Get medication logs with side effects (adverse reactions)
      const adverseReactionsWhere: any = {
        sideEffects: { [Op.ne]: null },
        ...whereClause
      };

      const adverseReactions = await MedicationLog.findAll({
        where: adverseReactionsWhere,
        include: [
          {
            model: StudentMedication,
            as: 'studentMedication',
            include: [
              {
                model: Medication,
                as: 'medication',
                attributes: ['id', 'name', 'genericName']
              },
              {
                model: Student,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'studentNumber']
              }
            ]
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [['timeGiven', 'DESC']]
      });

      return {
        administrationLogs,
        totalScheduled,
        totalLogs,
        topMedications,
        adverseReactions
      };
    } catch (error) {
      logger.error('Error getting medication usage report:', error);
      throw error;
    }
  }

  // ==================== Incident Statistics & Safety Analytics ====================

  /**
   * Generate comprehensive incident statistics and safety analytics
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Detailed incident statistics and safety metrics
   */
  static async getIncidentStatistics(startDate?: Date, endDate?: Date): Promise<IncidentStatisticsReport> {
    try {
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.occurredAt = {};
        if (startDate) whereClause.occurredAt[Op.gte] = startDate;
        if (endDate) whereClause.occurredAt[Op.lte] = endDate;
      }

      // Get incident reports with student details
      const incidents = await IncidentReport.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [['occurredAt', 'DESC']]
      });

      // Group by type
      const incidentsByTypeRaw = await IncidentReport.findAll({
        where: whereClause,
        attributes: [
          'type',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['type'],
        raw: true
      });

      const incidentsByType = incidentsByTypeRaw.map((record: any) => ({
        type: record.type as IncidentType,
        count: parseInt(record.count, 10)
      }));

      // Group by severity
      const incidentsBySeverityRaw = await IncidentReport.findAll({
        where: whereClause,
        attributes: [
          'severity',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['severity'],
        raw: true
      });

      const incidentsBySeverity = incidentsBySeverityRaw.map((record: any) => ({
        severity: record.severity as IncidentSeverity,
        count: parseInt(record.count, 10)
      }));

      // Get incidents by month
      const defaultStartDate = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      const defaultEndDate = endDate || new Date();

      const incidentsByMonthRaw = await sequelize.query<{
        month: Date;
        type: IncidentType;
        count: number;
      }>(
        `SELECT
          DATE_TRUNC('month', "occurredAt") as month,
          type,
          COUNT(*)::integer as count
        FROM incident_reports
        WHERE "occurredAt" >= :startDate
          AND "occurredAt" <= :endDate
        GROUP BY month, type
        ORDER BY month DESC`,
        {
          replacements: {
            startDate: defaultStartDate,
            endDate: defaultEndDate
          },
          type: QueryTypes.SELECT
        }
      );

      const incidentsByMonth = incidentsByMonthRaw.map(record => ({
        month: new Date(record.month),
        type: record.type,
        count: parseInt(String(record.count), 10)
      }));

      // Get injury types distribution (type + severity)
      const injuryStatsRaw = await IncidentReport.findAll({
        where: whereClause,
        attributes: [
          'type',
          'severity',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['type', 'severity'],
        raw: true
      });

      const injuryStats = injuryStatsRaw.map((record: any) => ({
        type: record.type as IncidentType,
        severity: record.severity as IncidentSeverity,
        count: parseInt(record.count, 10)
      }));

      // Get parent notification rate
      const notificationStatsRaw = await IncidentReport.findAll({
        where: whereClause,
        attributes: [
          'parentNotified',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['parentNotified'],
        raw: true
      });

      const notificationStats = notificationStatsRaw.map((record: any) => ({
        parentNotified: record.parentNotified as boolean,
        count: parseInt(record.count, 10)
      }));

      // Safety compliance metrics
      const complianceStatsRaw = await IncidentReport.findAll({
        where: whereClause,
        attributes: [
          'legalComplianceStatus',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['legalComplianceStatus'],
        raw: true
      });

      const complianceStats = complianceStatsRaw.map((record: any) => ({
        legalComplianceStatus: record.legalComplianceStatus as ComplianceStatus,
        count: parseInt(record.count, 10)
      }));

      return {
        incidents,
        incidentsByType,
        incidentsBySeverity,
        incidentsByMonth,
        injuryStats,
        notificationStats,
        complianceStats,
        totalIncidents: incidents.length
      };
    } catch (error) {
      logger.error('Error getting incident statistics:', error);
      throw error;
    }
  }

  // ==================== Attendance Correlation Analysis ====================

  /**
   * Analyze correlation between health visits, incidents, and attendance patterns
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Student health visit patterns and correlations
   */
  static async getAttendanceCorrelation(startDate?: Date, endDate?: Date): Promise<AttendanceCorrelationReport> {
    try {
      const healthRecordWhere: any = {};
      const incidentWhere: any = {};
      const appointmentWhere: any = {};

      if (startDate || endDate) {
        if (startDate || endDate) {
          healthRecordWhere.createdAt = {};
          if (startDate) healthRecordWhere.createdAt[Op.gte] = startDate;
          if (endDate) healthRecordWhere.createdAt[Op.lte] = endDate;
        }

        if (startDate || endDate) {
          incidentWhere.occurredAt = {};
          if (startDate) incidentWhere.occurredAt[Op.gte] = startDate;
          if (endDate) incidentWhere.occurredAt[Op.lte] = endDate;
        }

        if (startDate || endDate) {
          appointmentWhere.scheduledAt = {};
          if (startDate) appointmentWhere.scheduledAt[Op.gte] = startDate;
          if (endDate) appointmentWhere.scheduledAt[Op.lte] = endDate;
        }
      }

      // Get students with most health visits
      const healthVisitsRaw = await sequelize.query<{
        studentId: string;
        count: number;
      }>(
        `SELECT
          "studentId",
          COUNT(*)::integer as count
        FROM health_records
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `"createdAt" >= :startDate` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate ? `"createdAt" <= :endDate` : ''}
        GROUP BY "studentId"
        ORDER BY count DESC
        LIMIT 50`,
        {
          replacements: {
            startDate: startDate || null,
            endDate: endDate || null
          },
          type: QueryTypes.SELECT
        }
      );

      // Fetch student details for health visits
      const healthVisitsWithStudents = await Promise.all(
        healthVisitsRaw.map(async (record) => {
          const student = await Student.findByPk(record.studentId, {
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          });
          return {
            studentId: record.studentId,
            count: parseInt(String(record.count), 10),
            student: student!
          };
        })
      );

      // Get students with most incidents
      const incidentVisitsRaw = await sequelize.query<{
        studentId: string;
        count: number;
      }>(
        `SELECT
          "studentId",
          COUNT(*)::integer as count
        FROM incident_reports
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `"occurredAt" >= :startDate` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate ? `"occurredAt" <= :endDate` : ''}
        GROUP BY "studentId"
        ORDER BY count DESC
        LIMIT 50`,
        {
          replacements: {
            startDate: startDate || null,
            endDate: endDate || null
          },
          type: QueryTypes.SELECT
        }
      );

      // Fetch student details for incident visits
      const incidentVisitsWithStudents = await Promise.all(
        incidentVisitsRaw.map(async (record) => {
          const student = await Student.findByPk(record.studentId, {
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          });
          return {
            studentId: record.studentId,
            count: parseInt(String(record.count), 10),
            student: student!
          };
        })
      );

      // Get students with chronic conditions
      const chronicStudents = await ChronicCondition.findAll({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          }
        ]
      });

      // Get appointment frequency by student
      const appointmentFrequencyRaw = await sequelize.query<{
        studentId: string;
        count: number;
      }>(
        `SELECT
          "studentId",
          COUNT(*)::integer as count
        FROM appointments
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `"scheduledAt" >= :startDate` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate ? `"scheduledAt" <= :endDate` : ''}
        GROUP BY "studentId"
        ORDER BY count DESC
        LIMIT 50`,
        {
          replacements: {
            startDate: startDate || null,
            endDate: endDate || null
          },
          type: QueryTypes.SELECT
        }
      );

      // Fetch student details for appointment frequency
      const appointmentFrequencyWithStudents = await Promise.all(
        appointmentFrequencyRaw.map(async (record) => {
          const student = await Student.findByPk(record.studentId, {
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          });
          return {
            studentId: record.studentId,
            count: parseInt(String(record.count), 10),
            student: student!
          };
        })
      );

      return {
        healthVisits: healthVisitsWithStudents,
        incidentVisits: incidentVisitsWithStudents,
        chronicStudents,
        appointmentFrequency: appointmentFrequencyWithStudents
      };
    } catch (error) {
      logger.error('Error getting attendance correlation:', error);
      throw error;
    }
  }

  // ==================== Performance Dashboards ====================

  /**
   * Get performance metrics with optional filtering
   * @param metricType - Optional metric type filter
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Performance metrics data
   */
  static async getPerformanceMetrics(metricType?: MetricType, startDate?: Date, endDate?: Date): Promise<PerformanceMetric[]> {
    try {
      const whereClause: any = {};

      if (metricType) {
        whereClause.metricType = metricType;
      }

      if (startDate || endDate) {
        whereClause.recordedAt = {};
        if (startDate) whereClause.recordedAt[Op.gte] = startDate;
        if (endDate) whereClause.recordedAt[Op.lte] = endDate;
      }

      const metrics = await PerformanceMetric.findAll({
        where: whereClause,
        order: [['recordedAt', 'DESC']],
        limit: 1000
      });

      return metrics;
    } catch (error) {
      logger.error('Error getting performance metrics:', error);
      throw error;
    }
  }

  /**
   * Get real-time dashboard metrics for the current day
   * @returns Current dashboard statistics
   */
  static async getRealTimeDashboard(): Promise<DashboardMetrics> {
    try {
      // Get current active students
      const activeStudents = await Student.count({
        where: { isActive: true }
      });

      // Get today's appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todaysAppointments = await Appointment.count({
        where: {
          scheduledAt: {
            [Op.gte]: today,
            [Op.lt]: tomorrow
          }
        }
      });

      // Get pending medications (active prescriptions)
      const pendingMedications = await StudentMedication.count({
        where: { isActive: true }
      });

      // Get recent incidents (last 24 hours)
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentIncidents = await IncidentReport.count({
        where: {
          occurredAt: { [Op.gte]: last24Hours }
        }
      });

      // Get low stock inventory items
      const lowStockItems = await InventoryItem.count({
        where: {
          isActive: true
        }
      });

      // Get active allergies
      const activeAllergies = await Allergy.count({
        where: {}
      });

      // Get chronic conditions
      const chronicConditions = await ChronicCondition.count({
        where: {}
      });

      return {
        activeStudents,
        todaysAppointments,
        pendingMedications,
        recentIncidents,
        lowStockItems,
        activeAllergies,
        chronicConditions,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Error getting real-time dashboard:', error);
      throw error;
    }
  }

  // ==================== Compliance Reporting ====================

  /**
   * Generate HIPAA compliance and regulatory report
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Compliance audit data and statistics
   */
  static async getComplianceReport(startDate?: Date, endDate?: Date): Promise<ComplianceReport> {
    try {
      const whereClause: any = {
        action: { [Op.in]: [AuditAction.READ, AuditAction.UPDATE, AuditAction.DELETE, AuditAction.EXPORT] },
        entityType: { [Op.in]: ['Student', 'HealthRecord', 'Medication'] }
      };

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt[Op.gte] = startDate;
        if (endDate) whereClause.createdAt[Op.lte] = endDate;
      }

      // Get HIPAA compliance logs
      const hipaaLogs = await AuditLog.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: 100
      });

      // Get medication compliance grouped by active status
      const medicationComplianceRaw = await StudentMedication.findAll({
        attributes: [
          'isActive',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['isActive'],
        raw: true
      });

      const medicationCompliance = medicationComplianceRaw.map((record: any) => ({
        isActive: record.isActive as boolean,
        count: parseInt(record.count, 10)
      }));

      // Get incident compliance status
      const incidentWhereClause: any = {};
      if (startDate || endDate) {
        incidentWhereClause.occurredAt = {};
        if (startDate) incidentWhereClause.occurredAt[Op.gte] = startDate;
        if (endDate) incidentWhereClause.occurredAt[Op.lte] = endDate;
      }

      const incidentComplianceRaw = await IncidentReport.findAll({
        where: incidentWhereClause,
        attributes: [
          'legalComplianceStatus',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['legalComplianceStatus'],
        raw: true
      });

      const incidentCompliance = incidentComplianceRaw.map((record: any) => ({
        legalComplianceStatus: record.legalComplianceStatus as ComplianceStatus,
        count: parseInt(record.count, 10)
      }));

      // Get vaccination compliance count
      const vaccinationWhereClause: any = {
        type: HealthRecordType.VACCINATION
      };

      if (startDate || endDate) {
        vaccinationWhereClause.createdAt = {};
        if (startDate) vaccinationWhereClause.createdAt[Op.gte] = startDate;
        if (endDate) vaccinationWhereClause.createdAt[Op.lte] = endDate;
      }

      const vaccinationRecords = await HealthRecord.count({
        where: vaccinationWhereClause
      });

      return {
        hipaaLogs,
        medicationCompliance,
        incidentCompliance,
        vaccinationRecords
      };
    } catch (error) {
      logger.error('Error getting compliance report:', error);
      throw error;
    }
  }

  // ==================== Custom Report Data ====================

  /**
   * Generate custom report data based on report type with flexible filtering
   * @param reportType - Type of report (students, medications, incidents, appointments, inventory)
   * @param filters - Dynamic filters including date range and custom criteria
   * @returns Report-specific data with associations
   */
  static async getCustomReportData(reportType: string, filters: ReportFilters = {}): Promise<any> {
    try {
      const { startDate, endDate, ...otherFilters } = filters;

      switch (reportType) {
        case 'students':
          return await Student.findAll({
            where: otherFilters,
            include: [
              {
                model: HealthRecord,
                as: 'healthRecords'
              },
              {
                model: StudentMedication,
                as: 'medications'
              },
              {
                model: Allergy,
                as: 'allergies'
              },
              {
                model: ChronicCondition,
                as: 'chronicConditions'
              }
            ]
          });

        case 'medications': {
          const medicationWhere: any = { ...otherFilters };

          if (startDate || endDate) {
            medicationWhere.timeGiven = {};
            if (startDate) medicationWhere.timeGiven[Op.gte] = new Date(startDate);
            if (endDate) medicationWhere.timeGiven[Op.lte] = new Date(endDate);
          }

          return await MedicationLog.findAll({
            where: medicationWhere,
            include: [
              {
                model: StudentMedication,
                as: 'studentMedication',
                include: [
                  {
                    model: Medication,
                    as: 'medication'
                  },
                  {
                    model: Student,
                    as: 'student'
                  }
                ]
              },
              {
                model: User,
                as: 'nurse'
              }
            ]
          });
        }

        case 'incidents': {
          const incidentWhere: any = { ...otherFilters };

          if (startDate || endDate) {
            incidentWhere.occurredAt = {};
            if (startDate) incidentWhere.occurredAt[Op.gte] = new Date(startDate);
            if (endDate) incidentWhere.occurredAt[Op.lte] = new Date(endDate);
          }

          return await IncidentReport.findAll({
            where: incidentWhere,
            include: [
              {
                model: Student,
                as: 'student'
              },
              {
                model: User,
                as: 'reportedBy'
              }
            ]
          });
        }

        case 'appointments': {
          const appointmentWhere: any = { ...otherFilters };

          if (startDate || endDate) {
            appointmentWhere.scheduledAt = {};
            if (startDate) appointmentWhere.scheduledAt[Op.gte] = new Date(startDate);
            if (endDate) appointmentWhere.scheduledAt[Op.lte] = new Date(endDate);
          }

          return await Appointment.findAll({
            where: appointmentWhere,
            include: [
              {
                model: Student,
                as: 'student'
              },
              {
                model: User,
                as: 'nurse'
              }
            ]
          });
        }

        case 'inventory':
          return await InventoryItem.findAll({
            where: otherFilters
          });

        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }
    } catch (error) {
      logger.error('Error getting custom report data:', error);
      throw error;
    }
  }

  // ==================== Export Functionality ====================

  /**
   * Export report data to JSON format
   * @param reportType - Type of report to export
   * @param data - Report data to export
   * @returns Formatted export data with metadata
   */
  static async exportReportToJSON(reportType: string, data: any): Promise<any> {
    try {
      const exportData = {
        reportType,
        exportDate: new Date().toISOString(),
        generatedBy: 'White Cross Healthcare Platform',
        recordCount: Array.isArray(data) ? data.length : 1,
        data
      };

      logger.info(`Report exported to JSON: ${reportType} with ${exportData.recordCount} records`);
      return exportData;
    } catch (error) {
      logger.error('Error exporting report to JSON:', error);
      throw error;
    }
  }

  /**
   * Generate summary statistics for a report dataset
   * @param data - Array of report data
   * @returns Summary statistics including counts and aggregations
   */
  static generateReportSummary(data: any[]): any {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        return {
          totalRecords: 0,
          summary: 'No data available'
        };
      }

      const summary = {
        totalRecords: data.length,
        timestamp: new Date(),
        dataTypes: Object.keys(data[0] || {}),
        recordSample: data.slice(0, 3) // First 3 records as sample
      };

      logger.info(`Report summary generated for ${data.length} records`);
      return summary;
    } catch (error) {
      logger.error('Error generating report summary:', error);
      throw error;
    }
  }
}
