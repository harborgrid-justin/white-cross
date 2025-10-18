/**
 * WC-SVC-INC-CORE-005 | Incident Report Core Business Logic Service
 * Purpose: CRUD operations, incident lifecycle management, student safety tracking
 * Upstream: database/models, utils/logger, ./types, ./validationService, ./notificationService
 * Downstream: routes/incidentReports, ./index, other incident services | Called by: API routes
 * Related: models/IncidentReport, Student, User, EmergencyContact, ./notificationService
 * Exports: IncidentCoreService (static methods) | Key Services: Create, read, update incidents
 * Last Updated: 2025-10-17 | Dependencies: sequelize, database models, validation
 * Critical Path: Validation → Database operations → Notifications → Response
 * LLM Context: Central incident management, handles student safety, emergency notifications
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { IncidentReport, Student, User, EmergencyContact } from '../../database/models';
import { CreateIncidentReportData, UpdateIncidentReportData, IncidentFilters } from './types';
import { IncidentValidationService } from './validationService';
import { NotificationService } from './notificationService';

export class IncidentCoreService {
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
   * Create new incident report with comprehensive validation
   */
  static async createIncidentReport(data: CreateIncidentReportData) {
    try {
      const { student, reporter } = await IncidentValidationService.validateIncidentReportData(data);

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
        await NotificationService.notifyEmergencyContacts(report.id);
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
}
