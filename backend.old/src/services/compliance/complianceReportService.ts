/**
 * @fileoverview Compliance Report Service - Healthcare compliance reporting and tracking
 *
 * This service manages the creation, tracking, and lifecycle management of healthcare compliance
 * reports required for regulatory adherence, accreditation, and quality assurance. Compliance
 * reports document the organization's adherence to healthcare regulations (HIPAA, OSHA, state
 * health department requirements), school health policies, and accreditation standards.
 *
 * Key responsibilities:
 * - Create and manage compliance reports with associated checklist items
 * - Track report status through lifecycle (PENDING → IN_PROGRESS → COMPLIANT/NON_COMPLIANT)
 * - Filter and paginate compliance reports by type, status, and reporting period
 * - Manage findings, recommendations, and review workflows
 * - Automatically track submission and review timestamps
 * - Associate reports with compliance checklists for structured evaluation
 *
 * HIPAA Compliance:
 * - Supports HIPAA compliance documentation and periodic reviews
 * - Maintains evidence of security rule compliance evaluations
 * - Tracks privacy rule adherence and policy review completion
 * - Provides audit trail for compliance officer activities
 *
 * Report Types:
 * - HIPAA Security Rule assessments
 * - Privacy practices annual reviews
 * - Immunization compliance tracking
 * - Medication administration audits
 * - Emergency preparedness reviews
 * - Staff training compliance
 * - Policy and procedure reviews
 *
 * Integration Points:
 * - Used by compliance officers for regulatory reporting
 * - Integrated with checklist service for structured evaluations
 * - Provides data for compliance dashboards and analytics
 * - Supports accreditation preparation and documentation
 *
 * @module services/compliance/complianceReportService
 * @since 1.0.0
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

/**
 * Compliance Report Service
 *
 * Manages healthcare compliance reports and their lifecycle from creation through submission
 * and review. Supports regulatory compliance documentation, accreditation preparation, and
 * quality assurance tracking for school health programs.
 *
 * @class
 * @example
 * ```typescript
 * // Create annual HIPAA compliance report
 * const report = await ComplianceReportService.createComplianceReport({
 *   reportType: 'HIPAA_ANNUAL_REVIEW',
 *   title: '2025 HIPAA Security and Privacy Assessment',
 *   description: 'Annual review of HIPAA compliance status',
 *   period: '2025-Q1',
 *   dueDate: new Date('2025-03-31'),
 *   createdById: 'compliance-officer-123'
 * });
 *
 * // Retrieve pending compliance reports
 * const pending = await ComplianceReportService.getComplianceReports(1, 20, {
 *   status: ComplianceStatus.PENDING
 * });
 * ```
 */
export class ComplianceReportService {
  /**
   * Retrieves paginated compliance reports with optional filtering.
   *
   * Provides comprehensive access to compliance reports with support for filtering by
   * report type, compliance status, and reporting period. Each report includes associated
   * checklist items for detailed compliance tracking. Results are ordered by creation date
   * (most recent first) for easy review of current compliance activities.
   *
   * @param {number} [page=1] - Page number for pagination (1-based indexing)
   * @param {number} [limit=20] - Number of records per page (default 20, recommended max 100)
   * @param {ComplianceReportFilters} [filters={}] - Optional filters to narrow results
   * @param {string} [filters.reportType] - Filter by report type (e.g., 'HIPAA_ANNUAL_REVIEW', 'IMMUNIZATION_AUDIT')
   * @param {ComplianceStatus} [filters.status] - Filter by compliance status (PENDING, IN_PROGRESS, COMPLIANT, NON_COMPLIANT)
   * @param {string} [filters.period] - Filter by reporting period (e.g., '2025-Q1', '2024-Annual')
   * @returns {Promise<{reports: ComplianceReport[], pagination: PaginationResult}>} Paginated compliance reports with checklist items
   * @throws {Error} When database query fails or connection issues occur
   *
   * @example
   * ```typescript
   * // Get all pending HIPAA reports for Q1
   * const hipaaReports = await ComplianceReportService.getComplianceReports(1, 50, {
   *   reportType: 'HIPAA_SECURITY_ASSESSMENT',
   *   status: ComplianceStatus.PENDING,
   *   period: '2025-Q1'
   * });
   *
   * console.log(`Found ${hipaaReports.pagination.total} pending HIPAA reports`);
   * hipaaReports.reports.forEach(report => {
   *   console.log(`${report.title}: ${report.items.length} checklist items`);
   * });
   *
   * // Get all compliance reports (no filters)
   * const allReports = await ComplianceReportService.getComplianceReports();
   * ```
   *
   * @since 1.0.0
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
   * Retrieves a specific compliance report by its unique identifier with all checklist items.
   *
   * Returns the complete compliance report including all associated checklist items ordered
   * chronologically. Used for detailed review, editing, and completion of compliance reports.
   * Essential for compliance officers reviewing specific regulatory assessments or audit findings.
   *
   * @param {string} id - Unique identifier of the compliance report
   * @returns {Promise<ComplianceReport>} The requested compliance report with all checklist items
   * @throws {Error} When compliance report is not found or database query fails
   *
   * @example
   * ```typescript
   * try {
   *   const report = await ComplianceReportService.getComplianceReportById('report-123');
   *   console.log(`${report.title} (${report.status})`);
   *   console.log(`Checklist: ${report.items.length} items`);
   *
   *   // Review findings and recommendations
   *   if (report.findings) {
   *     console.log('Findings:', report.findings);
   *   }
   *   if (report.recommendations) {
   *     console.log('Recommendations:', report.recommendations);
   *   }
   * } catch (error) {
   *   console.error('Compliance report not found');
   * }
   * ```
   *
   * @since 1.0.0
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
   * Creates a new compliance report with initial status and validation.
   *
   * This method creates a compliance report with status automatically set to PENDING.
   * The report creator (compliance officer or administrator) must exist in the system.
   * After creation, checklist items can be added separately using the ChecklistService.
   *
   * Workflow:
   * 1. Validate that the creator user exists
   * 2. Create report with PENDING status
   * 3. Set due date for completion tracking
   * 4. Reload with associations for complete report object
   *
   * Use Cases:
   * - Annual HIPAA security and privacy assessments
   * - Quarterly medication administration audits
   * - Monthly immunization compliance reviews
   * - Emergency preparedness evaluations
   * - Accreditation preparation documentation
   *
   * @param {CreateComplianceReportData} data - Compliance report creation data
   * @param {string} data.reportType - Type of compliance report (e.g., 'HIPAA_ANNUAL_REVIEW', 'MEDICATION_AUDIT')
   * @param {string} data.title - Title of the compliance report
   * @param {string} [data.description] - Detailed description of the report purpose and scope
   * @param {string} data.period - Reporting period (e.g., '2025-Q1', '2024-Annual', '2025-January')
   * @param {Date} [data.dueDate] - Due date for report completion
   * @param {string} data.createdById - ID of user creating the report (must exist in system)
   * @returns {Promise<ComplianceReport>} The newly created compliance report with PENDING status
   * @throws {Error} When creator user not found or database creation fails
   *
   * @example
   * ```typescript
   * // Create quarterly HIPAA assessment
   * const hipaaReport = await ComplianceReportService.createComplianceReport({
   *   reportType: 'HIPAA_SECURITY_ASSESSMENT',
   *   title: 'Q1 2025 HIPAA Security Rule Compliance Assessment',
   *   description: 'Quarterly review of technical, physical, and administrative safeguards',
   *   period: '2025-Q1',
   *   dueDate: new Date('2025-03-31'),
   *   createdById: 'compliance-officer-uuid'
   * });
   *
   * // Create monthly medication audit
   * const medReport = await ComplianceReportService.createComplianceReport({
   *   reportType: 'MEDICATION_ADMINISTRATION_AUDIT',
   *   title: 'January 2025 Medication Administration Compliance',
   *   period: '2025-January',
   *   dueDate: new Date('2025-02-05'),
   *   createdById: 'compliance-officer-uuid'
   * });
   *
   * console.log(`Report created: ${hipaaReport.id} - Status: ${hipaaReport.status}`);
   * ```
   *
   * @since 1.0.0
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
   * Updates an existing compliance report with validation and automatic timestamp tracking.
   *
   * This method allows updating compliance report status, findings, recommendations, and
   * review information. The service automatically manages submission and review timestamps
   * based on status changes and reviewer assignments.
   *
   * Automatic Timestamp Logic:
   * - When status changes to COMPLIANT and submittedAt is null → sets submittedAt to current time
   * - When reviewedBy is set and reviewedAt is null → sets reviewedAt to current time
   * - Preserves existing timestamps (does not overwrite)
   *
   * Status Workflow:
   * PENDING → IN_PROGRESS (work begins) → COMPLIANT/NON_COMPLIANT (review complete)
   *
   * @param {string} id - Unique identifier of the compliance report to update
   * @param {UpdateComplianceReportData} data - Fields to update
   * @param {ComplianceStatus} [data.status] - New compliance status (PENDING, IN_PROGRESS, COMPLIANT, NON_COMPLIANT)
   * @param {object} [data.findings] - Audit findings and compliance issues discovered
   * @param {object} [data.recommendations] - Recommended actions and corrective measures
   * @param {string} [data.submittedBy] - ID of user submitting the completed report
   * @param {string} [data.reviewedBy] - ID of user reviewing and approving the report
   * @returns {Promise<ComplianceReport>} The updated compliance report with all associations
   * @throws {Error} When compliance report not found or database update fails
   *
   * @example
   * ```typescript
   * // Mark report as in progress
   * await ComplianceReportService.updateComplianceReport('report-123', {
   *   status: ComplianceStatus.IN_PROGRESS
   * });
   *
   * // Submit completed report with findings
   * const completed = await ComplianceReportService.updateComplianceReport('report-123', {
   *   status: ComplianceStatus.COMPLIANT,
   *   findings: {
   *     overallStatus: 'COMPLIANT',
   *     issuesFound: 2,
   *     criticalIssues: 0,
   *     details: 'Minor documentation gaps identified'
   *   },
   *   recommendations: {
   *     actions: [
   *       'Update employee training records by Q2',
   *       'Review and update privacy notices'
   *     ]
   *   },
   *   submittedBy: 'compliance-officer-uuid'
   * });
   * // submittedAt automatically set to current timestamp
   *
   * // Reviewer approves report
   * const reviewed = await ComplianceReportService.updateComplianceReport('report-123', {
   *   reviewedBy: 'director-uuid'
   * });
   * // reviewedAt automatically set to current timestamp
   * ```
   *
   * @since 1.0.0
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
   * Deletes a compliance report and its associated data.
   *
   * This method permanently removes a compliance report from the system. Use with caution
   * as this operation cannot be undone. Associated checklist items may also be deleted
   * depending on cascade delete configuration in the database schema.
   *
   * Best Practices:
   * - Only delete draft reports that were created in error
   * - Consider soft delete or archival for submitted/reviewed reports
   * - Maintain audit trail of deletions for compliance purposes
   * - Restrict delete permission to compliance administrators
   *
   * Warning: This is a permanent deletion. For reports with historical compliance value,
   * consider updating status to ARCHIVED instead of deleting.
   *
   * @param {string} id - Unique identifier of the compliance report to delete
   * @returns {Promise<{success: boolean}>} Success indicator (true if deleted successfully)
   * @throws {Error} When compliance report not found or database deletion fails
   *
   * @example
   * ```typescript
   * // Delete draft report created in error
   * try {
   *   const result = await ComplianceReportService.deleteComplianceReport('report-123');
   *   if (result.success) {
   *     console.log('Draft report deleted successfully');
   *   }
   * } catch (error) {
   *   if (error.message === 'Compliance report not found') {
   *     console.log('Report already deleted or does not exist');
   *   } else {
   *     console.error('Failed to delete report:', error);
   *   }
   * }
   *
   * // Better alternative: Archive instead of delete
   * // await ComplianceReportService.updateComplianceReport('report-123', {
   * //   status: ComplianceStatus.ARCHIVED
   * // });
   * ```
   *
   * @since 1.0.0
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
