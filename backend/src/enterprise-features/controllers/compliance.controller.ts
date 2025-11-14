import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HipaaComplianceService } from '../hipaa-compliance.service';
import { RegulationTrackingService } from '../regulation-tracking.service';
import { GenerateComplianceReportDto, HIPAAComplianceCheckResponseDto, RegulationUpdateResponseDto } from '../dto';

import { BaseController } from '@/common/base';
@ApiTags('Compliance & Regulations')

@Controller('enterprise-features')
@ApiBearerAuth()
export class ComplianceController extends BaseController {
  constructor(
    private readonly hipaaComplianceService: HipaaComplianceService,
    private readonly regulationTrackingService: RegulationTrackingService,
  ) {}

  @Get('compliance/audit')
  @ApiOperation({ summary: 'Perform HIPAA compliance audit' })
  @ApiResponse({
    status: 200,
    description: 'Compliance audit completed',
    type: [HIPAAComplianceCheckResponseDto],
  })
  performComplianceAudit() {
    return this.hipaaComplianceService.performComplianceAudit();
  }

  @Get('compliance/report')
  @ApiOperation({ summary: 'Generate compliance report' })
  @ApiResponse({ status: 200, description: 'Compliance report generated' })
  generateComplianceReport(@Query() dto: GenerateComplianceReportDto) {
    return this.hipaaComplianceService.generateComplianceReport(
      new Date(dto.startDate),
      new Date(dto.endDate),
    );
  }

  @Get('regulations/:state')
  @ApiOperation({ summary: 'Track regulation changes for state' })
  @ApiResponse({
    status: 200,
    description: 'Regulation changes retrieved',
    type: [RegulationUpdateResponseDto],
  })
  trackRegulationChanges(@Param('state') state: string) {
    return this.regulationTrackingService.trackRegulationChanges(state);
  }

  @Get('regulations/:regulationId/impact')
  @ApiOperation({ summary: 'Assess regulation impact' })
  @ApiResponse({ status: 200, description: 'Impact assessment completed' })
  assessImpact(@Param('regulationId') regulationId: string) {
    return this.regulationTrackingService.assessImpact(regulationId);
  }
}