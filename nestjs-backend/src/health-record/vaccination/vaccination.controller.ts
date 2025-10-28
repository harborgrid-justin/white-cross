/**
 * @fileoverview Vaccination Controller
 * @module health-record/vaccination/vaccination.controller
 * @description HTTP endpoints for CDC-compliant vaccination tracking
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VaccinationService } from './vaccination.service';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';

@ApiTags('health-record-vaccination')
@Controller('health-record/vaccination')
// @ApiBearerAuth()
export class VaccinationController {
  constructor(private readonly vaccinationService: VaccinationService) {}

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
}
