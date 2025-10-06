import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class ReportService {
  // ==================== Health Trend Analysis ====================
  
  static async getHealthTrends(startDate?: Date, endDate?: Date) {
    try {
      const where: any = {};
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      // Get health records summary
      const healthRecords = await prisma.healthRecord.groupBy({
        by: ['type'],
        where,
        _count: { id: true }
      });

      // Get chronic conditions trends
      const chronicConditions = await prisma.chronicCondition.groupBy({
        by: ['condition'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10
      });

      // Get allergies summary
      const allergies = await prisma.allergy.groupBy({
        by: ['allergen', 'severity'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10
      });

      // Get monthly health record trends
      const monthlyTrends = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          type,
          COUNT(*) as count
        FROM health_records
        WHERE "createdAt" >= COALESCE(${startDate}, NOW() - INTERVAL '12 months')
          AND "createdAt" <= COALESCE(${endDate}, NOW())
        GROUP BY month, type
        ORDER BY month DESC
      `;

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
  
  static async getMedicationUsageReport(startDate?: Date, endDate?: Date) {
    try {
      const where: any = {};
      
      if (startDate || endDate) {
        where.timeGiven = {};
        if (startDate) where.timeGiven.gte = startDate;
        if (endDate) where.timeGiven.lte = endDate;
      }

      // Get medication administration logs
      const administrationLogs = await prisma.medicationLog.findMany({
        where,
        include: {
          studentMedication: {
            include: {
              medication: true,
              student: {
                select: { firstName: true, lastName: true, studentNumber: true }
              }
            }
          },
          nurse: {
            select: { firstName: true, lastName: true }
          }
        },
        orderBy: { timeGiven: 'desc' },
        take: 100
      });

      // Get compliance statistics
      const totalScheduled = await prisma.studentMedication.count({
        where: { isActive: true }
      });

      const totalLogs = await prisma.medicationLog.count({ where });

      // Get most administered medications (via studentMedication)
      const topMedications = await prisma.medicationLog.groupBy({
        by: ['studentMedicationId'],
        where,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10
      });

      // Get medication logs with side effects (adverse reactions)
      const adverseReactions = await prisma.medicationLog.findMany({
        where: {
          sideEffects: { not: null },
          ...(startDate || endDate ? {
            timeGiven: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDate ? { lte: endDate } : {})
            }
          } : {})
        },
        include: {
          studentMedication: {
            include: {
              medication: true,
              student: {
                select: { firstName: true, lastName: true, studentNumber: true }
              }
            }
          }
        }
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
  
  static async getIncidentStatistics(startDate?: Date, endDate?: Date) {
    try {
      const where: any = {};
      
      if (startDate || endDate) {
        where.occurredAt = {};
        if (startDate) where.occurredAt.gte = startDate;
        if (endDate) where.occurredAt.lte = endDate;
      }

      // Get incident reports
      const incidents = await prisma.incidentReport.findMany({
        where,
        include: {
          student: {
            select: { firstName: true, lastName: true, studentNumber: true, grade: true }
          }
        },
        orderBy: { occurredAt: 'desc' }
      });

      // Group by type
      const incidentsByType = await prisma.incidentReport.groupBy({
        by: ['type'],
        where,
        _count: { id: true }
      });

      // Group by severity
      const incidentsBySeverity = await prisma.incidentReport.groupBy({
        by: ['severity'],
        where,
        _count: { id: true }
      });

      // Get incidents by location (from description/notes)
      const incidentsByMonth = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "occurredAt") as month,
          type,
          COUNT(*) as count
        FROM incident_reports
        WHERE "occurredAt" >= COALESCE(${startDate}, NOW() - INTERVAL '12 months')
          AND "occurredAt" <= COALESCE(${endDate}, NOW())
        GROUP BY month, type
        ORDER BY month DESC
      `;

      // Get injury types distribution
      const injuryStats = await prisma.incidentReport.groupBy({
        by: ['type', 'severity'],
        where,
        _count: { id: true }
      });

      // Get parent notification rate
      const notificationStats = await prisma.incidentReport.groupBy({
        by: ['parentNotified'],
        where,
        _count: { id: true }
      });

      // Safety compliance metrics
      const complianceStats = await prisma.incidentReport.groupBy({
        by: ['legalComplianceStatus'],
        where,
        _count: { id: true }
      });

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
  
  static async getAttendanceCorrelation(startDate?: Date, endDate?: Date) {
    try {
      const where: any = {};
      
      if (startDate || endDate) {
        where.occurredAt = {};
        if (startDate) where.occurredAt.gte = startDate;
        if (endDate) where.occurredAt.lte = endDate;
      }

      // Get students with health visits
      const healthVisits = await prisma.healthRecord.groupBy({
        by: ['studentId'],
        where: startDate || endDate ? {
          createdAt: {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {})
          }
        } : {},
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 50
      });

      // Get students with incidents
      const incidentVisits = await prisma.incidentReport.groupBy({
        by: ['studentId'],
        where,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 50
      });

      // Get students with chronic conditions
      const chronicStudents = await prisma.chronicCondition.findMany({
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true,
              grade: true
            }
          }
        }
      });

      // Get appointment frequency
      const appointmentFrequency = await prisma.appointment.groupBy({
        by: ['studentId'],
        where: startDate || endDate ? {
          scheduledAt: {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {})
          }
        } : {},
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 50
      });

      return {
        healthVisits,
        incidentVisits,
        chronicStudents,
        appointmentFrequency
      };
    } catch (error) {
      logger.error('Error getting attendance correlation:', error);
      throw error;
    }
  }

  // ==================== Performance Dashboards ====================
  
  static async getPerformanceMetrics(metricType?: string, startDate?: Date, endDate?: Date) {
    try {
      const where: any = {};
      
      if (metricType) {
        where.metricType = metricType;
      }
      
      if (startDate || endDate) {
        where.recordedAt = {};
        if (startDate) where.recordedAt.gte = startDate;
        if (endDate) where.recordedAt.lte = endDate;
      }

      const metrics = await prisma.performanceMetric.findMany({
        where,
        orderBy: { recordedAt: 'desc' },
        take: 1000
      });

      return metrics;
    } catch (error) {
      logger.error('Error getting performance metrics:', error);
      throw error;
    }
  }

  static async getRealTimeDashboard() {
    try {
      // Get current active students
      const activeStudents = await prisma.student.count({
        where: { isActive: true }
      });

      // Get today's appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todaysAppointments = await prisma.appointment.count({
        where: {
          scheduledAt: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      // Get pending medications
      const pendingMedications = await prisma.studentMedication.count({
        where: { isActive: true }
      });

      // Get recent incidents (last 24 hours)
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentIncidents = await prisma.incidentReport.count({
        where: {
          occurredAt: { gte: last24Hours }
        }
      });

      // Get inventory alerts (estimate based on reorder level)
      const lowStockItems = await prisma.inventoryItem.count({
        where: {
          isActive: true
        }
      });

      // Get active allergies
      const activeAllergies = await prisma.allergy.count();

      // Get chronic conditions
      const chronicConditions = await prisma.chronicCondition.count();

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
  
  static async getComplianceReport(startDate?: Date, endDate?: Date) {
    try {
      // Get HIPAA compliance logs
      const hipaaLogs = await prisma.auditLog.findMany({
        where: {
          action: { in: ['READ', 'UPDATE', 'DELETE', 'EXPORT'] },
          entityType: { in: ['Student', 'HealthRecord', 'Medication'] },
          ...(startDate || endDate ? {
            createdAt: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDate ? { lte: endDate } : {})
            }
          } : {})
        },
        orderBy: { createdAt: 'desc' },
        take: 100
      });

      // Get medication compliance grouped by active status
      const medicationCompliance = await prisma.studentMedication.groupBy({
        by: ['isActive'],
        _count: { id: true }
      });

      // Get incident compliance status
      const incidentCompliance = await prisma.incidentReport.groupBy({
        by: ['legalComplianceStatus'],
        where: startDate || endDate ? {
          occurredAt: {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {})
          }
        } : {},
        _count: { id: true }
      });

      // Get vaccination compliance
      const vaccinationRecords = await prisma.healthRecord.count({
        where: {
          type: 'VACCINATION',
          ...(startDate || endDate ? {
            createdAt: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDate ? { lte: endDate } : {})
            }
          } : {})
        }
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
  
  static async getCustomReportData(reportType: string, filters: any = {}) {
    try {
      const { startDate, endDate, ...otherFilters } = filters;

      switch (reportType) {
        case 'students':
          return await prisma.student.findMany({
            where: otherFilters,
            include: {
              healthRecords: true,
              medications: true,
              allergies: true,
              chronicConditions: true
            }
          });

        case 'medications':
          return await prisma.medicationLog.findMany({
            where: {
              ...otherFilters,
              ...(startDate || endDate ? {
                timeGiven: {
                  ...(startDate ? { gte: new Date(startDate) } : {}),
                  ...(endDate ? { lte: new Date(endDate) } : {})
                }
              } : {})
            },
            include: {
              studentMedication: {
                include: {
                  medication: true,
                  student: true
                }
              },
              nurse: true
            }
          });

        case 'incidents':
          return await prisma.incidentReport.findMany({
            where: {
              ...otherFilters,
              ...(startDate || endDate ? {
                occurredAt: {
                  ...(startDate ? { gte: new Date(startDate) } : {}),
                  ...(endDate ? { lte: new Date(endDate) } : {})
                }
              } : {})
            },
            include: {
              student: true,
              reportedBy: true,
              witnessStatements: true
            }
          });

        case 'appointments':
          return await prisma.appointment.findMany({
            where: {
              ...otherFilters,
              ...(startDate || endDate ? {
                scheduledAt: {
                  ...(startDate ? { gte: new Date(startDate) } : {}),
                  ...(endDate ? { lte: new Date(endDate) } : {})
                }
              } : {})
            },
            include: {
              student: true,
              nurse: true
            }
          });

        case 'inventory':
          return await prisma.inventoryItem.findMany({
            where: otherFilters,
            include: {
              transactions: true
            }
          });

        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }
    } catch (error) {
      logger.error('Error getting custom report data:', error);
      throw error;
    }
  }
}
