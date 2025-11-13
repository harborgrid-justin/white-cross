import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsDashboardService } from '../analytics-dashboard.service';
import { DashboardMetricResponseDto } from '../dto';

import { BaseController } from '@/common/base';
@ApiTags('Analytics Dashboard')
@Controller('enterprise-features/analytics')
@ApiBearerAuth()
export class AnalyticsController extends BaseController {
  constructor(private readonly analyticsService: AnalyticsDashboardService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get real-time dashboard metrics' })
  @ApiResponse({
    status: 200,
    description: 'Metrics retrieved',
    type: [DashboardMetricResponseDto],
  })
  getRealtimeMetrics() {
    return this.analyticsService.getRealtimeMetrics();
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get health trends' })
  @ApiResponse({ status: 200, description: 'Trends retrieved' })
  getHealthTrends(@Query('period') period: 'day' | 'week' | 'month') {
    return this.analyticsService.getHealthTrends(period);
  }
}