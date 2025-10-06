import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateComplianceReportData {
  reportType: string;
  title: string;
  description?: string;
  period: string;
  dueDate?: Date;
  createdById: string;
}

export interface CreateChecklistItemData {
  requirement: string;
  description?: string;
  category: string;
  dueDate?: Date;
  reportId?: string;
}

export interface CreateConsentFormData {
  type: string;
  title: string;
  description: string;
  content: string;
  version?: string;
  expiresAt?: Date;
}

export interface CreatePolicyData {
  title: string;
  category: string;
  content: string;
  version?: string;
  effectiveDate: Date;
  reviewDate?: Date;
}

export class ComplianceService {
  /**
   * Get all compliance reports with pagination and filters
   */
  static async getComplianceReports(
    page: number = 1,
    limit: number = 20,
    filters: {
      reportType?: string;
      status?: string;
      period?: string;
    } = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: Prisma.ComplianceReportWhereInput = {};

      if (filters.reportType) {
        where.reportType = filters.reportType;
      }
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.period) {
        where.period = filters.period;
      }

      const [reports, total] = await Promise.all([
        prisma.complianceReport.findMany({
          where,
          skip,
          take: limit,
          include: {
            items: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.complianceReport.count({ where }),
      ]);

      logger.info(`Retrieved ${reports.length} compliance reports`);

      return {
        reports,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting compliance reports:', error);
      throw error;
    }
  }

  /**
   * Get compliance report by ID
   */
  static async getComplianceReportById(id: string) {
    try {
      const report = await prisma.complianceReport.findUnique({
        where: { id },
        include: {
          items: {
            orderBy: { createdAt: 'asc' },
          },
        },
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
  static async createComplianceReport(data: CreateComplianceReportData) {
    try {
      const report = await prisma.complianceReport.create({
        data: {
          reportType: data.reportType as any,
          title: data.title,
          description: data.description,
          status: 'PENDING',
          period: data.period,
          dueDate: data.dueDate,
          createdById: data.createdById,
        },
        include: {
          items: true,
        },
      });

      logger.info(`Created compliance report: ${report.id}`);
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
    data: {
      status?: string;
      findings?: Prisma.InputJsonValue;
      recommendations?: Prisma.InputJsonValue;
      submittedBy?: string;
      reviewedBy?: string;
    }
  ) {
    try {
      const updateData: Prisma.ComplianceReportUpdateInput = { ...data };
      
      if (data.status === 'COMPLIANT' && !updateData.submittedAt) {
        updateData.submittedAt = new Date();
      }

      const report = await prisma.complianceReport.update({
        where: { id },
        data: updateData,
        include: {
          items: true,
        },
      });

      logger.info(`Updated compliance report: ${id}`);
      return report;
    } catch (error) {
      logger.error(`Error updating compliance report ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete compliance report
   */
  static async deleteComplianceReport(id: string) {
    try {
      await prisma.complianceReport.delete({
        where: { id },
      });

      logger.info(`Deleted compliance report: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error deleting compliance report ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add checklist item to report
   */
  static async addChecklistItem(data: CreateChecklistItemData) {
    try {
      const item = await prisma.complianceChecklistItem.create({
        data: {
          requirement: data.requirement,
          description: data.description,
          category: data.category as any,
          status: 'PENDING',
          dueDate: data.dueDate,
          reportId: data.reportId,
        },
      });

      logger.info(`Created checklist item: ${item.id}`);
      return item;
    } catch (error) {
      logger.error('Error creating checklist item:', error);
      throw error;
    }
  }

  /**
   * Update checklist item
   */
  static async updateChecklistItem(
    id: string,
    data: {
      status?: string;
      evidence?: string;
      notes?: string;
      completedBy?: string;
    }
  ) {
    try {
      const updateData: Prisma.ComplianceChecklistItemUpdateInput = { ...data };
      
      if (data.status === 'COMPLETED' && !updateData.completedAt) {
        updateData.completedAt = new Date();
      }

      const item = await prisma.complianceChecklistItem.update({
        where: { id },
        data: updateData,
      });

      logger.info(`Updated checklist item: ${id}`);
      return item;
    } catch (error) {
      logger.error(`Error updating checklist item ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all consent forms
   */
  static async getConsentForms(filters: { isActive?: boolean } = {}) {
    try {
      const where: Prisma.ConsentFormWhereInput = {};
      
      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      const forms = await prisma.consentForm.findMany({
        where,
        include: {
          signatures: {
            orderBy: { signedAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      logger.info(`Retrieved ${forms.length} consent forms`);
      return forms;
    } catch (error) {
      logger.error('Error getting consent forms:', error);
      throw error;
    }
  }

  /**
   * Create consent form
   */
  static async createConsentForm(data: CreateConsentFormData) {
    try {
      const form = await prisma.consentForm.create({
        data: {
          type: data.type as any,
          title: data.title,
          description: data.description,
          content: data.content,
          version: data.version || '1.0',
          isActive: true,
          expiresAt: data.expiresAt,
        },
      });

      logger.info(`Created consent form: ${form.id}`);
      return form;
    } catch (error) {
      logger.error('Error creating consent form:', error);
      throw error;
    }
  }

  /**
   * Sign consent form
   */
  static async signConsentForm(data: {
    consentFormId: string;
    studentId: string;
    signedBy: string;
    relationship: string;
    signatureData?: string;
    ipAddress?: string;
  }) {
    try {
      const signature = await prisma.consentSignature.create({
        data: {
          consentFormId: data.consentFormId,
          studentId: data.studentId,
          signedBy: data.signedBy,
          relationship: data.relationship,
          signatureData: data.signatureData,
          ipAddress: data.ipAddress,
        },
      });

      logger.info(`Consent form signed: ${data.consentFormId} for student ${data.studentId}`);
      return signature;
    } catch (error) {
      logger.error('Error signing consent form:', error);
      throw error;
    }
  }

  /**
   * Get student consent signatures
   */
  static async getStudentConsents(studentId: string) {
    try {
      const consents = await prisma.consentSignature.findMany({
        where: { studentId },
        include: {
          consentForm: true,
        },
        orderBy: { signedAt: 'desc' },
      });

      logger.info(`Retrieved ${consents.length} consents for student ${studentId}`);
      return consents;
    } catch (error) {
      logger.error(`Error getting consents for student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Withdraw consent
   */
  static async withdrawConsent(signatureId: string, withdrawnBy: string) {
    try {
      const signature = await prisma.consentSignature.update({
        where: { id: signatureId },
        data: {
          withdrawnAt: new Date(),
          withdrawnBy,
        },
      });

      logger.info(`Consent withdrawn: ${signatureId}`);
      return signature;
    } catch (error) {
      logger.error(`Error withdrawing consent ${signatureId}:`, error);
      throw error;
    }
  }

  /**
   * Get all policy documents
   */
  static async getPolicies(filters: { category?: string; status?: string } = {}) {
    try {
      const where: Prisma.PolicyDocumentWhereInput = {};
      
      if (filters.category) {
        where.category = filters.category;
      }
      if (filters.status) {
        where.status = filters.status;
      }

      const policies = await prisma.policyDocument.findMany({
        where,
        include: {
          acknowledgments: {
            take: 5,
            orderBy: { acknowledgedAt: 'desc' },
          },
        },
        orderBy: { effectiveDate: 'desc' },
      });

      logger.info(`Retrieved ${policies.length} policies`);
      return policies;
    } catch (error) {
      logger.error('Error getting policies:', error);
      throw error;
    }
  }

  /**
   * Create policy document
   */
  static async createPolicy(data: CreatePolicyData) {
    try {
      const policy = await prisma.policyDocument.create({
        data: {
          title: data.title,
          category: data.category as any,
          content: data.content,
          version: data.version || '1.0',
          effectiveDate: data.effectiveDate,
          reviewDate: data.reviewDate,
          status: 'DRAFT',
        },
      });

      logger.info(`Created policy: ${policy.id}`);
      return policy;
    } catch (error) {
      logger.error('Error creating policy:', error);
      throw error;
    }
  }

  /**
   * Update policy
   */
  static async updatePolicy(
    id: string,
    data: {
      status?: string;
      approvedBy?: string;
      reviewDate?: Date;
    }
  ) {
    try {
      const updateData: Prisma.PolicyDocumentUpdateInput = { ...data };
      
      if (data.status === 'ACTIVE' && !updateData.approvedAt) {
        updateData.approvedAt = new Date();
      }

      const policy = await prisma.policyDocument.update({
        where: { id },
        data: updateData,
      });

      logger.info(`Updated policy: ${id}`);
      return policy;
    } catch (error) {
      logger.error(`Error updating policy ${id}:`, error);
      throw error;
    }
  }

  /**
   * Acknowledge policy
   */
  static async acknowledgePolicy(policyId: string, userId: string, ipAddress?: string) {
    try {
      const acknowledgment = await prisma.policyAcknowledgment.create({
        data: {
          policyId,
          userId,
          ipAddress,
        },
      });

      logger.info(`Policy acknowledged: ${policyId} by user ${userId}`);
      return acknowledgment;
    } catch (error) {
      logger.error('Error acknowledging policy:', error);
      throw error;
    }
  }

  /**
   * Get compliance statistics
   */
  static async getComplianceStatistics(period?: string) {
    try {
      const where: Prisma.ComplianceReportWhereInput = {};
      if (period) {
        where.period = period;
      }

      const [
        totalReports,
        compliantReports,
        pendingReports,
        nonCompliantReports,
        totalChecklistItems,
        completedItems,
        overdueItems,
      ] = await Promise.all([
        prisma.complianceReport.count({ where }),
        prisma.complianceReport.count({ where: { ...where, status: 'COMPLIANT' } }),
        prisma.complianceReport.count({ where: { ...where, status: 'PENDING' } }),
        prisma.complianceReport.count({ where: { ...where, status: 'NON_COMPLIANT' } }),
        prisma.complianceChecklistItem.count(),
        prisma.complianceChecklistItem.count({ where: { status: 'COMPLETED' } }),
        prisma.complianceChecklistItem.count({
          where: {
            status: { not: 'COMPLETED' },
            dueDate: { lt: new Date() },
          },
        }),
      ]);

      const statistics = {
        reports: {
          total: totalReports,
          compliant: compliantReports,
          pending: pendingReports,
          nonCompliant: nonCompliantReports,
        },
        checklistItems: {
          total: totalChecklistItems,
          completed: completedItems,
          overdue: overdueItems,
          completionRate: totalChecklistItems > 0 
            ? Math.round((completedItems / totalChecklistItems) * 100) 
            : 0,
        },
      };

      logger.info('Retrieved compliance statistics');
      return statistics;
    } catch (error) {
      logger.error('Error getting compliance statistics:', error);
      throw error;
    }
  }

  /**
   * Get audit logs for compliance
   */
  static async getAuditLogs(
    page: number = 1,
    limit: number = 50,
    filters: {
      userId?: string;
      entityType?: string;
      action?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: Prisma.ComplianceAuditLogWhereInput = {};

      if (filters.userId) {
        where.userId = filters.userId;
      }
      if (filters.entityType) {
        where.entityType = filters.entityType;
      }
      if (filters.action) {
        where.action = filters.action;
      }
      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
          where.createdAt.gte = filters.startDate;
        }
        if (filters.endDate) {
          where.createdAt.lte = filters.endDate;
        }
      }

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.auditLog.count({ where }),
      ]);

      logger.info(`Retrieved ${logs.length} audit logs`);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting audit logs:', error);
      throw error;
    }
  }

  /**
   * Generate compliance report for period
   */
  static async generateComplianceReport(
    reportType: string,
    period: string,
    createdById: string
  ) {
    try {
      // Automatically analyze and create report
      const report = await this.createComplianceReport({
        reportType,
        title: `${reportType} Compliance Report - ${period}`,
        description: `Automated compliance report for ${period}`,
        period,
        createdById,
      });

      // Add relevant checklist items based on report type
      const checklistItems = this.getChecklistItemsForReportType(reportType);
      
      for (const item of checklistItems) {
        await this.addChecklistItem({
          ...item,
          reportId: report.id,
        });
      }

      logger.info(`Generated compliance report: ${report.id}`);
      return report;
    } catch (error) {
      logger.error('Error generating compliance report:', error);
      throw error;
    }
  }

  /**
   * Get default checklist items for report type
   */
  private static getChecklistItemsForReportType(reportType: string) {
    const items: Record<string, Array<{ requirement: string; description: string; category: string; isRequired?: boolean }>> = {
      HIPAA: [
        {
          requirement: 'Privacy Rule Compliance',
          description: 'Verify HIPAA Privacy Rule compliance',
          category: 'PRIVACY',
        },
        {
          requirement: 'Security Rule Compliance',
          description: 'Verify HIPAA Security Rule compliance',
          category: 'SECURITY',
        },
        {
          requirement: 'Breach Notification',
          description: 'Verify breach notification procedures',
          category: 'SECURITY',
        },
      ],
      FERPA: [
        {
          requirement: 'Education Records Protection',
          description: 'Verify student education records protection',
          category: 'PRIVACY',
        },
        {
          requirement: 'Parent Access Rights',
          description: 'Verify parent access rights procedures',
          category: 'DOCUMENTATION',
        },
      ],
      MEDICATION_AUDIT: [
        {
          requirement: 'Medication Administration Records',
          description: 'Verify medication administration documentation',
          category: 'MEDICATION',
        },
        {
          requirement: 'Controlled Substance Tracking',
          description: 'Verify controlled substance tracking',
          category: 'MEDICATION',
        },
      ],
    };

    return items[reportType] || [];
  }
}
