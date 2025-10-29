import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { IncidentReport } from '../../database/models/incident-report.model';
import { CreateIncidentReportDto } from '../dto/create-incident-report.dto';
import { UpdateIncidentReportDto } from '../dto/update-incident-report.dto';
import { IncidentFiltersDto } from '../dto/incident-filters.dto';
import { IncidentValidationService } from './incident-validation.service';
import { IncidentNotificationService } from './incident-notification.service';
import { IncidentSeverity } from '../enums';

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
        [Op.between]: [new Date(filterParams.dateFrom), new Date(filterParams.dateTo)],
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

    const { rows: reports, count: total } = await this.incidentReportModel.findAndCountAll({
      where,
      offset,
      limit,
      order: [['occurredAt', 'DESC']],
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
   */
  async getIncidentReportById(id: string): Promise<IncidentReport> {
    const report = await this.incidentReportModel.findByPk(id);

    if (!report) {
      throw new NotFoundException('Incident report not found');
    }

    return report;
  }

  /**
   * Create new incident report with comprehensive validation
   */
  async createIncidentReport(dto: CreateIncidentReportDto): Promise<IncidentReport> {
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
        [IncidentSeverity.HIGH, IncidentSeverity.CRITICAL].includes(dto.severity)
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
      const reports = await this.incidentReportModel.findAll({
        where: { followUpRequired: true },
        order: [['occurredAt', 'DESC']],
      });

      return reports;
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
      const reports = await this.incidentReportModel.findAll({
        where: { studentId },
        order: [['occurredAt', 'DESC']],
        limit,
      });

      return reports;
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

      this.logger.log(`Follow-up notes added for incident ${id} by ${completedBy}`);
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
        report.evidencePhotos = [...(report.evidencePhotos || []), ...evidenceUrls];
      } else if (evidenceType === 'video') {
        report.evidenceVideos = [...(report.evidenceVideos || []), ...evidenceUrls];
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

      this.logger.log(`Insurance claim updated for incident ${id}: ${claimNumber}`);
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

      this.logger.log(`Compliance status updated for incident ${id}: ${status}`);
      return updatedReport;
    } catch (error) {
      this.logger.error('Error updating compliance status:', error);
      throw error;
    }
  }
}
