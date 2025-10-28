/**
 * LOC: 126BA1BC01
 * WC-GEN-262 | evidenceService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-262 | evidenceService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { IncidentReport } from '../../database/models';

export class EvidenceService {
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

      // Validate evidence URLs
      if (!evidenceUrls || evidenceUrls.length === 0) {
        throw new Error('Evidence URLs are required');
      }

      // Validate URL format (basic validation)
      const invalidUrls = evidenceUrls.filter(url => !this.isValidUrl(url));
      if (invalidUrls.length > 0) {
        throw new Error(`Invalid URLs detected: ${invalidUrls.join(', ')}`);
      }

      const updateData: any = {};
      if (evidenceType === 'photo') {
        updateData.evidencePhotos = [...(report.evidencePhotos || []), ...evidenceUrls];
      } else {
        updateData.evidenceVideos = [...(report.evidenceVideos || []), ...evidenceUrls];
      }

      await report.update(updateData);

      logger.info(`${evidenceType} evidence added to incident ${incidentReportId}: ${evidenceUrls.length} files`);
      return report;
    } catch (error) {
      logger.error('Error adding evidence:', error);
      throw error;
    }
  }

  /**
   * Remove evidence from incident report
   */
  static async removeEvidence(
    incidentReportId: string,
    evidenceType: 'photo' | 'video',
    evidenceUrl: string
  ) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId);

      if (!report) {
        throw new Error('Incident report not found');
      }

      const updateData: any = {};
      if (evidenceType === 'photo') {
        updateData.evidencePhotos = (report.evidencePhotos || []).filter(url => url !== evidenceUrl);
      } else {
        updateData.evidenceVideos = (report.evidenceVideos || []).filter(url => url !== evidenceUrl);
      }

      await report.update(updateData);

      logger.info(`${evidenceType} evidence removed from incident ${incidentReportId}: ${evidenceUrl}`);
      return report;
    } catch (error) {
      logger.error('Error removing evidence:', error);
      throw error;
    }
  }

  /**
   * Get all evidence for an incident
   */
  static async getIncidentEvidence(incidentReportId: string) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId, {
        attributes: ['id', 'evidencePhotos', 'evidenceVideos', 'attachments']
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      return {
        photos: report.evidencePhotos || [],
        videos: report.evidenceVideos || [],
        attachments: report.attachments || []
      };
    } catch (error) {
      logger.error('Error fetching incident evidence:', error);
      throw error;
    }
  }

  /**
   * Add general attachments to incident report
   */
  static async addAttachments(incidentReportId: string, attachmentUrls: string[]) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId);

      if (!report) {
        throw new Error('Incident report not found');
      }

      // Validate attachment URLs
      if (!attachmentUrls || attachmentUrls.length === 0) {
        throw new Error('Attachment URLs are required');
      }

      const invalidUrls = attachmentUrls.filter(url => !this.isValidUrl(url));
      if (invalidUrls.length > 0) {
        throw new Error(`Invalid URLs detected: ${invalidUrls.join(', ')}`);
      }

      const updateData = {
        attachments: [...(report.attachments || []), ...attachmentUrls]
      };

      await report.update(updateData);

      logger.info(`Attachments added to incident ${incidentReportId}: ${attachmentUrls.length} files`);
      return report;
    } catch (error) {
      logger.error('Error adding attachments:', error);
      throw error;
    }
  }

  /**
   * Remove attachment from incident report
   */
  static async removeAttachment(incidentReportId: string, attachmentUrl: string) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId);

      if (!report) {
        throw new Error('Incident report not found');
      }

      const updateData = {
        attachments: (report.attachments || []).filter(url => url !== attachmentUrl)
      };

      await report.update(updateData);

      logger.info(`Attachment removed from incident ${incidentReportId}: ${attachmentUrl}`);
      return report;
    } catch (error) {
      logger.error('Error removing attachment:', error);
      throw error;
    }
  }

  /**
   * Get evidence statistics for an incident
   */
  static async getEvidenceStatistics(incidentReportId: string) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId, {
        attributes: ['id', 'evidencePhotos', 'evidenceVideos', 'attachments']
      });

      if (!report) {
        throw new Error('Incident report not found');
      }

      const photoCount = (report.evidencePhotos || []).length;
      const videoCount = (report.evidenceVideos || []).length;
      const attachmentCount = (report.attachments || []).length;

      return {
        totalEvidence: photoCount + videoCount + attachmentCount,
        photos: photoCount,
        videos: videoCount,
        attachments: attachmentCount,
        hasEvidence: photoCount > 0 || videoCount > 0 || attachmentCount > 0
      };
    } catch (error) {
      logger.error('Error fetching evidence statistics:', error);
      throw error;
    }
  }

  /**
   * Get incidents with evidence
   */
  static async getIncidentsWithEvidence(page: number = 1, limit: number = 20) {
    try {
      const offset = (page - 1) * limit;

      const { rows: reports, count: total } = await IncidentReport.findAndCountAll({
        where: {
          [Op.or]: [
            { evidencePhotos: { [Op.ne]: null } },
            { evidenceVideos: { [Op.ne]: null } },
            { attachments: { [Op.ne]: null } }
          ]
        },
        attributes: ['id', 'type', 'severity', 'occurredAt', 'evidencePhotos', 'evidenceVideos', 'attachments'],
        offset,
        limit,
        order: [['occurredAt', 'DESC']]
      });

      return {
        reports: reports.map(report => ({
          ...report.toJSON(),
          evidenceCount: (report.evidencePhotos || []).length + 
                        (report.evidenceVideos || []).length + 
                        (report.attachments || []).length
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching incidents with evidence:', error);
      throw error;
    }
  }

  /**
   * Validate if a URL is properly formatted
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      // If it's not a full URL, check if it's a valid file path
      return url && url.length > 0 && !url.includes('..') && !url.startsWith('/');
    }
  }

  /**
   * Get evidence summary across all incidents
   */
  static async getEvidenceSummary(dateFrom?: Date, dateTo?: Date) {
    try {
      const whereClause: any = {};

      if (dateFrom || dateTo) {
        whereClause.occurredAt = {};
        if (dateFrom) {
          whereClause.occurredAt.$gte = dateFrom;
        }
        if (dateTo) {
          whereClause.occurredAt.$lte = dateTo;
        }
      }

      const reports = await IncidentReport.findAll({
        where: whereClause,
        attributes: ['id', 'evidencePhotos', 'evidenceVideos', 'attachments']
      });

      let totalPhotos = 0;
      let totalVideos = 0;
      let totalAttachments = 0;
      let incidentsWithEvidence = 0;

      reports.forEach(report => {
        const photoCount = (report.evidencePhotos || []).length;
        const videoCount = (report.evidenceVideos || []).length;
        const attachmentCount = (report.attachments || []).length;

        totalPhotos += photoCount;
        totalVideos += videoCount;
        totalAttachments += attachmentCount;

        if (photoCount > 0 || videoCount > 0 || attachmentCount > 0) {
          incidentsWithEvidence++;
        }
      });

      return {
        totalIncidents: reports.length,
        incidentsWithEvidence,
        evidenceRate: reports.length > 0 ? (incidentsWithEvidence / reports.length) * 100 : 0,
        totalPhotos,
        totalVideos,
        totalAttachments,
        totalEvidence: totalPhotos + totalVideos + totalAttachments
      };
    } catch (error) {
      logger.error('Error fetching evidence summary:', error);
      throw error;
    }
  }
}
