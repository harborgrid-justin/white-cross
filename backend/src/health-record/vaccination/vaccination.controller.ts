/**
 * @fileoverview Vaccination Controller
 * @module health-record/vaccination/vaccination.controller
 * @description HTTP endpoints for CDC-compliant vaccination tracking
 */

import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query, Version } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VaccinationService } from './vaccination.service';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { BaseController } from '@/common/base';
import {
  BatchImportResponseDto,
  BatchVaccinationDto,
  CDCScheduleQueryDto,
  ComplianceReportQueryDto,
  CreateExemptionDto,
  DueVaccinationsResponseDto,
} from './dto/vaccination-endpoints.dto';

@ApiTags('health-record-vaccination')

@Controller('health-record/vaccination')
// @ApiBearerAuth()
export class VaccinationController extends BaseController {
  constructor(private readonly vaccinationService: VaccinationService) {
    super();}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add vaccination record',
    description:
      'Records a vaccination with CDC CVX code, lot number, and administration details.',
  })
  @ApiResponse({
    status: 201,
    description: 'Vaccination recorded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(@Body() createDto: CreateVaccinationDto) {
    return this.vaccinationService.addVaccination(createDto);
  }

  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get vaccination history',
    description: 'Retrieves complete vaccination history for a student.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Vaccination history retrieved successfully',
  })
  async getHistory(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ) {
    return this.vaccinationService.getVaccinationHistory(studentId);
  }

  @Get('student/:studentId/compliance')
  @ApiOperation({
    summary: 'Check compliance status',
    description:
      'Checks student vaccination compliance against CDC guidelines.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Compliance status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        compliant: { type: 'boolean' },
        missing: { type: 'array', items: { type: 'string' } },
        upcoming: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async checkCompliance(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ) {
    return this.vaccinationService.checkComplianceStatus(studentId);
  }

  /**
   * GAP-VAX-001: Get due vaccinations for student
   */
  @Get('student/:studentId/due')
  @ApiOperation({
    summary: 'Get due vaccinations for student',
    description: 'Returns list of upcoming vaccinations due for the student.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Due vaccinations retrieved successfully',
    type: DueVaccinationsResponseDto,
  })
  async getDueVaccinations(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ): Promise<DueVaccinationsResponseDto> {
    return this.vaccinationService.getDueVaccinations(studentId);
  }

  /**
   * GAP-VAX-002: Get overdue vaccinations for student
   */
  @Get('student/:studentId/overdue')
  @ApiOperation({
    summary: 'Get overdue vaccinations for student',
    description: 'Returns list of overdue vaccinations for the student.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Overdue vaccinations retrieved successfully',
    type: DueVaccinationsResponseDto,
  })
  async getOverdueVaccinationsForStudent(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ): Promise<DueVaccinationsResponseDto> {
    return this.vaccinationService.getOverdueVaccinationsForStudent(studentId);
  }

  /**
   * GAP-VAX-003: Batch vaccination import
   */
  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Import vaccinations in batch',
    description:
      'Imports multiple vaccination records at once for bulk data entry.',
  })
  @ApiResponse({
    status: 201,
    description: 'Batch import completed',
    type: BatchImportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async batchImport(
    @Body() batchDto: BatchVaccinationDto,
  ): Promise<BatchImportResponseDto> {
    return this.vaccinationService.batchImport(batchDto.vaccinations);
  }

  /**
   * GAP-VAX-004: Get CDC vaccination schedule
   */
  @Get('cdc-schedule')
  @ApiOperation({
    summary: 'Get CDC vaccination schedule',
    description:
      'Returns CDC-recommended vaccination schedule by age or grade.',
  })
  @ApiResponse({
    status: 200,
    description: 'CDC schedule retrieved successfully',
  })
  async getCDCSchedule(@Query() query: CDCScheduleQueryDto) {
    return this.vaccinationService.getCDCSchedule(query);
  }

  /**
   * GAP-VAX-005: Create vaccination exemption
   */
  @Post('student/:studentId/exemption')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add vaccination exemption',
    description:
      'Creates medical, religious, or personal exemption for vaccination requirements.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Exemption created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid exemption data',
  })
  async createExemption(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
    @Body() exemptionDto: CreateExemptionDto,
  ) {
    return this.vaccinationService.createExemption(studentId, exemptionDto);
  }

  /**
   * GAP-VAX-006: Get compliance report
   */
  @Get('compliance-report')
  @ApiOperation({
    summary: 'Get vaccination compliance report',
    description:
      'Generates compliance report across students with filtering options.',
  })
  @ApiResponse({
    status: 200,
    description: 'Compliance report generated successfully',
  })
  async getComplianceReport(@Query() query: ComplianceReportQueryDto) {
    return this.vaccinationService.getComplianceReport(query);
  }
}
