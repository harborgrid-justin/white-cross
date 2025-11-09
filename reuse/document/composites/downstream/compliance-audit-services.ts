/**
 * LOC: COMPAUD001
 * File: /reuse/document/composites/downstream/compliance-audit-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js built-in)
 *   - ../document-security-encryption-composite
 *
 * DOWNSTREAM (imported by):
 *   - Compliance management services
 *   - Audit controllers
 *   - Compliance reporting services
 */

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Compliance standard types
 */
export enum ComplianceStandard {
  HIPAA = 'HIPAA',
  GDPR = 'GDPR',
  CCPA = 'CCPA',
  PCI_DSS = 'PCI_DSS',
  SOC2 = 'SOC2',
  ISO27001 = 'ISO27001',
  HITRUST = 'HITRUST',
}

/**
 * Audit finding severity
 */
export enum AuditFindingSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

/**
 * Audit finding
 */
export interface AuditFinding {
  findingId: string;
  severity: AuditFindingSeverity;
  category: string;
  description: string;
  affectedResources: string[];
  remediation: string;
  dueDate: Date;
  status: 'OPEN' | 'IN_PROGRESS' | 'REMEDIATED' | 'ACCEPTED_RISK';
  evidence: string[];
  detectedAt: Date;
  remediatedAt?: Date;
}

/**
 * Compliance audit
 */
export interface ComplianceAudit {
  auditId: string;
  standard: ComplianceStandard;
  scope: string;
  auditedBy: string;
  startDate: Date;
  completedDate?: Date;
  findings: AuditFinding[];
  complianceScore: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  recommendations: string[];
  nextAuditDate?: Date;
}

/**
 * Compliance audit service
 * Manages compliance audits and remediation tracking
 */
@Injectable()
export class ComplianceAuditService {
  private readonly logger = new Logger(ComplianceAuditService.name);
  private audits: Map<string, ComplianceAudit> = new Map();
  private findings: Map<string, AuditFinding> = new Map();
  private auditSchedule: Map<string, { nextAuditDate: Date; standard: ComplianceStandard; frequency: 'ANNUAL' | 'SEMI_ANNUAL' | 'QUARTERLY' }> = new Map();

  constructor() {
    this.initializeAuditSchedules();
  }

  /**
   * Initializes default audit schedules
   */
  private initializeAuditSchedules(): void {
    const standards = [
      { standard: ComplianceStandard.HIPAA, frequency: 'ANNUAL' as const },
      { standard: ComplianceStandard.GDPR, frequency: 'ANNUAL' as const },
      { standard: ComplianceStandard.SOC2, frequency: 'SEMI_ANNUAL' as const },
      { standard: ComplianceStandard.ISO27001, frequency: 'ANNUAL' as const }
    ];

    standards.forEach(({ standard, frequency }) => {
      const nextAuditDate = new Date();
      if (frequency === 'ANNUAL') {
        nextAuditDate.setFullYear(nextAuditDate.getFullYear() + 1);
      } else if (frequency === 'SEMI_ANNUAL') {
        nextAuditDate.setMonth(nextAuditDate.getMonth() + 6);
      } else if (frequency === 'QUARTERLY') {
        nextAuditDate.setMonth(nextAuditDate.getMonth() + 3);
      }

      this.auditSchedule.set(standard, { nextAuditDate, standard, frequency });
    });
  }

  /**
   * Creates compliance audit
   * @param standard - Compliance standard to audit
   * @param scope - Audit scope
   * @param auditedBy - Auditor name/ID
   * @returns Created audit
   */
  async createAudit(
    standard: ComplianceStandard,
    scope: string,
    auditedBy: string
  ): Promise<ComplianceAudit> {
    try {
      const auditId = crypto.randomUUID();
      const startDate = new Date();

      const audit: ComplianceAudit = {
        auditId,
        standard,
        scope,
        auditedBy,
        startDate,
        findings: [],
        complianceScore: 0,
        status: 'IN_PROGRESS',
        recommendations: []
      };

      this.audits.set(auditId, audit);

      this.logger.log(`Compliance audit created: ${auditId} - ${standard}`);

      return audit;
    } catch (error) {
      this.logger.error(`Failed to create audit: ${error.message}`);
      throw new BadRequestException('Failed to create compliance audit');
    }
  }

  /**
   * Records audit finding
   * @param auditId - Audit identifier
   * @param category - Finding category
   * @param description - Finding description
   * @param severity - Finding severity
   * @param remediation - Recommended remediation
   * @returns Recorded finding
   */
  async recordFinding(
    auditId: string,
    category: string,
    description: string,
    severity: AuditFindingSeverity,
    remediation: string
  ): Promise<AuditFinding> {
    try {
      const audit = this.audits.get(auditId);
      if (!audit) {
        throw new BadRequestException('Audit not found');
      }

      const findingId = crypto.randomUUID();
      const daysUntilDue = severity === AuditFindingSeverity.CRITICAL ? 7 :
                          severity === AuditFindingSeverity.HIGH ? 30 :
                          severity === AuditFindingSeverity.MEDIUM ? 60 : 120;

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + daysUntilDue);

      const finding: AuditFinding = {
        findingId,
        severity,
        category,
        description,
        affectedResources: [],
        remediation,
        dueDate,
        status: 'OPEN',
        evidence: [],
        detectedAt: new Date()
      };

      this.findings.set(findingId, finding);
      audit.findings.push(finding);

      this.logger.log(`Audit finding recorded: ${findingId} (${severity})`);

      return finding;
    } catch (error) {
      this.logger.error(`Failed to record finding: ${error.message}`);
      throw new BadRequestException('Failed to record audit finding');
    }
  }

  /**
   * Updates finding remediation status
   * @param findingId - Finding identifier
   * @param status - New status
   * @param remediationNotes - Remediation details
   * @returns Updated finding
   */
  async updateFindingStatus(
    findingId: string,
    status: 'OPEN' | 'IN_PROGRESS' | 'REMEDIATED' | 'ACCEPTED_RISK',
    remediationNotes?: string
  ): Promise<AuditFinding> {
    const finding = this.findings.get(findingId);
    if (!finding) {
      throw new BadRequestException('Finding not found');
    }

    finding.status = status;

    if (status === 'REMEDIATED') {
      finding.remediatedAt = new Date();
    }

    if (remediationNotes) {
      finding.evidence.push(remediationNotes);
    }

    this.logger.log(`Finding status updated: ${findingId} -> ${status}`);

    return finding;
  }

  /**
   * Completes compliance audit
   * @param auditId - Audit identifier
   * @returns Completed audit with score
   */
  async completeAudit(auditId: string): Promise<ComplianceAudit> {
    try {
      const audit = this.audits.get(auditId);
      if (!audit) {
        throw new BadRequestException('Audit not found');
      }

      // Calculate compliance score
      const totalFindings = audit.findings.length;
      const remediatedFindings = audit.findings.filter(f => f.status === 'REMEDIATED').length;
      const acceptedRiskFindings = audit.findings.filter(f => f.status === 'ACCEPTED_RISK').length;

      const complianceScore = totalFindings === 0 ? 100 :
        Math.round(((remediatedFindings + acceptedRiskFindings) / totalFindings) * 100);

      audit.complianceScore = complianceScore;
      audit.completedDate = new Date();
      audit.status = complianceScore >= 85 ? 'COMPLETED' : 'COMPLETED';

      // Schedule next audit
      const schedule = this.auditSchedule.get(audit.standard);
      if (schedule) {
        const nextDate = new Date();
        if (schedule.frequency === 'ANNUAL') {
          nextDate.setFullYear(nextDate.getFullYear() + 1);
        } else if (schedule.frequency === 'SEMI_ANNUAL') {
          nextDate.setMonth(nextDate.getMonth() + 6);
        }
        audit.nextAuditDate = nextDate;
        schedule.nextAuditDate = nextDate;
      }

      this.logger.log(`Compliance audit completed: ${auditId} (Score: ${complianceScore}%)`);

      return audit;
    } catch (error) {
      this.logger.error(`Failed to complete audit: ${error.message}`);
      throw new BadRequestException('Failed to complete audit');
    }
  }

  /**
   * Gets audit details
   * @param auditId - Audit identifier
   * @returns Audit details or null
   */
  async getAudit(auditId: string): Promise<ComplianceAudit | null> {
    return this.audits.get(auditId) || null;
  }

  /**
   * Gets audits by standard
   * @param standard - Compliance standard
   * @returns List of audits
   */
  async getAuditsByStandard(standard: ComplianceStandard): Promise<ComplianceAudit[]> {
    return Array.from(this.audits.values())
      .filter(a => a.standard === standard);
  }

  /**
   * Gets open findings
   * @param filters - Filter criteria
   * @returns List of open findings
   */
  async getOpenFindings(filters?: {
    severity?: AuditFindingSeverity;
    category?: string;
    overdue?: boolean;
  }): Promise<AuditFinding[]> {
    let findings = Array.from(this.findings.values())
      .filter(f => f.status === 'OPEN');

    if (filters?.severity) {
      findings = findings.filter(f => f.severity === filters.severity);
    }
    if (filters?.category) {
      findings = findings.filter(f => f.category === filters.category);
    }
    if (filters?.overdue) {
      const now = new Date();
      findings = findings.filter(f => f.dueDate < now);
    }

    return findings;
  }

  /**
   * Generates compliance score summary
   * @returns Summary of compliance scores by standard
   */
  async generateComplianceSummary(): Promise<Record<string, any>> {
    const summary: Record<string, any> = {};

    for (const standard of Object.values(ComplianceStandard)) {
      const audits = Array.from(this.audits.values())
        .filter(a => a.standard === standard);

      const completedAudits = audits.filter(a => a.status === 'COMPLETED');
      const lastAudit = completedAudits.length > 0
        ? completedAudits[completedAudits.length - 1]
        : null;

      const schedule = this.auditSchedule.get(standard);

      summary[standard] = {
        lastAuditDate: lastAudit?.completedDate,
        complianceScore: lastAudit?.complianceScore || 0,
        nextAuditDate: schedule?.nextAuditDate,
        openFindings: Array.from(this.findings.values())
          .filter(f => f.status === 'OPEN' &&
                       audits.some(a => a.findings.includes(f)))
          .length,
        criticalFindings: Array.from(this.findings.values())
          .filter(f => f.severity === AuditFindingSeverity.CRITICAL &&
                       audits.some(a => a.findings.includes(f)))
          .length
      };
    }

    return summary;
  }

  /**
   * Gets overdue findings
   * @returns List of overdue findings
   */
  async getOverdueFindings(): Promise<AuditFinding[]> {
    const now = new Date();
    return Array.from(this.findings.values())
      .filter(f => f.status !== 'REMEDIATED' && f.status !== 'ACCEPTED_RISK' && f.dueDate < now);
  }

  /**
   * Gets audit schedule
   * @returns Audit schedule
   */
  async getAuditSchedule(): Promise<any[]> {
    return Array.from(this.auditSchedule.values())
      .map(schedule => ({
        standard: schedule.standard,
        nextAuditDate: schedule.nextAuditDate,
        frequency: schedule.frequency
      }));
  }
}

export default ComplianceAuditService;
