/**
 * Dashboard Controller
 * Provides REST API endpoints for dashboard statistics, analytics, and real-time data
 */

import {
  Controller,
  Get,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import {
  DashboardStatsDto,
  RecentActivityDto,
  UpcomingAppointmentDto,
  DashboardChartDataDto,
  GetChartDataDto,
  GetRecentActivitiesDto,
  GetUpcomingAppointmentsDto,
  GetStatsByScopeDto,
} from './dto';

/**
 * Dashboard Controller
 *
 * Exposes comprehensive dashboard endpoints for:
 * - Real-time statistics with trend analysis
 * - Recent activity feeds
 * - Upcoming appointments
 * - Chart data for visualizations
 * - Cache management
 */
@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * GET /dashboard/stats
   * Get comprehensive dashboard statistics with trend analysis
   *
   * Returns:
   * - Total active students
   * - Active medication prescriptions
   * - Today's appointments
   * - Pending incident reports
   * - Medications due today
   * - Critical health alerts
   * - Recent activity count
   * - Month-over-month trends
   *
   * Cached for 5 minutes for performance optimization
   */
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get dashboard statistics',
    description: 'Retrieves comprehensive dashboard statistics with trend analysis. ' +
                 'Includes total students, active medications, appointments, incidents, health alerts, ' +
                 'and month-over-month trend comparisons. Results are cached for 5 minutes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
    type: DashboardStatsDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getDashboardStats(): Promise<DashboardStatsDto> {
    this.logger.log('GET /dashboard/stats');
    return this.dashboardService.getDashboardStats();
  }

  /**
   * GET /dashboard/recent-activities
   * Get recent activities across all modules
   *
   * Returns a feed of recent:
   * - Medication administrations
   * - Incident reports
   * - Upcoming appointments
   *
   * Query Parameters:
   * - limit: Maximum number of activities to return (1-50, default: 5)
   */
  @Get('recent-activities')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get recent activities',
    description: 'Retrieves recent activity feed from medication logs, incident reports, and upcoming appointments. ' +
                 'Activities are sorted by time and limited to the specified count.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of activities to return (1-50)',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Recent activities retrieved successfully',
    type: [RecentActivityDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getRecentActivities(
    @Query(new ValidationPipe({ transform: true })) query: GetRecentActivitiesDto,
  ): Promise<RecentActivityDto[]> {
    this.logger.log(`GET /dashboard/recent-activities?limit=${query.limit || 5}`);
    return this.dashboardService.getRecentActivities(query.limit);
  }

  /**
   * GET /dashboard/upcoming-appointments
   * Get upcoming appointments with priority classification
   *
   * Returns scheduled appointments sorted by time with:
   * - Student information
   * - Appointment type
   * - Priority level (high/medium/low)
   * - Formatted time
   *
   * Query Parameters:
   * - limit: Maximum number of appointments to return (1-50, default: 5)
   */
  @Get('upcoming-appointments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get upcoming appointments',
    description: 'Retrieves upcoming scheduled appointments with priority classification. ' +
                 'Priority is determined by appointment type (emergency/medication = high, routine = low).',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of appointments to return (1-50)',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming appointments retrieved successfully',
    type: [UpcomingAppointmentDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getUpcomingAppointments(
    @Query(new ValidationPipe({ transform: true })) query: GetUpcomingAppointmentsDto,
  ): Promise<UpcomingAppointmentDto[]> {
    this.logger.log(`GET /dashboard/upcoming-appointments?limit=${query.limit || 5}`);
    return this.dashboardService.getUpcomingAppointments(query.limit);
  }

  /**
   * GET /dashboard/chart-data
   * Get chart data for dashboard visualizations
   *
   * Returns time-series data for:
   * - Student enrollment trends
   * - Medication administration frequency
   * - Incident report frequency
   * - Appointment scheduling patterns
   *
   * Query Parameters:
   * - period: Time period for data aggregation ('week', 'month', or 'year', default: 'week')
   */
  @Get('chart-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get chart data',
    description: 'Retrieves time-series chart data for dashboard visualizations. ' +
                 'Includes enrollment trends, medication administration, incident frequency, and appointment trends.',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['week', 'month', 'year'],
    description: 'Time period for data aggregation',
    example: 'week',
  })
  @ApiResponse({
    status: 200,
    description: 'Chart data retrieved successfully',
    type: DashboardChartDataDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getChartData(
    @Query(new ValidationPipe({ transform: true })) query: GetChartDataDto,
  ): Promise<DashboardChartDataDto> {
    this.logger.log(`GET /dashboard/chart-data?period=${query.period || 'week'}`);
    return this.dashboardService.getChartData(query.period);
  }

  /**
   * GET /dashboard/stats-by-scope
   * Get dashboard statistics filtered by school or district
   *
   * Returns scoped dashboard statistics for multi-tenant deployments.
   *
   * Query Parameters:
   * - schoolId: Optional school ID to filter data
   * - districtId: Optional district ID to filter data
   */
  @Get('stats-by-scope')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get scoped dashboard statistics',
    description: 'Retrieves dashboard statistics filtered by school or district for multi-tenant deployments. ' +
                 'Currently returns general stats but can be extended for specific scope filtering.',
  })
  @ApiQuery({
    name: 'schoolId',
    required: false,
    type: String,
    description: 'School ID to filter dashboard data',
  })
  @ApiQuery({
    name: 'districtId',
    required: false,
    type: String,
    description: 'District ID to filter dashboard data',
  })
  @ApiResponse({
    status: 200,
    description: 'Scoped dashboard statistics retrieved successfully',
    type: DashboardStatsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getDashboardStatsByScope(
    @Query(new ValidationPipe({ transform: true })) query: GetStatsByScopeDto,
  ): Promise<DashboardStatsDto> {
    this.logger.log(`GET /dashboard/stats-by-scope?schoolId=${query.schoolId || 'none'}&districtId=${query.districtId || 'none'}`);
    return this.dashboardService.getDashboardStatsByScope(query.schoolId, query.districtId);
  }

  /**
   * DELETE /dashboard/cache
   * Clear the dashboard statistics cache
   *
   * Forces fresh data retrieval on the next stats request.
   * Useful after bulk data operations or when immediate updates are needed.
   */
  @Delete('cache')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Clear dashboard cache',
    description: 'Clears the dashboard statistics cache, forcing fresh data retrieval on the next request. ' +
                 'Use this after bulk data operations when immediate dashboard updates are required.',
  })
  @ApiResponse({
    status: 204,
    description: 'Cache cleared successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  clearCache(): void {
    this.logger.log('DELETE /dashboard/cache');
    this.dashboardService.clearCache();
  }
}
