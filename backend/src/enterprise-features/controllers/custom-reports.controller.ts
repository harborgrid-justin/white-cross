import { Body, Controller, Get, Param, Post, Query, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomReportBuilderService } from '../custom-report-builder.service';
import { CreateReportDefinitionDto, ReportDefinitionResponseDto } from '../dto';

import { BaseController } from '@/common/base';
@ApiTags('Custom Reports')

@Controller('enterprise-features/custom-reports')
@ApiBearerAuth()
export class CustomReportsController extends BaseController {
  constructor(private readonly reportBuilderService: CustomReportBuilderService) {}

  @Post()
  @ApiOperation({ summary: 'Create custom report definition' })
  @ApiResponse({
    status: 201,
    description: 'Report definition created',
    type: ReportDefinitionResponseDto,
  })
  createReportDefinition(@Body() dto: CreateReportDefinitionDto) {
    return this.reportBuilderService.createReport({
      name: dto.name,
      dataSource: dto.dataSource,
      fields: dto.fields,
      filters: dto.filters,
      grouping: dto.grouping,
      sorting: dto.sorting,
      visualization: dto.visualization,
      schedule: dto.schedule,
    });
  }

  @Post(':reportId/execute')
  @ApiOperation({ summary: 'Execute custom report' })
  @ApiResponse({ status: 200, description: 'Report executed' })
  executeReport(@Param('reportId') reportId: string) {
    return this.reportBuilderService.executeReport(reportId);
  }

  @Get(':reportId/export')
  @ApiOperation({ summary: 'Export custom report' })
  @ApiResponse({ status: 200, description: 'Report exported' })
  exportReport(
    @Param('reportId') reportId: string,
    @Query('format') format: 'pdf' | 'excel' | 'csv',
  ) {
    return this.reportBuilderService.exportReport(reportId, format);
  }
}