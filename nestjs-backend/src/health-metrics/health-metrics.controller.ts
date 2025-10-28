import { Controller, Get, Post, Patch, Body, Query, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { HealthMetricsService } from './health-metrics.service';
import { CreateVitalsDto } from './dto/create-vitals.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { GetMetricsQueryDto } from './dto/get-metrics-query.dto';
import { GetVitalsQueryDto } from './dto/get-vitals-query.dto';
import { GetAlertsQueryDto } from './dto/get-alerts-query.dto';
import { GetTrendsQueryDto } from './dto/get-trends-query.dto';
import { GetDepartmentQueryDto } from './dto/get-department-query.dto';

@Controller('health-metrics')
@UsePipes(new ValidationPipe({ transform: true }))
export class HealthMetricsController {
  constructor(private readonly healthMetricsService: HealthMetricsService) {}

  @Get('overview')
  async getMetricsOverview(@Query() query: GetMetricsQueryDto) {
    return this.healthMetricsService.getMetricsOverview(
      query.timeRange,
      query.department,
      query.refresh
    );
  }

  @Get('vitals/live')
  async getLiveVitals(@Query() query: GetVitalsQueryDto) {
    return this.healthMetricsService.getLiveVitals(
      query.patientIds,
      query.department,
      query.critical,
      query.limit
    );
  }

  @Get('patients/:id/trends')
  async getPatientTrends(
    @Param('id') patientId: string,
    @Query() query: GetTrendsQueryDto
  ) {
    return this.healthMetricsService.getPatientTrends(
      parseInt(patientId, 10),
      query.metrics,
      query.timeRange,
      query.granularity
    );
  }

  @Get('departments/performance')
  async getDepartmentPerformance(@Query() query: GetDepartmentQueryDto) {
    return this.healthMetricsService.getDepartmentPerformance(
      query.timeRange || '24h',
      query.includeHistorical
    );
  }

  @Post('vitals')
  async recordVitals(@Body() createVitalsDto: CreateVitalsDto) {
    return this.healthMetricsService.recordVitals(createVitalsDto);
  }

  @Get('alerts')
  async getHealthAlerts(@Query() query: GetAlertsQueryDto) {
    return this.healthMetricsService.getHealthAlerts(
      query.severity,
      query.department,
      query.status,
      query.limit
    );
  }

  @Patch('alerts/:id')
  async updateAlertStatus(
    @Param('id') alertId: string,
    @Body() updateAlertDto: UpdateAlertDto
  ) {
    return this.healthMetricsService.updateAlertStatus(
      parseInt(alertId, 10),
      updateAlertDto
    );
  }
}
