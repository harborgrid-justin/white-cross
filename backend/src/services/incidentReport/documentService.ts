/**
 * WC-GEN-261 | documentService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: ../../utils/logger, ../../database/models, ./types
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { logger } from '../../utils/logger';
import { IncidentReport, Student, User, WitnessStatement, FollowUpAction } from '../../database/models';
import { IncidentReportDocumentData } from './types';

export class DocumentService {
  /**
   * Generate incident report document (for legal/insurance purposes)
   */
  static async generateIncidentReportDocument(id: string): Promise<IncidentReportDocumentData> {
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
      const documentData: IncidentReportDocumentData = {
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
   * Generate incident summary report
   */
  static async generateIncidentSummary(id: string) {
    try {
      const report = await IncidentReport.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName', 'role']
          }
        ]
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      const summary = {
        reportId: report.id,
        reportNumber: `INC-${report.id.slice(-8).toUpperCase()}`,
        student: `${report.student!.firstName} ${report.student!.lastName} (${report.student!.studentNumber})`,
        grade: report.student!.grade,
        incidentType: report.type,
        severity: report.severity,
        occurredAt: report.occurredAt,
        location: report.location,
        description: report.description.substring(0, 200) + (report.description.length > 200 ? '...' : ''),
        reportedBy: `${report.reportedBy!.firstName} ${report.reportedBy!.lastName}`,
        reporterRole: report.reportedBy!.role,
        reportedAt: report.createdAt,
        parentNotified: report.parentNotified,
        followUpRequired: report.followUpRequired,
        actionsTaken: report.actionsTaken.substring(0, 150) + (report.actionsTaken.length > 150 ? '...' : ''),
        status: this.getIncidentStatus(report)
      };

      return summary;
    } catch (error) {
      logger.error('Error generating incident summary:', error);
      throw error;
    }
  }

  /**
   * Generate multiple incident reports summary
   */
  static async generateMultipleIncidentsSummary(incidentIds: string[]) {
    try {
      const reports = await IncidentReport.findAll({
        where: {
          id: incidentIds
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName', 'role']
          }
        ],
        order: [['occurredAt', 'DESC']]
      });

      const summaries = reports.map(report => ({
        reportId: report.id,
        reportNumber: `INC-${report.id.slice(-8).toUpperCase()}`,
        student: `${report.student!.firstName} ${report.student!.lastName}`,
        studentNumber: report.student!.studentNumber,
        grade: report.student!.grade,
        type: report.type,
        severity: report.severity,
        occurredAt: report.occurredAt,
        location: report.location,
        reportedBy: `${report.reportedBy!.firstName} ${report.reportedBy!.lastName}`,
        status: this.getIncidentStatus(report)
      }));

      return {
        generatedAt: new Date(),
        totalReports: summaries.length,
        reports: summaries,
        summary: {
          bySeverity: this.groupBy(summaries, 'severity'),
          byType: this.groupBy(summaries, 'type'),
          byLocation: this.groupBy(summaries, 'location')
        }
      };
    } catch (error) {
      logger.error('Error generating multiple incidents summary:', error);
      throw error;
    }
  }

  /**
   * Generate witness statements document
   */
  static async generateWitnessStatementsDocument(incidentId: string) {
    try {
      const report = await IncidentReport.findByPk(incidentId, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber']
          },
          {
            model: WitnessStatement,
            as: 'witnessStatements',
            order: [['createdAt', 'ASC']]
          }
        ]
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      return {
        reportNumber: `INC-${report.id.slice(-8).toUpperCase()}`,
        generatedAt: new Date(),
        incident: {
          student: `${report.student!.firstName} ${report.student!.lastName}`,
          studentNumber: report.student!.studentNumber,
          type: report.type,
          severity: report.severity,
          occurredAt: report.occurredAt,
          location: report.location
        },
        witnessStatements: report.witnessStatements?.map((statement, index) => ({
          number: index + 1,
          witnessName: statement.witnessName,
          witnessType: statement.witnessType,
          witnessContact: statement.witnessContact,
          statement: statement.statement,
          verified: statement.verified,
          verifiedBy: statement.verifiedBy,
          verifiedAt: statement.verifiedAt,
          providedAt: statement.createdAt
        })) || [],
        totalStatements: report.witnessStatements?.length || 0
      };
    } catch (error) {
      logger.error('Error generating witness statements document:', error);
      throw error;
    }
  }

  /**
   * Generate follow-up actions report
   */
  static async generateFollowUpActionsDocument(incidentId: string) {
    try {
      const report = await IncidentReport.findByPk(incidentId, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber']
          },
          {
            model: FollowUpAction,
            as: 'followUpActions',
            order: [['dueDate', 'ASC']]
          }
        ]
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      return {
        reportNumber: `INC-${report.id.slice(-8).toUpperCase()}`,
        generatedAt: new Date(),
        incident: {
          student: `${report.student!.firstName} ${report.student!.lastName}`,
          studentNumber: report.student!.studentNumber,
          type: report.type,
          severity: report.severity,
          occurredAt: report.occurredAt
        },
        followUpActions: report.followUpActions?.map((action, index) => ({
          number: index + 1,
          action: action.action,
          priority: action.priority,
          status: action.status,
          assignedTo: action.assignedTo,
          dueDate: action.dueDate,
          completedAt: action.completedAt,
          completedBy: action.completedBy,
          notes: action.notes,
          createdAt: action.createdAt
        })) || [],
        totalActions: report.followUpActions?.length || 0,
        summary: {
          pending: report.followUpActions?.filter(a => a.status === 'PENDING').length || 0,
          completed: report.followUpActions?.filter(a => a.status === 'COMPLETED').length || 0,
          overdue: report.followUpActions?.filter(a => 
            a.status === 'PENDING' && new Date(a.dueDate) < new Date()
          ).length || 0
        }
      };
    } catch (error) {
      logger.error('Error generating follow-up actions document:', error);
      throw error;
    }
  }

  /**
   * Generate compliance document
   */
  static async generateComplianceDocument(incidentId: string) {
    try {
      const report = await IncidentReport.findByPk(incidentId, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber', 'dateOfBirth']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName', 'role']
          }
        ]
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      return {
        reportNumber: `INC-${report.id.slice(-8).toUpperCase()}`,
        generatedAt: new Date(),
        documentType: 'COMPLIANCE_REPORT',
        student: {
          name: `${report.student!.firstName} ${report.student!.lastName}`,
          studentNumber: report.student!.studentNumber,
          dateOfBirth: report.student!.dateOfBirth
        },
        incident: {
          type: report.type,
          severity: report.severity,
          occurredAt: report.occurredAt,
          location: report.location,
          description: report.description
        },
        reporter: {
          name: `${report.reportedBy!.firstName} ${report.reportedBy!.lastName}`,
          role: report.reportedBy!.role,
          reportedAt: report.createdAt
        },
        compliance: {
          status: report.legalComplianceStatus || 'PENDING_REVIEW',
          parentNotified: report.parentNotified,
          parentNotificationMethod: report.parentNotificationMethod,
          parentNotifiedAt: report.parentNotifiedAt,
          followUpRequired: report.followUpRequired,
          followUpNotes: report.followUpNotes
        },
        insurance: {
          claimNumber: report.insuranceClaimNumber,
          claimStatus: report.insuranceClaimStatus
        },
        evidence: {
          hasPhotos: (report.evidencePhotos || []).length > 0,
          hasVideos: (report.evidenceVideos || []).length > 0,
          hasAttachments: (report.attachments || []).length > 0,
          totalEvidenceFiles: (report.evidencePhotos || []).length + 
                             (report.evidenceVideos || []).length + 
                             (report.attachments || []).length
        }
      };
    } catch (error) {
      logger.error('Error generating compliance document:', error);
      throw error;
    }
  }

  /**
   * Get incident status based on various factors
   */
  private static getIncidentStatus(report: any): string {
    if (report.followUpRequired && !report.followUpNotes) {
      return 'PENDING_FOLLOW_UP';
    }
    if (!report.parentNotified && ['HIGH', 'CRITICAL'].includes(report.severity)) {
      return 'PENDING_NOTIFICATION';
    }
    if (report.insuranceClaimNumber && report.insuranceClaimStatus === 'PENDING') {
      return 'INSURANCE_PENDING';
    }
    if (report.legalComplianceStatus === 'NON_COMPLIANT') {
      return 'COMPLIANCE_ISSUE';
    }
    return 'COMPLETED';
  }

  /**
   * Group array items by property
   */
  private static groupBy(array: any[], property: string): Record<string, number> {
    return array.reduce((acc, item) => {
      const key = item[property];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Generate comprehensive incident package (all documents)
   */
  static async generateComprehensivePackage(incidentId: string) {
    try {
      const [
        mainDocument,
        summary,
        witnessStatements,
        followUpActions,
        complianceDocument
      ] = await Promise.all([
        this.generateIncidentReportDocument(incidentId),
        this.generateIncidentSummary(incidentId),
        this.generateWitnessStatementsDocument(incidentId),
        this.generateFollowUpActionsDocument(incidentId),
        this.generateComplianceDocument(incidentId)
      ]);

      return {
        packageType: 'COMPREHENSIVE_INCIDENT_PACKAGE',
        generatedAt: new Date(),
        incidentId,
        reportNumber: mainDocument.reportNumber,
        documents: {
          mainReport: mainDocument,
          summary,
          witnessStatements,
          followUpActions,
          compliance: complianceDocument
        },
        metadata: {
          totalDocuments: 5,
          packageVersion: '1.0',
          generatedBy: 'INCIDENT_REPORTING_SYSTEM'
        }
      };
    } catch (error) {
      logger.error('Error generating comprehensive package:', error);
      throw error;
    }
  }
}
