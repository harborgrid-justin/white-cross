/**
 * LOC: EDU-DOWN-COMPLIANCE-MOD-005
 * Compliance Reporting Module
 * Provides compliance reporting services and controllers
 */

import { Module } from '@nestjs/common';
import { ComplianceReportingController } from './compliance-reporting-controller';
import { ComplianceReportingService } from './compliance-reporting-service';

@Module({
  controllers: [ComplianceReportingController],
  providers: [ComplianceReportingService],
  exports: [ComplianceReportingService],
})
export class ComplianceReportingModule {}
