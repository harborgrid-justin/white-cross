import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { IncidentReport } from '@/database';
import { CreateIncidentReportDto } from '../dto/create-incident-report.dto';
import { IncidentFiltersDto } from '../dto/incident-filters.dto';
import { UpdateIncidentReportDto } from '../dto/update-incident-report.dto';
import { IncidentNotificationService } from './incident-notification.service';
import { IncidentValidationService } from './incident-validation.service';
import { IncidentSeverity } from '../enums/incident-severity.enum';

@Injectable()
export class IncidentCoreService {
  private readonly logger = new Logger(IncidentCoreService.name);

  constructor(
    @InjectModel(IncidentReport)
    private incidentReportModel: typeof IncidentReport,
    private validationService: IncidentValidationService,
    private notificationService: IncidentNotificationService,
  ) {}

  /**
   * Get incident reports with pagination and filters
   * OPTIMIZED: Added eager loading for student and reporter relations to prevent N+1 queries
   */
  async getIncidentReports(filters: IncidentFiltersDto) {
    const { page = 1, limit = 20, ...filterParams } = filters;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (filterParams.studentId) {
      where.studentId = filterParams.studentId;
    }

    if (filterParams.reportedById) {
      where.reportedById = filterParams.reportedById;
    }

    if (filterParams.type) {
      where.type = filterParams.type;
    }

    if (filterParams.severity) {
      where.severity = filterParams.severity;
    }

    if (filterParams.dateFrom && filterParams.dateTo) {
      where.occurredAt = {
        [Op.between]: [
          new Date(filterParams.dateFrom),
          new Date(filterParams.dateTo),
        ],
      };
    } else if (filterParams.dateFrom) {
      where.occurredAt = {
        [Op.gte]: new Date(filterParams.dateFrom),
      };
    } else if (filterParams.dateTo) {
      where.occurredAt = {
        [Op.lte]: new Date(filterParams.dateTo),
      };
    }

    if (filterParams.parentNotified !== undefined) {
      where.parentNotified = filterParams.parentNotified;
    }

    if (filterParams.followUpRequired !== undefined) {
      where.followUpRequired = filterParams.followUpRequired;
    }

    const { rows: reports, count: total } =
      await this.incidentReportModel.findAndCountAll({
        where,
        offset,
        limit,
        order: [['occurredAt', 'DESC']],
        // OPTIMIZATION: Eager load related entities to prevent N+1 queries
        // Before: 1 query + N queries for student + N queries for reporter = 1 + 2N queries
        // After: 1 query with JOINs = 1 query total
        include: [
          {
            association: 'student',
            attributes: [
              'id',
              'studentNumber',
              'firstName',
              'lastName',
              'grade',
            ],
            required: false, // LEFT JOIN to handle orphaned records
          },
          {
            association: 'reporter',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            required: false, // LEFT JOIN to handle orphaned records
          },
        ],
        // Prevent duplicate counts when using includes
        distinct: true,
      });

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get incident report by ID
   * OPTIMIZED: Added eager loading for related entities
   */
  async getIncidentReportById(id: string): Promise<IncidentReport> {
    const report = await this.incidentReportModel.findByPk(id, {
      // OPTIMIZATION: Eager load related entities to prevent N+1 queries
      include: [
        {
          association: 'student',
          attributes: [
            'id',
            'studentNumber',
            'firstName',
            'lastName',
            'grade',
            'dateOfBirth',
          ],
          required: false,
        },
        {
          association: 'reporter',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          required: false,
        },
      ],
    });

    if (!report) {
      throw new NotFoundException('Incident report not found');
    }

    return report;
  }

  /**
   * Create new incident report with comprehensive validation
   */
  async createIncidentReport(
    dto: CreateIncidentReportDto,
  ): Promise<IncidentReport> {
    try {
      // Validate incident data
      await this.validationService.validateIncidentReportData(dto);

      // Create the report
      const savedReport = await this.incidentReportModel.create(dto as any);

      this.logger.log(
        `Incident report created: ${dto.type} (${dto.severity}) for student ${dto.studentId} by ${dto.reportedById}`,
      );

      // Auto-notify for high/critical incidents
      if (
        [IncidentSeverity.HIGH, IncidentSeverity.CRITICAL].includes(
          dto.severity,
        )
      ) {
        // Asynchronously notify emergency contacts (don't block the response)
        this.notificationService
          .notifyEmergencyContacts(savedReport.id)
          .catch((error) => {
            this.logger.error('Failed to send emergency notifications', error);
          });
      }

      return savedReport;
    } catch (error) {
      this.logger.error('Error creating incident report:', error);
      throw error;
    }
  }

  /**
   * Update incident report
   */
  async updateIncidentReport(
    id: string,
    dto: UpdateIncidentReportDto,
  ): Promise<IncidentReport> {
    try {
      const existingReport = await this.getIncidentReportById(id);

      // Merge the updates
      Object.assign(existingReport, dto);

      const updatedReport = await existingReport.save();

      this.logger.log(`Incident report updated: ${id}`);
      return updatedReport;
    } catch (error) {
      this.logger.error('Error updating incident report:', error);
      throw error;
    }
  }

  /**
   * Get incidents requiring follow-up
   */
  async getIncidentsRequiringFollowUp(): Promise<IncidentReport[]> {
    try {
      return await this.incidentReportModel.findAll({
        where: { followUpRequired: true },
        order: [['occurredAt', 'DESC']],
      });
    } catch (error) {
      this.logger.error('Error fetching incidents requiring follow-up:', error);
      throw error;
    }
  }

  /**
   * Get recent incidents for a student
   */
  async getStudentRecentIncidents(
    studentId: string,
    limit: number = 5,
  ): Promise<IncidentReport[]> {
    try {
      return await this.incidentReportModel.findAll({
        where: { studentId },
        order: [['occurredAt', 'DESC']],
        limit,
      });
    } catch (error) {
      this.logger.error('Error fetching student recent incidents:', error);
      throw error;
    }
  }

  /**
   * Add follow-up notes
   */
  async addFollowUpNotes(
    id: string,
    notes: string,
    completedBy: string,
  ): Promise<IncidentReport> {
    try {
      const report = await this.getIncidentReportById(id);

      report.followUpNotes = notes;
      report.followUpRequired = false; // Mark as completed

      const updatedReport = await report.save();

      this.logger.log(
        `Follow-up notes added for incident ${id} by ${completedBy}`,
      );
      return updatedReport;
    } catch (error) {
      this.logger.error('Error adding follow-up notes:', error);
      throw error;
    }
  }

  /**
   * Mark parent as notified
   */
  async markParentNotified(
    id: string,
    notificationMethod?: string,
    notifiedBy?: string,
  ): Promise<IncidentReport> {
    try {
      const report = await this.getIncidentReportById(id);

      report.parentNotified = true;
      report.parentNotificationMethod = notificationMethod || 'manual';
      report.parentNotifiedAt = new Date();

      if (notificationMethod) {
        const methodNote = notificationMethod
          ? `Parent notified via ${notificationMethod}${notifiedBy ? ` by ${notifiedBy}` : ''}`
          : 'Parent notified';

        report.followUpNotes = report.followUpNotes
          ? `${report.followUpNotes}\n${methodNote}`
          : methodNote;
      }

      const updatedReport = await report.save();

      this.logger.log(`Parent notification marked for incident ${id}`);
      return updatedReport;
    } catch (error) {
      this.logger.error('Error marking parent as notified:', error);
      throw error;
    }
  }

  /**
   * Add evidence to incident report
   */
  async addEvidence(
    id: string,
    evidenceType: 'photo' | 'video' | 'attachment',
    evidenceUrls: string[],
  ): Promise<IncidentReport> {
    try {
      const report = await this.getIncidentReportById(id);

      // Validate URLs
      this.validationService.validateEvidenceUrls(evidenceUrls);

      // Add evidence based on type
      if (evidenceType === 'photo') {
        report.evidencePhotos = [
          ...(report.evidencePhotos || []),
          ...evidenceUrls,
        ];
      } else if (evidenceType === 'video') {
        report.evidenceVideos = [
          ...(report.evidenceVideos || []),
          ...evidenceUrls,
        ];
      } else if (evidenceType === 'attachment') {
        report.attachments = [...(report.attachments || []), ...evidenceUrls];
      }

      const updatedReport = await report.save();

      this.logger.log(
        `${evidenceType} evidence added to incident ${id}: ${evidenceUrls.length} files`,
      );
      return updatedReport;
    } catch (error) {
      this.logger.error('Error adding evidence:', error);
      throw error;
    }
  }

  /**
   * Update insurance claim information
   */
  async updateInsuranceClaim(
    id: string,
    claimNumber: string,
    status: string,
  ): Promise<IncidentReport> {
    try {
      const report = await this.getIncidentReportById(id);

      report.insuranceClaimNumber = claimNumber;
      report.insuranceClaimStatus = status as any;

      const updatedReport = await report.save();

      this.logger.log(
        `Insurance claim updated for incident ${id}: ${claimNumber}`,
      );
      return updatedReport;
    } catch (error) {
      this.logger.error('Error updating insurance claim:', error);
      throw error;
    }
  }

  /**
   * Update compliance status
   */
  async updateComplianceStatus(
    id: string,
    status: string,
  ): Promise<IncidentReport> {
    try {
      const report = await this.getIncidentReportById(id);

      report.legalComplianceStatus = status as any;

      const updatedReport = await report.save();

      this.logger.log(
        `Compliance status updated for incident ${id}: ${status}`,
      );
      return updatedReport;
    } catch (error) {
      this.logger.error('Error updating compliance status:', error);
      throw error;
    }
  }

  // ==================== Batch Query Methods (DataLoader Support) ====================

  /**
   * Batch find incident reports by IDs (for DataLoader)
   * Returns incident reports in the same order as requested IDs
   *
   * OPTIMIZATION: Eliminates N+1 queries when fetching multiple incident reports
   * Before: 1 + N queries (1 per incident)
   * After: 1 query with IN clause
   * Performance improvement: ~99% query reduction for batch operations
   */
  async findByIds(ids: string[]): Promise<(IncidentReport | null)[]> {
    try {
      const incidents = await this.incidentReportModel.findAll({
        where: {
          id: { [Op.in]: ids },
        },
        include: [
          {
            association: 'student',
            attributes: [
              'id',
              'studentNumber',
              'firstName',
              'lastName',
              'grade',
            ],
            required: false,
          },
          {
            association: 'reporter',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            required: false,
          },
        ],
        order: [['occurredAt', 'DESC']],
      });

      // Create map for O(1) lookup
      const incidentMap = new Map(incidents.map((i) => [i.id, i]));

      // Return in same order as input, null for missing
      return ids.map((id) => incidentMap.get(id) || null);
    } catch (error) {
      this.logger.error(
        `Failed to batch fetch incident reports: ${error.message}`,
        error.stack,
      );
      // Return array of nulls on error to prevent breaking entire query
      return ids.map(() => null);
    }
  }

  /**
   * Batch find incident reports by student IDs (for DataLoader)
   * Returns array of incident report arrays for each student ID
   *
   * OPTIMIZATION: Eliminates N+1 queries when fetching incident reports for multiple students
   * Before: 1 + N queries (1 per student)
   * After: 1 query with IN clause
   * Performance improvement: ~99% query reduction for batch operations
   */
  async findByStudentIds(studentIds: string[]): Promise<IncidentReport[][]> {
    try {
      const incidents = await this.incidentReportModel.findAll({
        where: {
          studentId: { [Op.in]: studentIds },
        },
        include: [
          {
            association: 'student',
            attributes: [
              'id',
              'studentNumber',
              'firstName',
              'lastName',
              'grade',
            ],
            required: false,
          },
          {
            association: 'reporter',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            required: false,
          },
        ],
        order: [['occurredAt', 'DESC']],
      });

      // Group incidents by student ID
      const incidentsByStudent = new Map<string, IncidentReport[]>();
      for (const incident of incidents) {
        if (!incidentsByStudent.has(incident.studentId)) {
          incidentsByStudent.set(incident.studentId, []);
        }
        incidentsByStudent.get(incident.studentId)!.push(incident);
      }

      // Return incidents in same order as requested student IDs
      // Return empty array for students with no incident reports
      return studentIds.map(
        (studentId) => incidentsByStudent.get(studentId) || [],
      );
    } catch (error) {
      this.logger.error(
        `Failed to batch fetch incident reports by student IDs: ${error.message}`,
        error.stack,
      );
      // Return array of empty arrays on error to prevent breaking entire query
      return studentIds.map(() => []);
    }
  }
}
