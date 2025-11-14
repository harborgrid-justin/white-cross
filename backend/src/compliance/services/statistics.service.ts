import { Inject, Injectable } from '@nestjs/common';
import { ComplianceReportRepository } from '../repositories/compliance-report.repository';
import { ChecklistRepository } from '../repositories/checklist.repository';
import { PolicyRepository } from '../repositories/policy.repository';
import { ViolationRepository } from '../repositories/violation.repository';
import { QueryStatisticsDto } from '../dto/statistics.dto';

import { BaseService } from '@/common/base';
@Injectable()
export class StatisticsService extends BaseService {
  constructor(
    @Inject('ComplianceReportRepository')
    private readonly reportRepository: ComplianceReportRepository,
    private readonly checklistRepository: ChecklistRepository,
    private readonly policyRepository: PolicyRepository,
    private readonly violationRepository: ViolationRepository,
  ) {
    super("StatisticsService");
  }

  async getComplianceStatistics(query: QueryStatisticsDto) {
    const { period = 'MONTHLY', startDate, endDate } = query;

    // In a real implementation, these would query the database with date filters
    // For now, return basic counts
    const reports = await this.reportRepository.findAll({}, 1, 1000);
    const checklists = await this.checklistRepository.findAll({}, 1, 1000);
    const policies = await this.policyRepository.findAllPolicies({});
    const violations = await this.violationRepository.findAllViolations(
      {},
      1,
      1000,
    );

    return {
      period,
      dateRange: startDate && endDate ? { startDate, endDate } : undefined,
      reports: {
        total: reports.total,
        compliant: reports.data.filter((r) => r.status === 'COMPLIANT').length,
        nonCompliant: reports.data.filter((r) => r.status === 'NON_COMPLIANT')
          .length,
        pending: reports.data.filter((r) => r.status === 'PENDING').length,
      },
      checklists: {
        total: checklists.total,
        completed: checklists.data.filter((c) => c.status === 'COMPLETED')
          .length,
        pending: checklists.data.filter((c) => c.status === 'PENDING').length,
      },
      policies: {
        total: policies.length,
        active: policies.filter((p) => p.status === 'ACTIVE').length,
        draft: policies.filter((p) => p.status === 'DRAFT').length,
      },
      violations: {
        total: violations.total,
        critical: violations.data.filter((v) => v.severity === 'CRITICAL')
          .length,
        high: violations.data.filter((v) => v.severity === 'HIGH').length,
        resolved: violations.data.filter((v) => v.status === 'RESOLVED').length,
      },
    };
  }

  async getHipaaStatus() {
    const reports = await this.reportRepository.findAll(
      { reportType: 'HIPAA' },
      1,
      100,
    );
    const violations = await this.violationRepository.findAllViolations(
      { violationType: 'HIPAA_BREACH' },
      1,
      100,
    );

    return {
      compliant:
        reports.data.filter((r) => r.status === 'COMPLIANT').length > 0,
      recentReports: reports.data.slice(0, 5),
      openViolations: violations.data.filter((v) => v.status !== 'RESOLVED')
        .length,
      lastReviewDate: reports.data[0]?.reviewedAt || null,
    };
  }

  async getFerpaStatus() {
    const reports = await this.reportRepository.findAll(
      { reportType: 'FERPA' },
      1,
      100,
    );
    const violations = await this.violationRepository.findAllViolations(
      { violationType: 'FERPA_VIOLATION' },
      1,
      100,
    );

    return {
      compliant:
        reports.data.filter((r) => r.status === 'COMPLIANT').length > 0,
      recentReports: reports.data.slice(0, 5),
      openViolations: violations.data.filter((v) => v.status !== 'RESOLVED')
        .length,
      lastReviewDate: reports.data[0]?.reviewedAt || null,
    };
  }

  async getComplianceDashboard() {
    const [statistics, hipaaStatus, ferpaStatus] = await Promise.all([
      this.getComplianceStatistics({}),
      this.getHipaaStatus(),
      this.getFerpaStatus(),
    ]);

    return {
      overview: statistics,
      hipaa: hipaaStatus,
      ferpa: ferpaStatus,
      timestamp: new Date().toISOString(),
    };
  }
}
