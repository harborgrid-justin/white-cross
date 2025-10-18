/**
 * WC-GEN-264 | insuranceService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { IncidentReport, Student } from '../../database/models';
import { InsuranceClaimStatus, ComplianceStatus } from '../../database/types/enums';

export class InsuranceService {
  /**
   * Update insurance claim information
   */
  static async updateInsuranceClaim(
    incidentReportId: string,
    claimNumber: string,
    status: InsuranceClaimStatus
  ) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId);

      if (!report) {
        throw new Error('Incident report not found');
      }

      // Validate claim number format (basic validation)
      if (!claimNumber || claimNumber.trim().length < 5) {
        throw new Error('Insurance claim number must be at least 5 characters');
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
    status: ComplianceStatus
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
   * Get incidents with insurance claims
   */
  static async getIncidentsWithClaims(page: number = 1, limit: number = 20) {
    try {
      const offset = (page - 1) * limit;

      const { rows: reports, count: total } = await IncidentReport.findAndCountAll({
        where: {
          insuranceClaimNumber: { [Op.ne]: null }
        },
        attributes: [
          'id', 'type', 'severity', 'occurredAt', 'studentId',
          'insuranceClaimNumber', 'insuranceClaimStatus', 'legalComplianceStatus'
        ],
        offset,
        limit,
        order: [['occurredAt', 'DESC']]
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
      logger.error('Error fetching incidents with insurance claims:', error);
      throw error;
    }
  }

  /**
   * Get incidents by claim status
   */
  static async getIncidentsByClaimStatus(status: InsuranceClaimStatus) {
    try {
      const reports = await IncidentReport.findAll({
        where: {
          insuranceClaimStatus: status
        },
        attributes: [
          'id', 'type', 'severity', 'occurredAt', 'studentId',
          'insuranceClaimNumber', 'insuranceClaimStatus', 'legalComplianceStatus'
        ],
        order: [['occurredAt', 'DESC']]
      });

      return reports;
    } catch (error) {
      logger.error('Error fetching incidents by claim status:', error);
      throw error;
    }
  }

  /**
   * Get incidents by compliance status
   */
  static async getIncidentsByComplianceStatus(status: ComplianceStatus) {
    try {
      const reports = await IncidentReport.findAll({
        where: {
          legalComplianceStatus: status
        },
        attributes: [
          'id', 'type', 'severity', 'occurredAt', 'studentId',
          'insuranceClaimNumber', 'insuranceClaimStatus', 'legalComplianceStatus'
        ],
        order: [['occurredAt', 'DESC']]
      });

      return reports;
    } catch (error) {
      logger.error('Error fetching incidents by compliance status:', error);
      throw error;
    }
  }

  /**
   * Get insurance and compliance statistics
   */
  static async getInsuranceStatistics(dateFrom?: Date, dateTo?: Date) {
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

      const [
        totalIncidents,
        incidentsWithClaims,
        pendingClaims,
        approvedClaims,
        deniedClaims,
        compliantIncidents,
        nonCompliantIncidents
      ] = await Promise.all([
        IncidentReport.count({ where: whereClause }),
        IncidentReport.count({
          where: { ...whereClause, insuranceClaimNumber: { [Op.ne]: null } }
        }),
        IncidentReport.count({
          where: { ...whereClause, insuranceClaimStatus: 'PENDING' }
        }),
        IncidentReport.count({
          where: { ...whereClause, insuranceClaimStatus: 'APPROVED' }
        }),
        IncidentReport.count({
          where: { ...whereClause, insuranceClaimStatus: 'DENIED' }
        }),
        IncidentReport.count({
          where: { ...whereClause, legalComplianceStatus: 'COMPLIANT' }
        }),
        IncidentReport.count({
          where: { ...whereClause, legalComplianceStatus: 'NON_COMPLIANT' }
        })
      ]);

      return {
        totalIncidents,
        incidentsWithClaims,
        claimRate: totalIncidents > 0 ? (incidentsWithClaims / totalIncidents) * 100 : 0,
        claimStatistics: {
          pending: pendingClaims,
          approved: approvedClaims,
          denied: deniedClaims,
          approvalRate: incidentsWithClaims > 0 ? (approvedClaims / incidentsWithClaims) * 100 : 0
        },
        complianceStatistics: {
          compliant: compliantIncidents,
          nonCompliant: nonCompliantIncidents,
          complianceRate: totalIncidents > 0 ? (compliantIncidents / totalIncidents) * 100 : 0
        }
      };
    } catch (error) {
      logger.error('Error fetching insurance statistics:', error);
      throw error;
    }
  }

  /**
   * Get pending insurance claims that need attention
   */
  static async getPendingClaims() {
    try {
      const reports = await IncidentReport.findAll({
        where: {
          insuranceClaimStatus: 'PENDING'
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        attributes: [
          'id', 'type', 'severity', 'occurredAt', 'description',
          'insuranceClaimNumber', 'insuranceClaimStatus'
        ],
        order: [['occurredAt', 'ASC']] // Oldest first
      });

      return reports;
    } catch (error) {
      logger.error('Error fetching pending claims:', error);
      throw error;
    }
  }

  /**
   * Get non-compliant incidents that need review
   */
  static async getNonCompliantIncidents() {
    try {
      const reports = await IncidentReport.findAll({
        where: {
          legalComplianceStatus: 'NON_COMPLIANT'
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        attributes: [
          'id', 'type', 'severity', 'occurredAt', 'description',
          'legalComplianceStatus'
        ],
        order: [['occurredAt', 'ASC']] // Oldest first
      });

      return reports;
    } catch (error) {
      logger.error('Error fetching non-compliant incidents:', error);
      throw error;
    }
  }

  /**
   * Get incidents that may need insurance claims (high severity without claims)
   */
  static async getIncidentsNeedingClaims() {
    try {
      const reports = await IncidentReport.findAll({
        where: {
          severity: ['HIGH', 'CRITICAL'],
          insuranceClaimNumber: null
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        attributes: [
          'id', 'type', 'severity', 'occurredAt', 'description'
        ],
        order: [['occurredAt', 'DESC']]
      });

      return reports;
    } catch (error) {
      logger.error('Error fetching incidents needing claims:', error);
      throw error;
    }
  }

  /**
   * Update claim status with validation
   */
  static async updateClaimStatus(
    incidentReportId: string,
    status: InsuranceClaimStatus,
    notes?: string
  ) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId);

      if (!report) {
        throw new Error('Incident report not found');
      }

      if (!report.insuranceClaimNumber) {
        throw new Error('No insurance claim number found for this incident');
      }

      const updateData: any = {
        insuranceClaimStatus: status
      };

      // Add notes to follow-up notes if provided
      if (notes) {
        const existingNotes = report.followUpNotes || '';
        updateData.followUpNotes = existingNotes 
          ? `${existingNotes}\n\nInsurance Claim Update: ${notes}` 
          : `Insurance Claim Update: ${notes}`;
      }

      await report.update(updateData);

      logger.info(`Insurance claim status updated for incident ${incidentReportId}: ${status}`);
      return report;
    } catch (error) {
      logger.error('Error updating claim status:', error);
      throw error;
    }
  }
}
