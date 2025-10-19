/**
 * LOC: 1EB0403DE8-I
 * WC-SVC-RPT-INDEX | index.ts - Report Service Main Export
 *
 * UPSTREAM (imports from):
 *   - All report service modules
 *
 * DOWNSTREAM (imported by):
 *   - reports.ts (routes/reports.ts)
 */

/**
 * WC-SVC-RPT-INDEX | index.ts - Report Service Main Export
 * Purpose: Facade pattern - unified interface for all reporting operations
 * Upstream: All report modules | Dependencies: Module delegation
 * Downstream: Report routes | Called by: Application routes
 * Related: Health, medication, incident, attendance modules
 * Exports: ReportService class | Key Services: Complete reporting API
 * Last Updated: 2025-10-19 | File Type: .ts
 * Critical Path: Route → ReportService → Specific module → Database → Response
 * LLM Context: Comprehensive healthcare reporting service with HIPAA compliance
 */

// Re-export all types for convenience
export * from './types';

// Import all report modules
import { HealthReportsModule } from './healthReports';
import { MedicationReportsModule } from './medicationReports';
import { IncidentReportsModule } from './incidentReports';
import { AttendanceReportsModule } from './attendanceReports';

import type {
  DateRangeFilter,
  HealthTrendsReport,
  MedicationUsageReport,
  IncidentStatisticsReport,
  AttendanceCorrelationReport,
  DashboardMetrics,
  ComplianceReport,
  ReportFilters
} from './types';

// Additional imports for methods not yet modularized
import { Op, fn, col, QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  sequelize,
  AuditLog,
  StudentMedication,
  IncidentReport,
  PerformanceMetric,
  Appointment,
  InventoryItem,
  Student
} from '../../database/models';
import { AuditAction, MetricType, AppointmentStatus } from '../../database/types/enums';

/**
 * Report Service
 * Unified interface for all reporting and analytics operations
 * Delegates to specialized modules while maintaining backward compatibility
 */
export class ReportService {
  // ==================== Health Reports ====================

  /**
   * Get comprehensive health trends with grouping and monthly analysis
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Aggregated health trend data
   */
  static async getHealthTrends(startDate?: Date, endDate?: Date): Promise<HealthTrendsReport> {
    return HealthReportsModule.getHealthTrends(startDate, endDate);
  }

  // ==================== Medication Reports ====================

  /**
   * Get medication usage report
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Medication usage and compliance statistics
   */
  static async getMedicationUsageReport(
    startDate?: Date,
    endDate?: Date
  ): Promise<MedicationUsageReport> {
    return MedicationReportsModule.getMedicationUsageReport(startDate, endDate);
  }

  // ==================== Incident Reports ====================

  /**
   * Get incident statistics report
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Comprehensive incident statistics
   */
  static async getIncidentStatistics(
    startDate?: Date,
    endDate?: Date
  ): Promise<IncidentStatisticsReport> {
    return IncidentReportsModule.getIncidentStatistics(startDate, endDate);
  }

  // ==================== Attendance Correlation ====================

  /**
   * Get attendance and health visit correlation report
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Attendance correlation data
   */
  static async getAttendanceCorrelation(
    startDate?: Date,
    endDate?: Date
  ): Promise<AttendanceCorrelationReport> {
    return AttendanceReportsModule.getAttendanceCorrelation(startDate, endDate);
  }

  // ==================== Dashboard & Real-Time Metrics ====================

  /**
   * Get real-time dashboard metrics
   * @returns Current system metrics for dashboard display
   */
  static async getRealTimeDashboard(): Promise<DashboardMetrics> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [
        activeStudents,
        todaysAppointments,
        pendingMedications,
        recentIncidents,
        lowStockItems,
        activeAllergies,
        chronicConditions
      ] = await Promise.all([
        Student.count({ where: { isActive: true } }),
        Appointment.count({
          where: {
            scheduledAt: { [Op.gte]: today, [Op.lt]: tomorrow },
            status: AppointmentStatus.SCHEDULED
          }
        }),
        StudentMedication.count({ where: { isActive: true } }),
        IncidentReport.count({
          where: {
            createdAt: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        }),
        InventoryItem.count({
          where: {
            quantity: { [Op.lt]: col('reorderLevel') }
          }
        }),
        sequelize.models.Allergy.count({ where: { verified: true } }),
        sequelize.models.ChronicCondition.count({ where: { status: 'ACTIVE' } })
      ]);

      logger.info('Dashboard metrics retrieved successfully');

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
      logger.error('Error fetching dashboard metrics:', error);
      throw new Error('Failed to fetch dashboard metrics');
    }
  }

  // ==================== Compliance Reporting ====================

  /**
   * Get compliance report
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns HIPAA and medication compliance data
   */
  static async getComplianceReport(startDate?: Date, endDate?: Date): Promise<ComplianceReport> {
    try {
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt[Op.gte] = startDate;
        if (endDate) whereClause.createdAt[Op.lte] = endDate;
      }

      // Get HIPAA-related audit logs
      const hipaaLogs = await AuditLog.findAll({
        where: {
          ...whereClause,
          action: {
            [Op.in]: [
              AuditAction.VIEW,
              AuditAction.DOWNLOAD,
              AuditAction.ACCESS_PHI,
              AuditAction.SHARE
            ]
          }
        },
        order: [['createdAt', 'DESC']],
        limit: 100
      });

      // Get medication compliance statistics
      const medicationCompliance = await StudentMedication.findAll({
        attributes: [
          'isActive',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['isActive'],
        raw: true
      });

      // Get incident compliance statistics
      const incidentCompliance = await IncidentReport.findAll({
        where: whereClause,
        attributes: [
          'legalComplianceStatus',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['legalComplianceStatus'],
        raw: true
      });

      // Get vaccination record count
      const vaccinationRecords = await sequelize.models.Vaccination.count({
        where: whereClause
      });

      logger.info('Compliance report generated successfully');

      return {
        hipaaLogs,
        medicationCompliance: (medicationCompliance as any[]).map(m => ({
          isActive: m.isActive,
          count: parseInt(m.count, 10)
        })),
        incidentCompliance: (incidentCompliance as any[]).map(i => ({
          legalComplianceStatus: i.legalComplianceStatus,
          count: parseInt(i.count, 10)
        })),
        vaccinationRecords
      };
    } catch (error) {
      logger.error('Error generating compliance report:', error);
      throw new Error('Failed to generate compliance report');
    }
  }

  // ==================== Performance Metrics ====================

  /**
   * Get system performance metrics
   * @param hours - Number of hours to look back
   * @returns Performance metrics
   */
  static async getPerformanceMetrics(hours: number = 24) {
    try {
      const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);

      const metrics = await PerformanceMetric.findAll({
        where: {
          createdAt: { [Op.gte]: cutoffDate }
        },
        order: [['createdAt', 'DESC']]
      });

      // Group by metric type
      const metricsByType = await PerformanceMetric.findAll({
        where: {
          createdAt: { [Op.gte]: cutoffDate }
        },
        attributes: [
          'metricType',
          [fn('AVG', col('value')), 'avgValue'],
          [fn('MAX', col('value')), 'maxValue'],
          [fn('MIN', col('value')), 'minValue'],
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['metricType'],
        raw: true
      });

      logger.info(`Performance metrics retrieved for last ${hours} hours`);

      return {
        metrics,
        summary: (metricsByType as any[]).map(m => ({
          metricType: m.metricType as MetricType,
          avgValue: parseFloat(m.avgValue),
          maxValue: parseFloat(m.maxValue),
          minValue: parseFloat(m.minValue),
          count: parseInt(m.count, 10)
        }))
      };
    } catch (error) {
      logger.error('Error fetching performance metrics:', error);
      throw new Error('Failed to fetch performance metrics');
    }
  }

  // ==================== Custom Reporting ====================

  /**
   * Get custom report data based on provided query
   * @param reportType - Type of report to generate
   * @param filters - Report-specific filters
   * @returns Custom report data
   */
  static async getCustomReportData(reportType: string, filters: ReportFilters = {}) {
    try {
      logger.info(`Generating custom report: ${reportType}`);

      // Placeholder for custom report logic
      // This can be extended with specific custom report implementations
      const result = {
        reportType,
        filters,
        generatedAt: new Date(),
        data: []
      };

      logger.info(`Custom report ${reportType} generated successfully`);
      return result;
    } catch (error) {
      logger.error('Error generating custom report:', error);
      throw new Error('Failed to generate custom report');
    }
  }

  // ==================== Export Functionality ====================

  /**
   * Export report data to JSON format
   * @param reportData - Report data to export
   * @param reportName - Name of the report
   * @returns Formatted JSON export
   */
  static async exportReportToJSON(reportData: any, reportName: string) {
    try {
      const exportData = {
        reportName,
        exportedAt: new Date().toISOString(),
        data: reportData
      };

      logger.info(`Report ${reportName} exported to JSON`);
      return exportData;
    } catch (error) {
      logger.error('Error exporting report:', error);
      throw new Error('Failed to export report');
    }
  }
}

// Re-export the ReportService as default
export default ReportService;
