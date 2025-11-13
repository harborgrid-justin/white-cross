import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClinicVisitBasicService } from '../services/clinic-visit-basic.service';
import { ClinicVisitAnalyticsService } from '../services/clinic-visit-analytics.service';
import { CheckInDto } from '../dto/visit/check-in.dto';
import { CheckOutDto } from '../dto/visit/check-out.dto';
import { VisitFiltersDto } from '../dto/visit/visit-filters.dto';

import { BaseController } from '../../../common/base';
/**
 * Clinic Visit Controller
 * REST API for clinic visit workflow and tracking
 */
@ApiTags('Clinical - Clinic Visits')
@ApiBearerAuth()
@Controller('clinical/visits')
export class ClinicVisitController extends BaseController {
  constructor(
    private readonly clinicVisitBasicService: ClinicVisitBasicService,
    private readonly clinicVisitAnalyticsService: ClinicVisitAnalyticsService,
  ) {}

  /**
   * Check in a student to the clinic
   */
  @Post('check-in')
  @ApiOperation({
    summary: 'Check in student to clinic',
    description:
      'Creates a new clinic visit and validates no active visit exists',
  })
  @ApiResponse({ status: 201, description: 'Student checked in successfully' })
  @ApiResponse({
    status: 409,
    description: 'Student already has an active visit',
  })
  async checkIn(@Body() checkInDto: CheckInDto) {
    return this.clinicVisitBasicService.checkIn(checkInDto);
  }

  /**
   * Check out a student from the clinic
   */
  @Post(':id/check-out')
  @ApiOperation({
    summary: 'Check out student from clinic',
    description: 'Updates visit with treatment and disposition',
  })
  @ApiParam({ name: 'id', description: 'Visit ID' })
  @ApiResponse({ status: 200, description: 'Student checked out successfully' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  @ApiResponse({ status: 400, description: 'Visit already checked out' })
  async checkOut(@Param('id') id: string, @Body() checkOutDto: CheckOutDto) {
    return this.clinicVisitBasicService.checkOut(id, checkOutDto);
  }

  /**
   * Get active clinic visits
   */
  @Get('active')
  @ApiOperation({
    summary: 'Get all active clinic visits',
    description: 'Returns visits that have not been checked out',
  })
  @ApiResponse({
    status: 200,
    description: 'Active visits retrieved successfully',
  })
  async getActiveVisits() {
    return this.clinicVisitBasicService.getActiveVisits();
  }

  /**
   * Get visit by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get visit by ID' })
  @ApiParam({ name: 'id', description: 'Visit ID' })
  @ApiResponse({ status: 200, description: 'Visit found successfully' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  async getVisitById(@Param('id') id: string) {
    return this.clinicVisitBasicService.getVisitById(id);
  }

  /**
   * Query visits with filters
   */
  @Get()
  @ApiOperation({
    summary: 'Query visits with filters',
    description: 'Search and filter visits with pagination',
  })
  @ApiResponse({ status: 200, description: 'Visits retrieved successfully' })
  async getVisits(@Query() filters: VisitFiltersDto) {
    return this.clinicVisitBasicService.getVisits(filters);
  }

  /**
   * Get student visit history
   */
  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get visit history for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of results',
  })
  @ApiResponse({
    status: 200,
    description: 'Student visits retrieved successfully',
  })
  async getVisitsByStudent(
    @Param('studentId') studentId: string,
    @Query('limit') limit?: number,
  ) {
    return this.clinicVisitBasicService.getVisitsByStudent(studentId, limit);
  }

  /**
   * Update visit information
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update visit information' })
  @ApiParam({ name: 'id', description: 'Visit ID' })
  @ApiResponse({ status: 200, description: 'Visit updated successfully' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  async updateVisit(
    @Param('id') id: string,
    @Body() updates: Partial<CheckInDto & CheckOutDto>,
  ) {
    return this.clinicVisitBasicService.updateVisit(id, updates);
  }

  /**
   * Delete visit
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete visit record' })
  @ApiParam({ name: 'id', description: 'Visit ID' })
  @ApiResponse({ status: 204, description: 'Visit deleted successfully' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  async deleteVisit(@Param('id') id: string) {
    await this.clinicVisitBasicService.deleteVisit(id);
  }

  /**
   * Get visit statistics
   */
  @Get('statistics/summary')
  @ApiOperation({
    summary: 'Get visit statistics',
    description: 'Aggregated statistics for a date range',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (ISO 8601)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (ISO 8601)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.clinicVisitAnalyticsService.getStatistics(
      new Date(startDate),
      new Date(endDate),
    );
  }

  /**
   * Get student visit summary
   */
  @Get('student/:studentId/summary')
  @ApiOperation({
    summary: 'Get visit summary for a student',
    description: 'Aggregated visit history and frequency for a student',
  })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (ISO 8601)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (ISO 8601)',
  })
  @ApiResponse({
    status: 200,
    description: 'Student summary retrieved successfully',
  })
  async getStudentVisitSummary(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.clinicVisitAnalyticsService.getStudentVisitSummary(
      studentId,
      start,
      end,
    );
  }

  /**
   * Get frequent visitors
   */
  @Get('statistics/frequent-visitors')
  @ApiOperation({
    summary: 'Get frequent clinic visitors',
    description: 'Students with highest visit frequency in date range',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (ISO 8601)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (ISO 8601)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of results',
  })
  @ApiResponse({
    status: 200,
    description: 'Frequent visitors retrieved successfully',
  })
  async getFrequentVisitors(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('limit') limit?: number,
  ) {
    return this.clinicVisitAnalyticsService.getFrequentVisitors(
      new Date(startDate),
      new Date(endDate),
      limit,
    );
  }

  /**
   * Get visits by time of day
   */
  @Get('statistics/time-distribution')
  @ApiOperation({
    summary: 'Get visit time distribution',
    description: 'Distribution of visits by time of day',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (ISO 8601)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (ISO 8601)',
  })
  @ApiResponse({
    status: 200,
    description: 'Time distribution retrieved successfully',
  })
  async getVisitsByTimeOfDay(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.clinicVisitAnalyticsService.getVisitsByTimeOfDay(
      new Date(startDate),
      new Date(endDate),
    );
  }
}
