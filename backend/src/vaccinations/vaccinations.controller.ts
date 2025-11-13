/**
 * @fileoverview Vaccinations Controller
 * @module vaccinations/vaccinations.controller
 * @description Root-level vaccinations endpoints for frontend compatibility
 */

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VaccinationsService } from './vaccinations.service';

import { BaseController } from '../common/base';
@ApiTags('vaccinations')
@Controller('vaccinations')
@UseGuards(JwtAuthGuard)
export class VaccinationsController extends BaseController {
  constructor(private readonly vaccinationsService: VaccinationsService) {}

  @Get('due')
  @ApiOperation({
    summary: 'Get due and overdue vaccinations',
    description:
      'Returns list of vaccinations based on status query parameter. Supports "due", "overdue", or "due,overdue" for combined results.',
  })
  @ApiResponse({
    status: 200,
    description: 'Vaccinations retrieved successfully',
  })
  async getDueVaccinations(@Query() query: any) {
    const { status = 'due', ...otherQuery } = query;

    // Parse status parameter - can be "due", "overdue", or "due,overdue"
    const statusString = typeof status === 'string' ? status : 'due';
    const statuses = statusString.split(',').map((s: string) => s.trim().toLowerCase());

    return this.vaccinationsService.getVaccinationsByStatus(statuses, otherQuery);
  }

  @Get('overdue')
  @ApiOperation({
    summary: 'Get all overdue vaccinations',
    description: 'Returns list of all vaccinations that are overdue across all students.',
  })
  @ApiResponse({
    status: 200,
    description: 'Overdue vaccinations retrieved successfully',
  })
  async getOverdueVaccinations(@Query() query: any) {
    return this.vaccinationsService.getOverdueVaccinations(query);
  }
}
