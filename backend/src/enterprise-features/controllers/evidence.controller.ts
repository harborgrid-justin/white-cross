import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PhotoVideoEvidenceService } from '../photo-video-evidence.service';
import { DeleteEvidenceDto, EvidenceFileResponseDto, UploadEvidenceDto } from '../dto';

import { BaseController } from '@/common/base';
@ApiTags('Evidence Management')

@Controller('enterprise-features/evidence')
@ApiBearerAuth()
export class EvidenceController extends BaseController {
  constructor(
    private readonly evidenceService: PhotoVideoEvidenceService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Upload evidence file' })
  @ApiResponse({
    status: 201,
    description: 'Evidence uploaded',
    type: EvidenceFileResponseDto,
  })
  uploadEvidence(@Body() dto: UploadEvidenceDto) {
    return this.evidenceService.uploadEvidence(
      dto.incidentId,
      dto.fileData,
      dto.type,
      dto.uploadedBy,
    );
  }

  @Get(':evidenceId')
  @ApiOperation({ summary: 'Get evidence with audit trail' })
  @ApiResponse({ status: 200, description: 'Evidence retrieved' })
  getEvidenceWithAudit(
    @Param('evidenceId') evidenceId: string,
    @Query('accessedBy') accessedBy: string,
  ) {
    return this.evidenceService.getEvidenceWithAudit(
      evidenceId,
      accessedBy,
    );
  }

  @Delete(':evidenceId')
  @ApiOperation({ summary: 'Delete evidence file' })
  @ApiResponse({ status: 200, description: 'Evidence deleted' })
  @HttpCode(HttpStatus.OK)
  deleteEvidence(
    @Param('evidenceId') evidenceId: string,
    @Body() dto: DeleteEvidenceDto,
  ) {
    return this.evidenceService.deleteEvidence(
      evidenceId,
      dto.deletedBy,
      dto.reason,
    );
  }
}