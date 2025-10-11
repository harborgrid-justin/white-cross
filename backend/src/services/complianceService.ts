import { Op, Transaction } from 'sequelize';
import { logger } from '../utils/logger';
import {
  AuditLog,
  ComplianceReport,
  ComplianceChecklistItem,
  ConsentForm,
  ConsentSignature,
  PolicyDocument,
  PolicyAcknowledgment,
  Student,
  User,
  sequelize
} from '../database/models';
import {
  ComplianceReportType,
  ComplianceStatus,
  ComplianceCategory,
  ChecklistItemStatus,
  ConsentType,
  PolicyCategory,
  PolicyStatus,
  AuditAction
} from '../database/types/enums';

export interface CreateComplianceReportData {
  reportType: ComplianceReportType;
  title: string;
  description?: string;
  period: string;
  dueDate?: Date;
  createdById: string;
}

export interface CreateChecklistItemData {
  requirement: string;
  description?: string;
  category: ComplianceCategory;
  dueDate?: Date;
  reportId?: string;
}

export interface CreateConsentFormData {
  type: ConsentType;
  title: string;
  description: string;
  content: string;
  version?: string;
  expiresAt?: Date;
}

export interface CreatePolicyData {
  title: string;
  category: PolicyCategory;
  content: string;
  version?: string;
  effectiveDate: Date;
  reviewDate?: Date;
}

export interface ComplianceReportFilters {
  reportType?: ComplianceReportType;
  status?: ComplianceStatus;
  period?: string;
}

export interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
}

export interface ComplianceStatistics {
  reports: {
    total: number;
    compliant: number;
    pending: number;
    nonCompliant: number;
  };
  checklistItems: {
    total: number;
    completed: number;
    overdue: number;
    completionRate: number;
  };
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export class ComplianceService {
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
    data: {
      status?: ComplianceStatus;
      findings?: any;
      recommendations?: any;
      submittedBy?: string;
      reviewedBy?: string;
    }
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

  /**
   * Add checklist item to report
   */
  static async addChecklistItem(data: CreateChecklistItemData): Promise<ComplianceChecklistItem> {
    try {
      // Verify report exists if reportId is provided
      if (data.reportId) {
        const report = await ComplianceReport.findByPk(data.reportId);
        if (!report) {
          throw new Error('Compliance report not found');
        }
      }

      const item = await ComplianceChecklistItem.create({
        requirement: data.requirement,
        description: data.description,
        category: data.category,
        status: ChecklistItemStatus.PENDING,
        dueDate: data.dueDate,
        reportId: data.reportId
      });

      logger.info(`Created checklist item: ${item.id} - ${item.requirement}`);
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
      status?: ChecklistItemStatus;
      evidence?: string;
      notes?: string;
      completedBy?: string;
    }
  ): Promise<ComplianceChecklistItem> {
    try {
      const existingItem = await ComplianceChecklistItem.findByPk(id);

      if (!existingItem) {
        throw new Error('Checklist item not found');
      }

      const updateData: any = {};
      if (data.status) updateData.status = data.status;
      if (data.evidence !== undefined) updateData.evidence = data.evidence;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.completedBy) updateData.completedBy = data.completedBy;

      // Automatically set completion timestamp when status changes to COMPLETED
      if (data.status === ChecklistItemStatus.COMPLETED && !existingItem.completedAt) {
        updateData.completedAt = new Date();
      }

      await existingItem.update(updateData);

      logger.info(`Updated checklist item: ${id}`);
      return existingItem;
    } catch (error) {
      logger.error(`Error updating checklist item ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all consent forms
   */
  static async getConsentForms(filters: { isActive?: boolean } = {}): Promise<ConsentForm[]> {
    try {
      const whereClause: any = {};

      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      const forms = await ConsentForm.findAll({
        where: whereClause,
        include: [
          {
            model: ConsentSignature,
            as: 'signatures',
            limit: 5,
            separate: true,
            order: [['signedAt', 'DESC']]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      logger.info(`Retrieved ${forms.length} consent forms`);
      return forms;
    } catch (error) {
      logger.error('Error getting consent forms:', error);
      throw new Error('Failed to fetch consent forms');
    }
  }

  /**
   * Create consent form
   */
  static async createConsentForm(data: CreateConsentFormData): Promise<ConsentForm> {
    try {
      // Validate expiration date if provided
      if (data.expiresAt) {
        const expirationDate = new Date(data.expiresAt);
        if (expirationDate <= new Date()) {
          throw new Error('Consent form expiration date must be in the future');
        }
      }

      // Validate version format
      if (data.version && !/^[0-9]+\.[0-9]+(\.[0-9]+)?$/.test(data.version)) {
        throw new Error('Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)');
      }

      // Validate content length for legal validity
      if (data.content.trim().length < 50) {
        throw new Error('Consent form content must be at least 50 characters for legal validity');
      }

      const form = await ConsentForm.create({
        type: data.type,
        title: data.title,
        description: data.description,
        content: data.content,
        version: data.version || '1.0',
        isActive: true,
        expiresAt: data.expiresAt
      });

      logger.info(`Created consent form: ${form.id} - ${form.title} (${form.type})`);
      return form;
    } catch (error) {
      logger.error('Error creating consent form:', error);
      throw error;
    }
  }

  /**
   * Sign consent form
   * Uses transaction to ensure atomicity and proper audit logging
   * HIPAA COMPLIANCE: Records digital signature with full audit trail
   */
  static async signConsentForm(data: {
    consentFormId: string;
    studentId: string;
    signedBy: string;
    relationship: string;
    signatureData?: string;
    ipAddress?: string;
  }): Promise<ConsentSignature> {
    const transaction = await sequelize.transaction();

    try {
      // Validate relationship
      const validRelationships = [
        'Mother', 'Father', 'Parent', 'Legal Guardian',
        'Foster Parent', 'Grandparent', 'Stepparent', 'Other Authorized Adult'
      ];
      if (!validRelationships.includes(data.relationship)) {
        throw new Error('Relationship must be a valid authorized relationship type');
      }

      // Validate signatory name
      if (!data.signedBy || data.signedBy.trim().length < 2) {
        throw new Error('Signatory name is required for legal validity');
      }

      // Verify consent form exists and is active
      const consentForm = await ConsentForm.findByPk(data.consentFormId, { transaction });
      if (!consentForm) {
        throw new Error('Consent form not found');
      }
      if (!consentForm.isActive) {
        throw new Error('Consent form is not active and cannot be signed');
      }

      // Check if consent form has expired
      if (consentForm.expiresAt && new Date(consentForm.expiresAt) < new Date()) {
        throw new Error('Consent form has expired and cannot be signed');
      }

      // Verify student exists
      const student = await Student.findByPk(data.studentId, { transaction });
      if (!student) {
        throw new Error('Student not found');
      }

      // Check if signature already exists (unique constraint)
      const existingSignature = await ConsentSignature.findOne({
        where: {
          consentFormId: data.consentFormId,
          studentId: data.studentId
        },
        transaction
      });

      if (existingSignature) {
        if (existingSignature.withdrawnAt) {
          throw new Error('Consent form was previously signed and withdrawn. A new consent form version may be required.');
        }
        throw new Error('Consent form already signed for this student');
      }

      // Validate digital signature data if provided
      if (data.signatureData) {
        if (data.signatureData.length < 10) {
          throw new Error('Digital signature data appears incomplete');
        }
        if (data.signatureData.length > 100000) {
          throw new Error('Digital signature data is too large (max 100KB)');
        }
      }

      // Create signature
      const signature = await ConsentSignature.create(
        {
          consentFormId: data.consentFormId,
          studentId: data.studentId,
          signedBy: data.signedBy.trim(),
          relationship: data.relationship,
          signatureData: data.signatureData,
          ipAddress: data.ipAddress
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(
        `CONSENT SIGNED: Form ${data.consentFormId} for student ${student.firstName} ${student.lastName} ` +
        `(${data.studentId}) by ${data.signedBy} (${data.relationship})` +
        `${data.ipAddress ? ` from IP ${data.ipAddress}` : ''}`
      );

      return signature;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error signing consent form:', error);
      throw error;
    }
  }

  /**
   * Get student consent signatures
   */
  static async getStudentConsents(studentId: string): Promise<ConsentSignature[]> {
    try {
      // Verify student exists
      const student = await Student.findByPk(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      const consents = await ConsentSignature.findAll({
        where: { studentId },
        include: [
          {
            model: ConsentForm,
            as: 'consentForm',
            required: true
          }
        ],
        order: [['signedAt', 'DESC']]
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
   * HIPAA COMPLIANCE: Maintains complete audit trail of consent withdrawal
   */
  static async withdrawConsent(signatureId: string, withdrawnBy: string): Promise<ConsentSignature> {
    try {
      // Validate withdrawn by name
      if (!withdrawnBy || withdrawnBy.trim().length < 2) {
        throw new Error('Withdrawn by name is required for audit trail');
      }

      const signature = await ConsentSignature.findByPk(signatureId, {
        include: [
          {
            model: ConsentForm,
            as: 'consentForm'
          },
          {
            model: Student,
            as: 'student'
          }
        ]
      });

      if (!signature) {
        throw new Error('Consent signature not found');
      }

      if (signature.withdrawnAt) {
        throw new Error(
          `Consent was already withdrawn on ${signature.withdrawnAt.toISOString().split('T')[0]} ` +
          `by ${signature.withdrawnBy}`
        );
      }

      await signature.update({
        withdrawnAt: new Date(),
        withdrawnBy: withdrawnBy.trim()
      });

      const student = signature.student as any;
      logger.warn(
        `CONSENT WITHDRAWN: Signature ${signatureId} for student ` +
        `${student ? `${student.firstName} ${student.lastName}` : signature.studentId} ` +
        `withdrawn by ${withdrawnBy}. Consent is no longer valid.`
      );

      return signature;
    } catch (error) {
      logger.error(`Error withdrawing consent ${signatureId}:`, error);
      throw error;
    }
  }

  /**
   * Get all policy documents
   */
  static async getPolicies(filters: { category?: PolicyCategory; status?: PolicyStatus } = {}): Promise<PolicyDocument[]> {
    try {
      const whereClause: any = {};

      if (filters.category) {
        whereClause.category = filters.category;
      }
      if (filters.status) {
        whereClause.status = filters.status;
      }

      const policies = await PolicyDocument.findAll({
        where: whereClause,
        include: [
          {
            model: PolicyAcknowledgment,
            as: 'acknowledgments',
            limit: 5,
            separate: true,
            order: [['acknowledgedAt', 'DESC']]
          }
        ],
        order: [['effectiveDate', 'DESC']]
      });

      logger.info(`Retrieved ${policies.length} policies`);
      return policies;
    } catch (error) {
      logger.error('Error getting policies:', error);
      throw new Error('Failed to fetch policies');
    }
  }

  /**
   * Create policy document
   * COMPLIANCE: Version-controlled policy management for HIPAA/FERPA
   */
  static async createPolicy(data: CreatePolicyData): Promise<PolicyDocument> {
    try {
      // Validate version format
      if (data.version && !/^[0-9]+\.[0-9]+(\.[0-9]+)?$/.test(data.version)) {
        throw new Error('Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)');
      }

      // Validate content length
      if (data.content.trim().length < 100) {
        throw new Error('Policy content must be at least 100 characters');
      }

      // Validate review date if provided
      if (data.reviewDate) {
        const reviewDate = new Date(data.reviewDate);
        const effectiveDate = new Date(data.effectiveDate);
        if (reviewDate < effectiveDate) {
          throw new Error('Review date cannot be before effective date');
        }
      }

      const policy = await PolicyDocument.create({
        title: data.title.trim(),
        category: data.category,
        content: data.content.trim(),
        version: data.version || '1.0',
        effectiveDate: data.effectiveDate,
        reviewDate: data.reviewDate,
        status: PolicyStatus.DRAFT
      });

      logger.info(`Created policy: ${policy.id} - ${policy.title} (${policy.category}) v${policy.version}`);
      return policy;
    } catch (error) {
      logger.error('Error creating policy:', error);
      throw error;
    }
  }

  /**
   * Update policy
   * COMPLIANCE: Enforces policy lifecycle and approval workflow
   */
  static async updatePolicy(
    id: string,
    data: {
      status?: PolicyStatus;
      approvedBy?: string;
      reviewDate?: Date;
    }
  ): Promise<PolicyDocument> {
    try {
      const existingPolicy = await PolicyDocument.findByPk(id);

      if (!existingPolicy) {
        throw new Error('Policy document not found');
      }

      const updateData: any = {};

      // Validate status transitions
      if (data.status) {
        if (data.status === PolicyStatus.ACTIVE) {
          // Activating a policy requires approval
          if (!data.approvedBy && !existingPolicy.approvedBy) {
            throw new Error('Approver is required to activate a policy');
          }
          if (existingPolicy.status === PolicyStatus.ARCHIVED) {
            throw new Error('Cannot reactivate an archived policy. Create a new version instead.');
          }
          if (existingPolicy.status === PolicyStatus.SUPERSEDED) {
            throw new Error('Cannot reactivate a superseded policy. Create a new version instead.');
          }
        }
        updateData.status = data.status;
      }

      if (data.approvedBy) {
        updateData.approvedBy = data.approvedBy;
      }

      if (data.reviewDate) {
        const reviewDate = new Date(data.reviewDate);
        if (reviewDate < existingPolicy.effectiveDate) {
          throw new Error('Review date cannot be before effective date');
        }
        updateData.reviewDate = data.reviewDate;
      }

      // Automatically set approval timestamp when status changes to ACTIVE
      if (data.status === PolicyStatus.ACTIVE && !existingPolicy.approvedAt) {
        updateData.approvedAt = new Date();
      }

      await existingPolicy.update(updateData);

      logger.info(
        `Updated policy: ${id} - ${existingPolicy.title} ` +
        `${data.status ? `(status: ${existingPolicy.status} -> ${data.status})` : ''}`
      );

      return existingPolicy;
    } catch (error) {
      logger.error(`Error updating policy ${id}:`, error);
      throw error;
    }
  }

  /**
   * Acknowledge policy
   * Uses transaction to ensure atomicity
   * COMPLIANCE: Required for staff training and policy compliance tracking
   */
  static async acknowledgePolicy(
    policyId: string,
    userId: string,
    ipAddress?: string
  ): Promise<PolicyAcknowledgment> {
    const transaction = await sequelize.transaction();

    try {
      // Verify policy exists and is active
      const policy = await PolicyDocument.findByPk(policyId, { transaction });
      if (!policy) {
        throw new Error('Policy document not found');
      }
      if (policy.status !== PolicyStatus.ACTIVE) {
        throw new Error(
          `Policy is ${policy.status} and cannot be acknowledged. Only ACTIVE policies can be acknowledged.`
        );
      }

      // Verify policy is not past its review date
      if (policy.reviewDate && new Date(policy.reviewDate) < new Date()) {
        logger.warn(
          `Policy ${policyId} is past its review date (${policy.reviewDate}). ` +
          `Consider updating or creating a new version.`
        );
      }

      // Verify user exists
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        throw new Error('User not found');
      }

      // Check if already acknowledged (unique constraint)
      const existingAcknowledgment = await PolicyAcknowledgment.findOne({
        where: {
          policyId,
          userId
        },
        transaction
      });

      if (existingAcknowledgment) {
        throw new Error(
          `Policy already acknowledged by this user on ` +
          `${existingAcknowledgment.acknowledgedAt.toISOString().split('T')[0]}`
        );
      }

      // Create acknowledgment
      const acknowledgment = await PolicyAcknowledgment.create(
        {
          policyId,
          userId,
          ipAddress
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(
        `POLICY ACKNOWLEDGED: ${policy.title} (${policy.category}) v${policy.version} ` +
        `by ${user.firstName} ${user.lastName} (${userId})` +
        `${ipAddress ? ` from IP ${ipAddress}` : ''}`
      );

      return acknowledgment;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error acknowledging policy:', error);
      throw error;
    }
  }

  /**
   * Get compliance statistics
   */
  static async getComplianceStatistics(period?: string): Promise<ComplianceStatistics> {
    try {
      const whereClause: any = {};
      if (period) {
        whereClause.period = period;
      }

      const [
        totalReports,
        compliantReports,
        pendingReports,
        nonCompliantReports,
        totalChecklistItems,
        completedItems,
        overdueItems
      ] = await Promise.all([
        ComplianceReport.count({ where: whereClause }),
        ComplianceReport.count({
          where: { ...whereClause, status: ComplianceStatus.COMPLIANT }
        }),
        ComplianceReport.count({
          where: { ...whereClause, status: ComplianceStatus.PENDING }
        }),
        ComplianceReport.count({
          where: { ...whereClause, status: ComplianceStatus.NON_COMPLIANT }
        }),
        ComplianceChecklistItem.count(),
        ComplianceChecklistItem.count({
          where: { status: ChecklistItemStatus.COMPLETED }
        }),
        ComplianceChecklistItem.count({
          where: {
            status: {
              [Op.ne]: ChecklistItemStatus.COMPLETED
            },
            dueDate: {
              [Op.lt]: new Date()
            }
          }
        })
      ]);

      const statistics: ComplianceStatistics = {
        reports: {
          total: totalReports,
          compliant: compliantReports,
          pending: pendingReports,
          nonCompliant: nonCompliantReports
        },
        checklistItems: {
          total: totalChecklistItems,
          completed: completedItems,
          overdue: overdueItems,
          completionRate:
            totalChecklistItems > 0
              ? Math.round((completedItems / totalChecklistItems) * 100)
              : 0
        }
      };

      logger.info('Retrieved compliance statistics');
      return statistics;
    } catch (error) {
      logger.error('Error getting compliance statistics:', error);
      throw new Error('Failed to fetch compliance statistics');
    }
  }

  /**
   * Get audit logs for compliance with HIPAA tracking
   */
  static async getAuditLogs(
    page: number = 1,
    limit: number = 50,
    filters: AuditLogFilters = {}
  ): Promise<{
    logs: AuditLog[];
    pagination: PaginationResult;
  }> {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (filters.userId) {
        whereClause.userId = filters.userId;
      }
      if (filters.entityType) {
        whereClause.entityType = filters.entityType;
      }
      if (filters.action) {
        whereClause.action = filters.action;
      }
      if (filters.startDate || filters.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) {
          whereClause.createdAt[Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
          whereClause.createdAt[Op.lte] = filters.endDate;
        }
      }

      const { rows: logs, count: total } = await AuditLog.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      logger.info(`Retrieved ${logs.length} audit logs`);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  }

  /**
   * Create audit log entry for HIPAA compliance
   * This is a critical function for maintaining HIPAA compliance audit trails
   */
  static async createAuditLog(data: {
    userId?: string;
    action: AuditAction;
    entityType: string;
    entityId?: string;
    changes?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    try {
      const auditLog = await AuditLog.create({
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        changes: data.changes,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      });

      logger.info(
        `Audit log created: ${data.action} on ${data.entityType}${data.entityId ? ` (${data.entityId})` : ''} by user ${data.userId || 'system'}`
      );

      return auditLog;
    } catch (error) {
      logger.error('Error creating audit log:', error);
      throw error;
    }
  }

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
}
