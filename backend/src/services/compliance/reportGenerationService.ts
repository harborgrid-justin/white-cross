/**
 * WC-GEN-241 | reportGenerationService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  ComplianceReport,
  ComplianceChecklistItem,
  User,
  sequelize
} from '../../database/models';
import {
  ComplianceReportType,
  ComplianceStatus,
  ComplianceCategory,
  ChecklistItemStatus
} from '../../database/types/enums';

export class ReportGenerationService {
  /**
   * Generate compliance report for period with automatic checklist items
   */
  static async generateComplianceReport(
    reportType: ComplianceReportType,
    period: string,
    createdById: string
  ): Promise<ComplianceReport> {
    const transaction = await sequelize.transaction();

    try {
      // Verify user exists
      const user = await User.findByPk(createdById, { transaction });
      if (!user) {
        throw new Error('User not found');
      }

      // Create report
      const report = await ComplianceReport.create(
        {
          reportType,
          title: `${reportType} Compliance Report - ${period}`,
          description: `Automated compliance report for ${period}`,
          status: ComplianceStatus.PENDING,
          period,
          createdById
        },
        { transaction }
      );

      // Add relevant checklist items based on report type
      const checklistItems = this.getChecklistItemsForReportType(reportType);

      for (const item of checklistItems) {
        await ComplianceChecklistItem.create(
          {
            requirement: item.requirement,
            description: item.description,
            category: item.category,
            status: ChecklistItemStatus.PENDING,
            reportId: report.id
          },
          { transaction }
        );
      }

      await transaction.commit();

      // Reload with associations
      await report.reload({
        include: [
          {
            model: ComplianceChecklistItem,
            as: 'items'
          }
        ]
      });

      logger.info(`Generated compliance report: ${report.id} with ${checklistItems.length} checklist items`);
      return report;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error generating compliance report:', error);
      throw error;
    }
  }

  /**
   * Get default checklist items for report type
   * Returns predefined compliance requirements based on the regulatory framework
   */
  private static getChecklistItemsForReportType(
    reportType: ComplianceReportType
  ): Array<{
    requirement: string;
    description: string;
    category: ComplianceCategory;
  }> {
    const items: Record<
      ComplianceReportType,
      Array<{
        requirement: string;
        description: string;
        category: ComplianceCategory;
      }>
    > = {
      [ComplianceReportType.HIPAA]: [
        {
          requirement: 'Privacy Rule Compliance',
          description: 'Verify HIPAA Privacy Rule compliance for PHI handling',
          category: ComplianceCategory.PRIVACY
        },
        {
          requirement: 'Security Rule Compliance',
          description: 'Verify HIPAA Security Rule compliance for technical safeguards',
          category: ComplianceCategory.SECURITY
        },
        {
          requirement: 'Breach Notification',
          description: 'Verify breach notification procedures are in place',
          category: ComplianceCategory.SECURITY
        },
        {
          requirement: 'Access Controls',
          description: 'Verify access controls and user authentication mechanisms',
          category: ComplianceCategory.SECURITY
        },
        {
          requirement: 'Audit Logs Review',
          description: 'Review audit logs for unauthorized PHI access',
          category: ComplianceCategory.SECURITY
        }
      ],
      [ComplianceReportType.FERPA]: [
        {
          requirement: 'Education Records Protection',
          description: 'Verify student education records protection and access controls',
          category: ComplianceCategory.PRIVACY
        },
        {
          requirement: 'Parent Access Rights',
          description: 'Verify parent/guardian access rights procedures',
          category: ComplianceCategory.DOCUMENTATION
        },
        {
          requirement: 'Directory Information',
          description: 'Verify directory information disclosure procedures',
          category: ComplianceCategory.PRIVACY
        },
        {
          requirement: 'Records Release Authorization',
          description: 'Verify consent procedures for records release',
          category: ComplianceCategory.CONSENT
        }
      ],
      [ComplianceReportType.MEDICATION_AUDIT]: [
        {
          requirement: 'Medication Administration Records',
          description: 'Verify medication administration documentation completeness',
          category: ComplianceCategory.MEDICATION
        },
        {
          requirement: 'Controlled Substance Tracking',
          description: 'Verify controlled substance tracking and reconciliation',
          category: ComplianceCategory.MEDICATION
        },
        {
          requirement: 'Medication Storage',
          description: 'Verify proper medication storage and temperature logs',
          category: ComplianceCategory.SAFETY
        },
        {
          requirement: 'Expiration Date Monitoring',
          description: 'Verify expired medication identification and disposal',
          category: ComplianceCategory.MEDICATION
        }
      ],
      [ComplianceReportType.STATE_HEALTH]: [
        {
          requirement: 'Vaccination Records',
          description: 'Verify vaccination record completeness',
          category: ComplianceCategory.HEALTH_RECORDS
        },
        {
          requirement: 'Health Screenings',
          description: 'Verify required health screenings completion',
          category: ComplianceCategory.HEALTH_RECORDS
        },
        {
          requirement: 'Emergency Plans',
          description: 'Verify emergency response plans are current',
          category: ComplianceCategory.SAFETY
        }
      ],
      [ComplianceReportType.SAFETY_INSPECTION]: [
        {
          requirement: 'Equipment Inspection',
          description: 'Verify medical equipment inspection and maintenance',
          category: ComplianceCategory.SAFETY
        },
        {
          requirement: 'First Aid Supplies',
          description: 'Verify first aid supplies inventory and expiration',
          category: ComplianceCategory.SAFETY
        },
        {
          requirement: 'Emergency Equipment',
          description: 'Verify emergency equipment functionality',
          category: ComplianceCategory.SAFETY
        }
      ],
      [ComplianceReportType.TRAINING_COMPLIANCE]: [
        {
          requirement: 'HIPAA Training',
          description: 'Verify staff HIPAA training completion',
          category: ComplianceCategory.TRAINING
        },
        {
          requirement: 'Medication Training',
          description: 'Verify medication administration training',
          category: ComplianceCategory.TRAINING
        },
        {
          requirement: 'Emergency Procedures Training',
          description: 'Verify emergency procedures training',
          category: ComplianceCategory.TRAINING
        }
      ],
      [ComplianceReportType.DATA_PRIVACY]: [
        {
          requirement: 'Data Encryption',
          description: 'Verify data encryption at rest and in transit',
          category: ComplianceCategory.SECURITY
        },
        {
          requirement: 'Access Logs',
          description: 'Review access logs for anomalies',
          category: ComplianceCategory.SECURITY
        },
        {
          requirement: 'Data Retention',
          description: 'Verify data retention policy compliance',
          category: ComplianceCategory.PRIVACY
        }
      ],
      [ComplianceReportType.CUSTOM]: []
    };

    return items[reportType] || [];
  }

  /**
   * Generate custom compliance report with user-defined checklist items
   */
  static async generateCustomComplianceReport(
    title: string,
    description: string,
    period: string,
    createdById: string,
    customItems: Array<{
      requirement: string;
      description?: string;
      category: ComplianceCategory;
      dueDate?: Date;
    }>
  ): Promise<ComplianceReport> {
    const transaction = await sequelize.transaction();

    try {
      // Verify user exists
      const user = await User.findByPk(createdById, { transaction });
      if (!user) {
        throw new Error('User not found');
      }

      // Create report
      const report = await ComplianceReport.create(
        {
          reportType: ComplianceReportType.CUSTOM,
          title,
          description,
          status: ComplianceStatus.PENDING,
          period,
          createdById
        },
        { transaction }
      );

      // Add custom checklist items
      for (const item of customItems) {
        await ComplianceChecklistItem.create(
          {
            requirement: item.requirement,
            description: item.description,
            category: item.category,
            status: ChecklistItemStatus.PENDING,
            dueDate: item.dueDate,
            reportId: report.id
          },
          { transaction }
        );
      }

      await transaction.commit();

      // Reload with associations
      await report.reload({
        include: [
          {
            model: ComplianceChecklistItem,
            as: 'items'
          }
        ]
      });

      logger.info(`Generated custom compliance report: ${report.id} with ${customItems.length} checklist items`);
      return report;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error generating custom compliance report:', error);
      throw error;
    }
  }

  /**
   * Clone existing compliance report for new period
   */
  static async cloneComplianceReport(
    existingReportId: string,
    newPeriod: string,
    createdById: string
  ): Promise<ComplianceReport> {
    const transaction = await sequelize.transaction();

    try {
      // Get existing report with items
      const existingReport = await ComplianceReport.findByPk(existingReportId, {
        include: [
          {
            model: ComplianceChecklistItem,
            as: 'items'
          }
        ],
        transaction
      });

      if (!existingReport) {
        throw new Error('Existing compliance report not found');
      }

      // Verify user exists
      const user = await User.findByPk(createdById, { transaction });
      if (!user) {
        throw new Error('User not found');
      }

      // Create new report
      const newReport = await ComplianceReport.create(
        {
          reportType: existingReport.reportType,
          title: `${existingReport.title} - ${newPeriod}`,
          description: existingReport.description,
          status: ComplianceStatus.PENDING,
          period: newPeriod,
          createdById
        },
        { transaction }
      );

      // Clone checklist items
      const existingItems = (existingReport as any).items || [];
      for (const item of existingItems) {
        await ComplianceChecklistItem.create(
          {
            requirement: item.requirement,
            description: item.description,
            category: item.category,
            status: ChecklistItemStatus.PENDING,
            dueDate: item.dueDate,
            reportId: newReport.id
          },
          { transaction }
        );
      }

      await transaction.commit();

      // Reload with associations
      await newReport.reload({
        include: [
          {
            model: ComplianceChecklistItem,
            as: 'items'
          }
        ]
      });

      logger.info(`Cloned compliance report: ${existingReportId} to ${newReport.id} for period ${newPeriod}`);
      return newReport;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error cloning compliance report:', error);
      throw error;
    }
  }

  /**
   * Get available report templates
   */
  static getAvailableReportTemplates(): Array<{
    type: ComplianceReportType;
    name: string;
    description: string;
    itemCount: number;
    categories: ComplianceCategory[];
  }> {
    const templates = [
      {
        type: ComplianceReportType.HIPAA,
        name: 'HIPAA Compliance Report',
        description: 'Comprehensive HIPAA compliance assessment including Privacy and Security Rules',
        itemCount: 5,
        categories: [ComplianceCategory.PRIVACY, ComplianceCategory.SECURITY]
      },
      {
        type: ComplianceReportType.FERPA,
        name: 'FERPA Compliance Report',
        description: 'Student education records privacy compliance assessment',
        itemCount: 4,
        categories: [ComplianceCategory.PRIVACY, ComplianceCategory.DOCUMENTATION, ComplianceCategory.CONSENT]
      },
      {
        type: ComplianceReportType.MEDICATION_AUDIT,
        name: 'Medication Audit Report',
        description: 'Comprehensive medication management and safety audit',
        itemCount: 4,
        categories: [ComplianceCategory.MEDICATION, ComplianceCategory.SAFETY]
      },
      {
        type: ComplianceReportType.STATE_HEALTH,
        name: 'State Health Compliance Report',
        description: 'State health department compliance requirements',
        itemCount: 3,
        categories: [ComplianceCategory.HEALTH_RECORDS, ComplianceCategory.SAFETY]
      },
      {
        type: ComplianceReportType.SAFETY_INSPECTION,
        name: 'Safety Inspection Report',
        description: 'Equipment and facility safety inspection checklist',
        itemCount: 3,
        categories: [ComplianceCategory.SAFETY]
      },
      {
        type: ComplianceReportType.TRAINING_COMPLIANCE,
        name: 'Training Compliance Report',
        description: 'Staff training completion and compliance verification',
        itemCount: 3,
        categories: [ComplianceCategory.TRAINING]
      },
      {
        type: ComplianceReportType.DATA_PRIVACY,
        name: 'Data Privacy Report',
        description: 'Data protection and privacy compliance assessment',
        itemCount: 3,
        categories: [ComplianceCategory.SECURITY, ComplianceCategory.PRIVACY]
      },
      {
        type: ComplianceReportType.CUSTOM,
        name: 'Custom Compliance Report',
        description: 'User-defined compliance report with custom checklist items',
        itemCount: 0,
        categories: []
      }
    ];

    logger.info(`Retrieved ${templates.length} available report templates`);
    return templates;
  }
}
