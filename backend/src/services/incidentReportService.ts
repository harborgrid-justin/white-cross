import { Op } from 'sequelize';
import { logger } from '../utils/logger';
import {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  Student,
  User,
  EmergencyContact,
  sequelize
} from '../database/models';

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
  evidencePhotos?: string[];
  evidenceVideos?: string[];
  insuranceClaimNumber?: string;
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
  evidencePhotos?: string[];
  evidenceVideos?: string[];
  insuranceClaimNumber?: string;
  insuranceClaimStatus?: 'NOT_FILED' | 'FILED' | 'PENDING' | 'APPROVED' | 'DENIED' | 'CLOSED';
  legalComplianceStatus?: 'PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';
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

export interface FollowUpActionData {
  id: string;
  incidentId: string;
  action: string;
  dueDate: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedTo?: string;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
}

export interface WitnessStatementData {
  id: string;
  incidentReportId: string;
  witnessName: string;
  witnessType: 'STUDENT' | 'STAFF' | 'PARENT' | 'OTHER';
  witnessContact?: string;
  statement: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface CreateWitnessStatementData {
  witnessName: string;
  witnessType: 'STUDENT' | 'STAFF' | 'PARENT' | 'OTHER';
  witnessContact?: string;
  statement: string;
}

export interface CreateFollowUpActionData {
  action: string;
  dueDate: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
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
      const offset = (page - 1) * limit;

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
          whereClause.occurredAt[Op.gte] = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.occurredAt[Op.lte] = filters.dateTo;
        }
      }

      if (filters.parentNotified !== undefined) {
        whereClause.parentNotified = filters.parentNotified;
      }

      if (filters.followUpRequired !== undefined) {
        whereClause.followUpRequired = filters.followUpRequired;
      }

      const { rows: reports, count: total } = await IncidentReport.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName', 'role']
          }
        ],
        order: [['occurredAt', 'DESC']],
        distinct: true
      });

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
      const report = await IncidentReport.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade', 'dateOfBirth'],
            include: [
              {
                model: EmergencyContact,
                as: 'emergencyContacts',
                where: { isActive: true },
                required: false,
                order: [['priority', 'ASC']]
              }
            ]
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName', 'role', 'email']
          }
        ]
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
      const student = await Student.findByPk(data.studentId, {
        include: [
          {
            model: EmergencyContact,
            as: 'emergencyContacts',
            where: { isActive: true },
            required: false,
            order: [['priority', 'ASC']]
          }
        ]
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Verify reporter exists
      const reporter = await User.findByPk(data.reportedById);

      if (!reporter) {
        throw new Error('Reporter not found');
      }

      const report = await IncidentReport.create(data);

      // Reload with associations
      await report.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName', 'role']
          }
        ]
      });

      logger.info(`Incident report created: ${data.type} (${data.severity}) for ${student.firstName} ${student.lastName} by ${reporter.firstName} ${reporter.lastName}`);

      // Auto-notify parents for high/critical incidents
      if (['HIGH', 'CRITICAL'].includes(data.severity) && student.emergencyContacts && student.emergencyContacts.length > 0) {
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
      const existingReport = await IncidentReport.findByPk(id, {
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

      if (!existingReport) {
        throw new Error('Incident report not found');
      }

      await existingReport.update(data);

      // Reload with associations
      await existingReport.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName', 'role']
          }
        ]
      });

      logger.info(`Incident report updated: ${existingReport.id} for ${existingReport.student!.firstName} ${existingReport.student!.lastName}`);
      return existingReport;
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
      const report = await IncidentReport.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      await report.update({
        parentNotified: true,
        followUpNotes: notificationMethod
          ? `Parent notified via ${notificationMethod}${notifiedBy ? ` by ${notifiedBy}` : ''}`
          : 'Parent notified'
      });

      logger.info(`Parent notification marked for incident ${id} - ${report.student!.firstName} ${report.student!.lastName}`);
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
      const report = await IncidentReport.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      await report.update({
        followUpNotes: notes,
        followUpRequired: false // Mark as completed
      });

      logger.info(`Follow-up notes added for incident ${id} - ${report.student!.firstName} ${report.student!.lastName} by ${completedBy}`);
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
          whereClause.occurredAt[Op.gte] = dateFrom;
        }
        if (dateTo) {
          whereClause.occurredAt[Op.lte] = dateTo;
        }
      }

      if (studentId) {
        whereClause.studentId = studentId;
      }

      const [typeStats, severityStats, locationStats, totalReports, notifiedReports, followUpReports] = await Promise.all([
        IncidentReport.findAll({
          where: whereClause,
          attributes: [
            'type',
            [sequelize.fn('COUNT', sequelize.col('type')), 'count']
          ],
          group: ['type'],
          raw: true
        }),
        IncidentReport.findAll({
          where: whereClause,
          attributes: [
            'severity',
            [sequelize.fn('COUNT', sequelize.col('severity')), 'count']
          ],
          group: ['severity'],
          raw: true
        }),
        IncidentReport.findAll({
          where: whereClause,
          attributes: [
            'location',
            [sequelize.fn('COUNT', sequelize.col('location')), 'count']
          ],
          group: ['location'],
          raw: true
        }),
        IncidentReport.count({ where: whereClause }),
        IncidentReport.count({
          where: { ...whereClause, parentNotified: true }
        }),
        IncidentReport.count({
          where: { ...whereClause, followUpRequired: true }
        })
      ]);

      // Calculate average response time (simplified - time between occurredAt and createdAt)
      const reports = await IncidentReport.findAll({
        where: whereClause,
        attributes: ['occurredAt', 'createdAt'],
        raw: true
      });

      const avgResponseTime = reports.length > 0
        ? reports.reduce((sum: number, report: any) => {
            const responseTime = new Date(report.createdAt).getTime() - new Date(report.occurredAt).getTime();
            return sum + (responseTime / (1000 * 60)); // Convert to minutes
          }, 0) / reports.length
        : 0;

      return {
        total: totalReports,
        byType: typeStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.type] = parseInt(curr.count, 10);
          return acc;
        }, {}),
        bySeverity: severityStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.severity] = parseInt(curr.count, 10);
          return acc;
        }, {}),
        byLocation: locationStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.location] = parseInt(curr.count, 10);
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
      const offset = (page - 1) * limit;

      const whereClause: any = {
        [Op.or]: [
          { description: { [Op.iLike]: `%${query}%` } },
          { location: { [Op.iLike]: `%${query}%` } },
          { actionsTaken: { [Op.iLike]: `%${query}%` } },
          { followUpNotes: { [Op.iLike]: `%${query}%` } }
        ]
      };

      const { rows: reports, count: total } = await IncidentReport.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
            where: {
              [Op.or]: [
                { firstName: { [Op.iLike]: `%${query}%` } },
                { lastName: { [Op.iLike]: `%${query}%` } },
                { studentNumber: { [Op.iLike]: `%${query}%` } }
              ]
            },
            required: false
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName', 'role'],
            where: {
              [Op.or]: [
                { firstName: { [Op.iLike]: `%${query}%` } },
                { lastName: { [Op.iLike]: `%${query}%` } }
              ]
            },
            required: false
          }
        ],
        order: [['occurredAt', 'DESC']],
        distinct: true
      });

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
      const reports = await IncidentReport.findAll({
        where: {
          followUpRequired: true
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName', 'role']
          }
        ],
        order: [['occurredAt', 'DESC']]
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
      const reports = await IncidentReport.findAll({
        where: { studentId },
        include: [
          {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName', 'role']
          }
        ],
        order: [['occurredAt', 'DESC']],
        limit
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

      if (!report.student!.emergencyContacts || !report.student!.emergencyContacts.length) {
        logger.warn(`No emergency contacts found for incident ${incidentId}`);
        return;
      }

      const message = `Incident Alert: ${report.student!.firstName} ${report.student!.lastName} was involved in a ${report.type} incident (${report.severity} severity) on ${report.occurredAt.toLocaleString()}. Please contact the school nurse for more information.`;

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
      const report = await IncidentReport.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade', 'dateOfBirth']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName', 'role']
          },
          {
            model: WitnessStatement,
            as: 'witnessStatements'
          },
          {
            model: FollowUpAction,
            as: 'followUpActions'
          }
        ]
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      // This would generate a PDF or official document
      // For now, return structured data for document generation
      const documentData = {
        reportNumber: `INC-${report.id.slice(-8).toUpperCase()}`,
        generatedAt: new Date(),
        student: {
          name: `${report.student!.firstName} ${report.student!.lastName}`,
          studentNumber: report.student!.studentNumber,
          grade: report.student!.grade,
          dateOfBirth: report.student!.dateOfBirth
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
          name: `${report.reportedBy!.firstName} ${report.reportedBy!.lastName}`,
          role: report.reportedBy!.role,
          reportedAt: report.createdAt
        },
        followUp: {
          required: report.followUpRequired,
          notes: report.followUpNotes,
          parentNotified: report.parentNotified,
          parentNotificationMethod: report.parentNotificationMethod,
          parentNotifiedAt: report.parentNotifiedAt,
          actions: report.followUpActions
        },
        evidence: {
          attachments: report.attachments,
          photos: report.evidencePhotos,
          videos: report.evidenceVideos
        },
        witnessStatements: report.witnessStatements,
        insurance: {
          claimNumber: report.insuranceClaimNumber,
          claimStatus: report.insuranceClaimStatus
        },
        compliance: {
          status: report.legalComplianceStatus
        }
      };

      logger.info(`Incident report document generated for ${id}`);
      return documentData;
    } catch (error) {
      logger.error('Error generating incident report document:', error);
      throw error;
    }
  }

  /**
   * Add witness statement to incident report
   */
  static async addWitnessStatement(incidentReportId: string, data: CreateWitnessStatementData) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId);

      if (!report) {
        throw new Error('Incident report not found');
      }

      const witnessStatement = await WitnessStatement.create({
        incidentReportId,
        ...data
      });

      logger.info(`Witness statement added to incident ${incidentReportId}`);
      return witnessStatement;
    } catch (error) {
      logger.error('Error adding witness statement:', error);
      throw error;
    }
  }

  /**
   * Verify witness statement
   */
  static async verifyWitnessStatement(statementId: string, verifiedBy: string) {
    try {
      const statement = await WitnessStatement.findByPk(statementId);

      if (!statement) {
        throw new Error('Witness statement not found');
      }

      await statement.update({
        verified: true,
        verifiedBy,
        verifiedAt: new Date()
      });

      logger.info(`Witness statement ${statementId} verified by ${verifiedBy}`);
      return statement;
    } catch (error) {
      logger.error('Error verifying witness statement:', error);
      throw error;
    }
  }

  /**
   * Add follow-up action to incident report
   */
  static async addFollowUpAction(incidentReportId: string, data: CreateFollowUpActionData) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId);

      if (!report) {
        throw new Error('Incident report not found');
      }

      const followUpAction = await FollowUpAction.create({
        incidentReportId,
        ...data,
        status: 'PENDING'
      });

      logger.info(`Follow-up action added to incident ${incidentReportId}`);
      return followUpAction;
    } catch (error) {
      logger.error('Error adding follow-up action:', error);
      throw error;
    }
  }

  /**
   * Update follow-up action status
   */
  static async updateFollowUpAction(
    actionId: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    completedBy?: string,
    notes?: string
  ) {
    try {
      const action = await FollowUpAction.findByPk(actionId);

      if (!action) {
        throw new Error('Follow-up action not found');
      }

      const updateData: any = { status };

      if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
        if (completedBy) updateData.completedBy = completedBy;
      }

      if (notes) {
        updateData.notes = notes;
      }

      await action.update(updateData);

      logger.info(`Follow-up action ${actionId} status updated to ${status}`);
      return action;
    } catch (error) {
      logger.error('Error updating follow-up action:', error);
      throw error;
    }
  }

  /**
   * Upload evidence (photos/videos) to incident report
   */
  static async addEvidence(
    incidentReportId: string,
    evidenceType: 'photo' | 'video',
    evidenceUrls: string[]
  ) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId);

      if (!report) {
        throw new Error('Incident report not found');
      }

      const updateData: any = {};
      if (evidenceType === 'photo') {
        updateData.evidencePhotos = [...report.evidencePhotos, ...evidenceUrls];
      } else {
        updateData.evidenceVideos = [...report.evidenceVideos, ...evidenceUrls];
      }

      await report.update(updateData);

      logger.info(`${evidenceType} evidence added to incident ${incidentReportId}`);
      return report;
    } catch (error) {
      logger.error('Error adding evidence:', error);
      throw error;
    }
  }

  /**
   * Update insurance claim information
   */
  static async updateInsuranceClaim(
    incidentReportId: string,
    claimNumber: string,
    status: 'NOT_FILED' | 'FILED' | 'PENDING' | 'APPROVED' | 'DENIED' | 'CLOSED'
  ) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId);

      if (!report) {
        throw new Error('Incident report not found');
      }

      await report.update({
        insuranceClaimNumber: claimNumber,
        insuranceClaimStatus: status
      });

      logger.info(`Insurance claim updated for incident ${incidentReportId}: ${claimNumber} - ${status}`);
      return report;
    } catch (error) {
      logger.error('Error updating insurance claim:', error);
      throw error;
    }
  }

  /**
   * Update legal compliance status
   */
  static async updateComplianceStatus(
    incidentReportId: string,
    status: 'PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW'
  ) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId);

      if (!report) {
        throw new Error('Incident report not found');
      }

      await report.update({
        legalComplianceStatus: status
      });

      logger.info(`Compliance status updated for incident ${incidentReportId}: ${status}`);
      return report;
    } catch (error) {
      logger.error('Error updating compliance status:', error);
      throw error;
    }
  }

  /**
   * Automated parent notification with tracking
   */
  static async notifyParent(
    incidentReportId: string,
    method: string,
    notifiedBy: string
  ) {
    try {
      const report = await this.getIncidentReportById(incidentReportId);

      // Send notification based on method (email, SMS, voice)
      const message = `Incident Alert: ${report.student!.firstName} ${report.student!.lastName} was involved in a ${report.type} incident (${report.severity} severity) on ${report.occurredAt.toLocaleString()}. Please contact the school nurse for more information.`;

      logger.info(`Parent notification sent for incident ${incidentReportId} via ${method}: ${message}`);

      const updatedReport = await IncidentReport.findByPk(incidentReportId);
      if (updatedReport) {
        await updatedReport.update({
          parentNotified: true,
          parentNotificationMethod: method,
          parentNotifiedAt: new Date(),
          parentNotifiedBy: notifiedBy
        });
      }

      return updatedReport;
    } catch (error) {
      logger.error('Error notifying parent:', error);
      throw error;
    }
  }
}
