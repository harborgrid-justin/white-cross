import PHIDisclosure, { DisclosureType, DisclosurePurpose, DisclosureMethod, RecipientType } from '../../database/models/compliance/PHIDisclosure';
import PHIDisclosureAudit from '../../database/models/compliance/PHIDisclosureAudit';
import { Op } from 'sequelize';

export interface CreateDisclosureDTO {
  studentId: string;
  disclosureType: DisclosureType;
  purpose: DisclosurePurpose;
  method: DisclosureMethod;
  disclosureDate: Date;
  informationDisclosed: string[];
  minimumNecessary: string;
  recipientType: RecipientType;
  recipientName: string;
  recipientOrganization?: string;
  recipientAddress?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  authorizationObtained: boolean;
  authorizationDate?: Date;
  authorizationExpiryDate?: Date;
  patientRequested: boolean;
  followUpRequired: boolean;
  followUpDate?: Date;
  notes?: string;
}

export interface DisclosureFilters {
  studentId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  purpose?: DisclosurePurpose;
  disclosureType?: DisclosureType;
  limit?: number;
  offset?: number;
}

export interface DisclosureStatistics {
  totalDisclosures: number;
  byPurpose: Record<string, number>;
  byRecipientType: Record<string, number>;
  byMethod: Record<string, number>;
  followUpsPending: number;
  followUpsOverdue: number;
  unauthorizedDisclosures: number;
}

/**
 * PHI Disclosure Service
 * HIPAA §164.528 - Accounting of Disclosures
 *
 * Manages all PHI disclosures with complete audit trail
 */
export class PHIDisclosureService {
  /**
   * Create a new PHI disclosure record
   */
  async createDisclosure(data: CreateDisclosureDTO, userId: string, ipAddress?: string, userAgent?: string): Promise<PHIDisclosure> {
    // Validate minimum necessary justification
    if (!data.minimumNecessary || data.minimumNecessary.trim().length < 10) {
      throw new Error('Minimum necessary justification must be at least 10 characters');
    }

    // Validate authorization if required
    if (data.authorizationObtained && !data.authorizationDate) {
      throw new Error('Authorization date required when authorization is obtained');
    }

    // Create disclosure
    const disclosure = await PHIDisclosure.create({
      ...data,
      disclosedBy: userId,
      followUpCompleted: false,
    });

    // Create audit trail
    await PHIDisclosureAudit.create({
      disclosureId: disclosure.id,
      action: 'CREATED',
      performedBy: userId,
      ipAddress,
      userAgent,
    });

    return disclosure;
  }

  /**
   * Get disclosures with filtering and pagination
   */
  async getDisclosures(filters: DisclosureFilters): Promise<{ disclosures: PHIDisclosure[]; total: number }> {
    const where: any = {};

    if (filters.studentId) {
      where.studentId = filters.studentId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.disclosureDate = {};
      if (filters.dateFrom) {
        where.disclosureDate[Op.gte] = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.disclosureDate[Op.lte] = filters.dateTo;
      }
    }

    if (filters.purpose) {
      where.purpose = filters.purpose;
    }

    if (filters.disclosureType) {
      where.disclosureType = filters.disclosureType;
    }

    const { rows, count } = await PHIDisclosure.findAndCountAll({
      where,
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      order: [['disclosureDate', 'DESC']],
      include: ['student', 'discloser'],
    });

    return { disclosures: rows, total: count };
  }

  /**
   * Get disclosure by ID
   */
  async getDisclosureById(id: string, userId: string, ipAddress?: string, userAgent?: string): Promise<PHIDisclosure | null> {
    const disclosure = await PHIDisclosure.findByPk(id, {
      include: ['student', 'discloser', 'auditTrail'],
    });

    if (disclosure) {
      // Log access
      await PHIDisclosureAudit.create({
        disclosureId: id,
        action: 'VIEWED',
        performedBy: userId,
        ipAddress,
        userAgent,
      });
    }

    return disclosure;
  }

  /**
   * Update a disclosure record
   */
  async updateDisclosure(
    id: string,
    updates: Partial<CreateDisclosureDTO>,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<PHIDisclosure> {
    const disclosure = await PHIDisclosure.findByPk(id);
    if (!disclosure) {
      throw new Error('Disclosure not found');
    }

    // Store old values for audit
    const oldValues = disclosure.toJSON();

    // Update disclosure
    await disclosure.update(updates);

    // Create audit trail
    await PHIDisclosureAudit.create({
      disclosureId: id,
      action: 'UPDATED',
      changes: { before: oldValues, after: disclosure.toJSON() },
      performedBy: userId,
      ipAddress,
      userAgent,
    });

    return disclosure;
  }

  /**
   * Soft delete a disclosure record
   */
  async deleteDisclosure(id: string, userId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const disclosure = await PHIDisclosure.findByPk(id);
    if (!disclosure) {
      throw new Error('Disclosure not found');
    }

    await disclosure.destroy();

    // Create audit trail
    await PHIDisclosureAudit.create({
      disclosureId: id,
      action: 'DELETED',
      performedBy: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Get disclosures for a student
   */
  async getDisclosuresByStudent(studentId: string): Promise<PHIDisclosure[]> {
    return PHIDisclosure.findAll({
      where: { studentId },
      order: [['disclosureDate', 'DESC']],
      include: ['discloser'],
    });
  }

  /**
   * Get overdue follow-ups
   */
  async getOverdueFollowUps(): Promise<PHIDisclosure[]> {
    return PHIDisclosure.findAll({
      where: {
        followUpRequired: true,
        followUpCompleted: false,
        followUpDate: {
          [Op.lt]: new Date(),
        },
      },
      order: [['followUpDate', 'ASC']],
      include: ['student', 'discloser'],
    });
  }

  /**
   * Mark follow-up as completed
   */
  async completeFollowUp(id: string, userId: string, notes?: string): Promise<PHIDisclosure> {
    const disclosure = await PHIDisclosure.findByPk(id);
    if (!disclosure) {
      throw new Error('Disclosure not found');
    }

    if (!disclosure.followUpRequired) {
      throw new Error('This disclosure does not require follow-up');
    }

    await disclosure.update({
      followUpCompleted: true,
      notes: notes ? `${disclosure.notes || ''}\n\nFollow-up completed: ${notes}` : disclosure.notes,
    });

    await PHIDisclosureAudit.create({
      disclosureId: id,
      action: 'UPDATED',
      changes: { followUpCompleted: true },
      performedBy: userId,
    });

    return disclosure;
  }

  /**
   * Get disclosure statistics for compliance reporting
   */
  async getStatistics(startDate: Date, endDate: Date): Promise<DisclosureStatistics> {
    const disclosures = await PHIDisclosure.findAll({
      where: {
        disclosureDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const stats: DisclosureStatistics = {
      totalDisclosures: disclosures.length,
      byPurpose: {},
      byRecipientType: {},
      byMethod: {},
      followUpsPending: 0,
      followUpsOverdue: 0,
      unauthorizedDisclosures: 0,
    };

    const now = new Date();

    for (const disclosure of disclosures) {
      // Count by purpose
      stats.byPurpose[disclosure.purpose] = (stats.byPurpose[disclosure.purpose] || 0) + 1;

      // Count by recipient type
      stats.byRecipientType[disclosure.recipientType] = (stats.byRecipientType[disclosure.recipientType] || 0) + 1;

      // Count by method
      stats.byMethod[disclosure.method] = (stats.byMethod[disclosure.method] || 0) + 1;

      // Count follow-ups
      if (disclosure.followUpRequired && !disclosure.followUpCompleted) {
        stats.followUpsPending++;
        if (disclosure.followUpDate && disclosure.followUpDate < now) {
          stats.followUpsOverdue++;
        }
      }

      // Count unauthorized disclosures
      if (!disclosure.authorizationObtained && !disclosure.patientRequested) {
        stats.unauthorizedDisclosures++;
      }
    }

    return stats;
  }

  /**
   * Generate HIPAA compliance report
   */
  async generateComplianceReport(startDate: Date, endDate: Date): Promise<any> {
    const stats = await this.getStatistics(startDate, endDate);
    const overdueFollowUps = await this.getOverdueFollowUps();

    return {
      reportPeriod: { startDate, endDate },
      statistics: stats,
      overdueFollowUps: overdueFollowUps.map((d) => ({
        id: d.id,
        studentId: d.studentId,
        recipientName: d.recipientName,
        purpose: d.purpose,
        followUpDate: d.followUpDate,
        daysOverdue: d.followUpDate
          ? Math.floor((new Date().getTime() - d.followUpDate.getTime()) / (1000 * 60 * 60 * 24))
          : 0,
      })),
      complianceStatus: {
        totalDisclosures: stats.totalDisclosures,
        unauthorizedDisclosures: stats.unauthorizedDisclosures,
        complianceRate: stats.totalDisclosures > 0
          ? ((stats.totalDisclosures - stats.unauthorizedDisclosures) / stats.totalDisclosures) * 100
          : 100,
      },
    };
  }
}

export default new PHIDisclosureService();
