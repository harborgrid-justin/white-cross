import { Body, Controller, Get, Param, Post, Query, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InsuranceClaimService } from '../insurance-claim.service';
import { GenerateClaimDto, InsuranceClaimResponseDto } from '../dto';

import { BaseController } from '@/common/base';
@ApiTags('Insurance Claims')

@Controller('enterprise-features/insurance-claims')
@ApiBearerAuth()
export class InsuranceClaimsController extends BaseController {
  constructor(
    private readonly insuranceClaimService: InsuranceClaimService,
  ) {
    super();}

  @Post()
  @ApiOperation({ summary: 'Generate insurance claim' })
  @ApiResponse({
    status: 201,
    description: 'Claim generated',
    type: InsuranceClaimResponseDto,
  })
  generateClaim(@Body() dto: GenerateClaimDto) {
    return this.insuranceClaimService.createClaim(
      dto.incidentId,
      dto.studentId,
    );
  }

  @Get(':claimId/export')
  @ApiOperation({ summary: 'Export insurance claim' })
  @ApiResponse({ status: 200, description: 'Claim exported' })
  exportClaimToFormat(
    @Param('claimId') claimId: string,
    @Query('format') format: 'pdf' | 'xml' | 'edi',
  ) {
    return this.insuranceClaimService.exportClaim(claimId, format);
  }

  @Post(':claimId/submit')
  @ApiOperation({ summary: 'Submit insurance claim electronically' })
  @ApiResponse({ status: 200, description: 'Claim submitted' })
  submitClaimElectronically(@Param('claimId') claimId: string) {
    return this.insuranceClaimService.submitClaimElectronically(claimId);
  }
}