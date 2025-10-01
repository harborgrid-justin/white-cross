import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateIncidentReportData {
  studentId: string;
  reportedById: string;
  type: 'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'MEDICATION_ERROR' | 'ALLERGIC_REACTION' | 'EMERGENCY' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  location: string;
  witnesses: string[];
  actionsTaken: string;
  occurredAt: Date;
  parentNotified?: boolean;
  followUpRequired?: boolean;
  followUpNotes?: string;
  attachments?: string[];
}

export interface UpdateIncidentReportData {
  type?: 'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'MEDICATION_ERROR' | 'ALLERGIC_REACTION' | 'EMERGENCY' | 'OTHER';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description?: string;
  location?: string;
  witnesses?: string[];
  actionsTaken?: string;
  occurredAt?: Date;
  parentNotified?: boolean;
  followUpRequired?: boolean;
  followUpNotes?: string;
  attachments?: string[];
}

export interface IncidentFilters {
  studentId?: string;
  reportedById?: string;
  type?: 'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'MEDICATION_ERROR' | 'ALLERGIC_REACTION' | 'EMERGENCY' | 'OTHER';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dateFrom?: Date;
  dateTo?: Date;
  parentNotified?: boolean;
  followUpRequired?: boolean;
}

export interface IncidentStatistics {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  byLocation: Record<string, number>;
  parentNotificationRate: number;
  followUpRate: number;
  averageResponseTime: number; // minutes
}

export interface FollowUpAction {
  id: string;
  incidentId: string;
  action: string;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
}

export class IncidentReportService {
  /**
   * Get incident reports with pagination and filters
   */
  static async getIncidentReports(
    page: number = 1,
    limit: number = 20,
    filters: IncidentFilters = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      
      const whereClause: any = {};
      
      if (filters.studentId) {
        whereClause.studentId = filters.studentId;
      }
      
      if (filters.reportedById) {
        whereClause.reportedById = filters.reportedById;
      }
      
      if (filters.type) {
        whereClause.type = filters.type;
      }
      
      if (filters.severity) {
        whereClause.severity = filters.severity;
      }
      
      if (filters.dateFrom || filters.dateTo) {
        whereClause.occurredAt = {};
        if (filters.dateFrom) {
          whereClause.occurredAt.gte = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.occurredAt.lte = filters.dateTo;
        }
      }
      
      if (filters.parentNotified !== undefined) {
        whereClause.parentNotified = filters.parentNotified;
      }
      
      if (filters.followUpRequired !== undefined) {
        whereClause.followUpRequired = filters.followUpRequired;
      }

      const [reports, total] = await Promise.all([
        prisma.incidentReport.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentNumber: true,
                grade: true
              }
            },
            reportedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true
              }
            }
          },
          orderBy: { occurredAt: 'desc' }
        }),
        prisma.incidentReport.count({ where: whereClause })
      ]);

      return {
        reports,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching incident reports:', error);
      throw new Error('Failed to fetch incident reports');
    }
  }

  /**
   * Get incident report by ID
   */
  static async getIncidentReportById(id: string) {
    try {
      const report = await prisma.incidentReport.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true,
              grade: true,
              dateOfBirth: true,
              emergencyContacts: {
                where: { isActive: true },
                orderBy: { priority: 'asc' }
              }
            }
          },
          reportedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              email: true
            }
          }
        }
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      return report;
    } catch (error) {
      logger.error('Error fetching incident report by ID:', error);
      throw error;
    }
  }

  /**
   * Create new incident report
   */
  static async createIncidentReport(data: CreateIncidentReportData) {
    try {
      // Verify student exists
      const student = await prisma.student.findUnique({
        where: { id: data.studentId },
        include: {
          emergencyContacts: {
            where: { isActive: true },
            orderBy: { priority: 'asc' }
          }
        }
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Verify reporter exists
      const reporter = await prisma.user.findUnique({
        where: { id: data.reportedById }
      });

      if (!reporter) {
        throw new Error('Reporter not found');
      }

      const report = await prisma.incidentReport.create({
        data,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true,
              grade: true
            }
          },
          reportedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          }
        }
      });

      logger.info(`Incident report created: ${data.type} (${data.severity}) for ${student.firstName} ${student.lastName} by ${reporter.firstName} ${reporter.lastName}`);

      // Auto-notify parents for high/critical incidents
      if (['HIGH', 'CRITICAL'].includes(data.severity) && student.emergencyContacts.length > 0) {
        await this.notifyEmergencyContacts(report.id);
      }

      return report;
    } catch (error) {
      logger.error('Error creating incident report:', error);
      throw error;
    }
  }

  /**
   * Update incident report
   */
  static async updateIncidentReport(id: string, data: UpdateIncidentReportData) {
    try {
      const existingReport = await prisma.incidentReport.findUnique({
        where: { id },
        include: {
          student: true,
          reportedBy: true
        }
      });

      if (!existingReport) {
        throw new Error('Incident report not found');
      }

      const report = await prisma.incidentReport.update({
        where: { id },
        data,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true,
              grade: true
            }
          },
          reportedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          }
        }
      });

      logger.info(`Incident report updated: ${report.id} for ${existingReport.student.firstName} ${existingReport.student.lastName}`);
      return report;
    } catch (error) {
      logger.error('Error updating incident report:', error);
      throw error;
    }
  }

  /**
   * Mark parent as notified
   */
  static async markParentNotified(id: string, notificationMethod?: string, notifiedBy?: string) {
    try {
      const report = await prisma.incidentReport.update({
        where: { id },
        data: { 
          parentNotified: true,
          followUpNotes: notificationMethod 
            ? `Parent notified via ${notificationMethod}${notifiedBy ? ` by ${notifiedBy}` : ''}`
            : 'Parent notified'
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Parent notification marked for incident ${id} - ${report.student.firstName} ${report.student.lastName}`);
      return report;
    } catch (error) {
      logger.error('Error marking parent as notified:', error);
      throw error;
    }
  }

  /**
   * Add follow-up notes
   */
  static async addFollowUpNotes(id: string, notes: string, completedBy: string) {
    try {
      const report = await prisma.incidentReport.update({
        where: { id },
        data: { 
          followUpNotes: notes,
          followUpRequired: false // Mark as completed
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Follow-up notes added for incident ${id} - ${report.student.firstName} ${report.student.lastName} by ${completedBy}`);
      return report;
    } catch (error) {
      logger.error('Error adding follow-up notes:', error);
      throw error;
    }
  }

  /**
   * Get incident statistics
   */
  static async getIncidentStatistics(
    dateFrom?: Date,
    dateTo?: Date,
    studentId?: string
  ): Promise<IncidentStatistics> {
    try {
      const whereClause: any = {};
      
      if (dateFrom || dateTo) {
        whereClause.occurredAt = {};
        if (dateFrom) {
          whereClause.occurredAt.gte = dateFrom;
        }
        if (dateTo) {
          whereClause.occurredAt.lte = dateTo;
        }
      }
      
      if (studentId) {
        whereClause.studentId = studentId;
      }

      const [typeStats, severityStats, locationStats, totalReports, notifiedReports, followUpReports] = await Promise.all([
        prisma.incidentReport.groupBy({
          by: ['type'],
          where: whereClause,
          _count: { type: true }
        }),
        prisma.incidentReport.groupBy({
          by: ['severity'],
          where: whereClause,
          _count: { severity: true }
        }),
        prisma.incidentReport.groupBy({
          by: ['location'],
          where: whereClause,
          _count: { location: true }
        }),
        prisma.incidentReport.count({ where: whereClause }),
        prisma.incidentReport.count({ 
          where: { ...whereClause, parentNotified: true } 
        }),
        prisma.incidentReport.count({ 
          where: { ...whereClause, followUpRequired: true } 
        })
      ]);

      // Calculate average response time (simplified - time between occurredAt and createdAt)
      const reports = await prisma.incidentReport.findMany({
        where: whereClause,
        select: {
          occurredAt: true,
          createdAt: true
        }
      });

      const avgResponseTime = reports.length > 0 
        ? reports.reduce((sum: number, report: any) => {
            const responseTime = report.createdAt.getTime() - report.occurredAt.getTime();
            return sum + (responseTime / (1000 * 60)); // Convert to minutes
          }, 0) / reports.length
        : 0;

      return {
        total: totalReports,
        byType: typeStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.type] = curr._count.type;
          return acc;
        }, {}),
        bySeverity: severityStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.severity] = curr._count.severity;
          return acc;
        }, {}),
        byLocation: locationStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.location] = curr._count.location;
          return acc;
        }, {}),
        parentNotificationRate: totalReports > 0 ? (notifiedReports / totalReports) * 100 : 0,
        followUpRate: totalReports > 0 ? (followUpReports / totalReports) * 100 : 0,
        averageResponseTime: Math.round(avgResponseTime * 100) / 100
      };
    } catch (error) {
      logger.error('Error fetching incident statistics:', error);
      throw error;
    }
  }

  /**
   * Search incident reports
   */
  static async searchIncidentReports(
    query: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const skip = (page - 1) * limit;
      
      const whereClause = {
        OR: [
          { description: { contains: query, mode: 'insensitive' } },
          { location: { contains: query, mode: 'insensitive' } },
          { actionsTaken: { contains: query, mode: 'insensitive' } },
          { followUpNotes: { contains: query, mode: 'insensitive' } },
          {
            student: {
              OR: [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } },
                { studentNumber: { contains: query, mode: 'insensitive' } }
              ]
            }
          },
          {
            reportedBy: {
              OR: [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } }
              ]
            }
          }
        ]
      };

      const [reports, total] = await Promise.all([
        prisma.incidentReport.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentNumber: true,
                grade: true
              }
            },
            reportedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true
              }
            }
          },
          orderBy: { occurredAt: 'desc' }
        }),
        prisma.incidentReport.count({ where: whereClause })
      ]);

      return {
        reports,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error searching incident reports:', error);
      throw error;
    }
  }

  /**
   * Get incidents requiring follow-up
   */
  static async getIncidentsRequiringFollowUp() {
    try {
      const reports = await prisma.incidentReport.findMany({
        where: {
          followUpRequired: true
        },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true,
              grade: true
            }
          },
          reportedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          }
        },
        orderBy: { occurredAt: 'desc' }
      });

      return reports;
    } catch (error) {
      logger.error('Error fetching incidents requiring follow-up:', error);
      throw error;
    }
  }

  /**
   * Get recent incidents for a student
   */
  static async getStudentRecentIncidents(studentId: string, limit: number = 5) {
    try {
      const reports = await prisma.incidentReport.findMany({
        where: { studentId },
        include: {
          reportedBy: {
            select: {
              firstName: true,
              lastName: true,
              role: true
            }
          }
        },
        orderBy: { occurredAt: 'desc' },
        take: limit
      });

      return reports;
    } catch (error) {
      logger.error('Error fetching student recent incidents:', error);
      throw error;
    }
  }

  /**
   * Notify emergency contacts about incident
   */
  private static async notifyEmergencyContacts(incidentId: string) {
    try {
      const report = await this.getIncidentReportById(incidentId);
      
      if (!report.student.emergencyContacts.length) {
        logger.warn(`No emergency contacts found for incident ${incidentId}`);
        return;
      }

      const message = `Incident Alert: ${report.student.firstName} ${report.student.lastName} was involved in a ${report.type} incident (${report.severity} severity) on ${report.occurredAt.toLocaleString()}. Please contact the school nurse for more information.`;

      // This would integrate with the EmergencyContactService
      logger.info(`Emergency contacts would be notified for incident ${incidentId}: ${message}`);
      
      // Mark as parent notified
      await this.markParentNotified(incidentId, 'auto-notification', 'system');
      
      return true;
    } catch (error) {
      logger.error('Error notifying emergency contacts:', error);
      throw error;
    }
  }

  /**
   * Generate incident report document (for legal/insurance purposes)
   */
  static async generateIncidentReportDocument(id: string) {
    try {
      const report = await this.getIncidentReportById(id);
      
      // This would generate a PDF or official document
      // For now, return structured data for document generation
      const documentData = {
        reportNumber: `INC-${report.id.slice(-8).toUpperCase()}`,
        student: {
          name: `${report.student.firstName} ${report.student.lastName}`,
          studentNumber: report.student.studentNumber,
          grade: report.student.grade,
          dateOfBirth: report.student.dateOfBirth
        },
        incident: {
          type: report.type,
          severity: report.severity,
          occurredAt: report.occurredAt,
          location: report.location,
          description: report.description,
          actionsTaken: report.actionsTaken,
          witnesses: report.witnesses
        },
        reporter: {
          name: `${report.reportedBy.firstName} ${report.reportedBy.lastName}`,
          role: report.reportedBy.role,
          reportedAt: report.createdAt
        },
        followUp: {
          required: report.followUpRequired,
          notes: report.followUpNotes,
          parentNotified: report.parentNotified
        },
        attachments: report.attachments
      };

      logger.info(`Incident report document generated for ${id}`);
      return documentData;
    } catch (error) {
      logger.error('Error generating incident report document:', error);
      throw error;
    }
  }
}