/**
 * LOC: COMPDASH001
 * File: /reuse/edwards/financial/composites/downstream/compliance-dashboard-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - ../regulatory-compliance-reporting-composite
 *   - ./sox-compliance-services
 *
 * DOWNSTREAM (imported by):
 *   - Compliance dashboard controllers
 *   - Executive reporting portals
 */

import { Injectable, Logger } from '@nestjs/common';
import { SOXComplianceService } from './sox-compliance-services';

/**
 * Compliance dashboard data
 */
export interface ComplianceDashboardData {
  overallComplianceRate: number;
  totalControls: number;
  effectiveControls: number;
  ineffectiveControls: number;
  controlsDueForTesting: number;
  openFindings: number;
  overdueRemediation: number;
  complianceByFramework: Record<string, number>;
  recentAssessments: any[];
}

/**
 * Compliance dashboard service
 * Aggregates compliance data for executive dashboards
 */
@Injectable()
export class ComplianceDashboardService {
  private readonly logger = new Logger(ComplianceDashboardService.name);

  constructor(private readonly soxService: SOXComplianceService) {}

  /**
   * Retrieves compliance dashboard data
   */
  async getDashboardData(): Promise<ComplianceDashboardData> {
    this.logger.log('Retrieving compliance dashboard data');

    const soxReport = await this.soxService.generateComplianceReport(2024);

    return {
      overallComplianceRate: soxReport.complianceRate,
      totalControls: soxReport.totalControls,
      effectiveControls: soxReport.effectiveControls,
      ineffectiveControls: soxReport.ineffectiveControls,
      controlsDueForTesting: 5,
      openFindings: 3,
      overdueRemediation: 1,
      complianceByFramework: {
        SOX: soxReport.complianceRate,
        HIPAA: 98.5,
        GDPR: 97.0,
      },
      recentAssessments: [],
    };
  }
}
