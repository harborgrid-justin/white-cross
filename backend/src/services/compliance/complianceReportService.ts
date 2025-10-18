/**
 * WC-GEN-237 | complianceReportService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: ../../utils/logger, ../../database/models, ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { logger } from '../../utils/logger';
import {
  ComplianceReport,
  ComplianceChecklistItem,
  User
} from '../../database/models';
import {
  ComplianceStatus
} from '../../database/types/enums';
import {
  CreateComplianceReportData,
  ComplianceReportFilters,
  PaginationResult,
  UpdateComplianceReportData
} from './types';

export class ComplianceReportService {
  /**
   * Get all compliance reports with pagination and filters
   */
  static async getComplianceReports(
    page: number = 1,
    limit: number = 20,
    filters: ComplianceReportFilters = {}
  ): Promise<{
    reports: ComplianceReport[];
    pagination: PaginationResult;
  }> {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (filters.reportType) {
        whereClause.reportType = filters.reportType;
      }
      if (filters.status) {
        whereClause.status = filters.status;
      }
      if (filters.period) {
        whereClause.period = filters.period;
      }

      const { rows: reports, count: total } = await ComplianceReport.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: ComplianceChecklistItem,
            as: 'items',
            required: false
          }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      logger.info(`Retrieved ${reports.length} compliance reports`);

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
      logger.error('Error getting compliance reports:', error);
      throw new Error('Failed to fetch compliance reports');
    }
  }

  /**
   * Get compliance report by ID
   */
  static async getComplianceReportById(id: string): Promise<ComplianceReport> {
    try {
      const report = await ComplianceReport.findByPk(id, {
        include: [
          {
            model: ComplianceChecklistItem,
            as: 'items',
            required: false
          }
        ],
        order: [[{ model: ComplianceChecklistItem, as: 'items' }, 'createdAt', 'ASC']]
      });

      if (!report) {
        throw new Error('Compliance report not found');
      }

      logger.info(`Retrieved compliance report: ${id}`);
      return report;
    } catch (error) {
      logger.error(`Error getting compliance report ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new compliance report
   */
  static async createComplianceReport(data: CreateComplianceReportData): Promise<ComplianceReport> {
    try {
      // Verify user exists
      const user = await User.findByPk(data.createdById);
      if (!user) {
        throw new Error('User not found');
      }

      const report = await ComplianceReport.create({
        reportType: data.reportType,
        title: data.title,
        description: data.description,
        status: ComplianceStatus.PENDING,
        period: data.period,
        dueDate: data.dueDate,
        createdById: data.createdById
      });

      // Reload with associations
      await report.reload({
        include: [
          {
            model: ComplianceChecklistItem,
            as: 'items',
            required: false
          }
        ]
      });

      logger.info(`Created compliance report: ${report.id} - ${report.title}`);
      return report;
    } catch (error) {
      logger.error('Error creating compliance report:', error);
      throw error;
    }
  }

  /**
   * Update compliance report
   */
  static async updateComplianceReport(
    id: string,
    data: UpdateComplianceReportData
  ): Promise<ComplianceReport> {
    try {
      const existingReport = await ComplianceReport.findByPk(id);

      if (!existingReport) {
        throw new Error('Compliance report not found');
      }

      const updateData: any = {};
      if (data.status) updateData.status = data.status;
      if (data.findings !== undefined) updateData.findings = data.findings;
      if (data.recommendations !== undefined) updateData.recommendations = data.recommendations;
      if (data.submittedBy) updateData.submittedBy = data.submittedBy;
      if (data.reviewedBy) updateData.reviewedBy = data.reviewedBy;

      // Automatically set submission timestamp when status changes to COMPLIANT
      if (data.status === ComplianceStatus.COMPLIANT && !existingReport.submittedAt) {
        updateData.submittedAt = new Date();
      }

      // Set reviewed timestamp when reviewer is set
      if (data.reviewedBy && !existingReport.reviewedAt) {
        updateData.reviewedAt = new Date();
      }

      await existingReport.update(updateData);

      // Reload with associations
      await existingReport.reload({
        include: [
          {
            model: ComplianceChecklistItem,
            as: 'items',
            required: false
          }
        ]
      });

      logger.info(`Updated compliance report: ${id}`);
      return existingReport;
    } catch (error) {
      logger.error(`Error updating compliance report ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete compliance report
   */
  static async deleteComplianceReport(id: string): Promise<{ success: boolean }> {
    try {
      const report = await ComplianceReport.findByPk(id);

      if (!report) {
        throw new Error('Compliance report not found');
      }

      await report.destroy();

      logger.info(`Deleted compliance report: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error deleting compliance report ${id}:`, error);
      throw error;
    }
  }
}
