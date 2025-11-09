/**
 * LOC: HCSECMON001
 * File: /reuse/threat/composites/downstream/healthcare-security-monitoring-dashboards.ts
 *
 * UPSTREAM (imports from):
 *   - ../anomaly-detection-core-composite.ts
 *   - ../behavioral-analytics-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - SOC dashboards
 *   - Security monitoring platforms
 *   - CISO dashboards
 *   - Real-time monitoring displays
 */

import {
  Controller,
  Get,
  Query,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('security-monitoring')
@Controller('api/v1/security-monitoring')
@ApiBearerAuth()
export class SecurityMonitoringController {
  private readonly logger = new Logger(SecurityMonitoringController.name);

  constructor(private readonly service: SecurityMonitoringService) {}

  @Get('dashboard/realtime')
  @ApiOperation({ summary: 'Get real-time security dashboard data' })
  async getRealtimeDashboard(): Promise<any> {
    return this.service.getRealtimeSecurityMetrics();
  }

  @Get('anomalies/current')
  @ApiOperation({ summary: 'Get current security anomalies' })
  @ApiQuery({ name: 'severity', required: false })
  async getCurrentAnomalies(@Query('severity') severity?: string): Promise<any> {
    return this.service.getCurrentAnomalies(severity);
  }

  @Get('behavior/analysis')
  @ApiOperation({ summary: 'Get behavioral analysis summary' })
  async getBehaviorAnalysis(): Promise<any> {
    return this.service.getBehavioralAnalysisSummary();
  }

  @Get('alerts/active')
  @ApiOperation({ summary: 'Get active security alerts' })
  async getActiveAlerts(): Promise<any> {
    return this.service.getActiveSecurityAlerts();
  }
}

@Injectable()
export class SecurityMonitoringService {
  private readonly logger = new Logger(SecurityMonitoringService.name);

  async getRealtimeSecurityMetrics(): Promise<any> {
    return {
      timestamp: new Date(),
      metrics: {
        activeThreats: 5,
        anomaliesDetected: 12,
        incidentsInProgress: 2,
        systemHealth: 98,
        protectedAssets: 1500,
        monitoredEndpoints: 2500,
      },
      trends: {
        lastHour: { threats: '+2', anomalies: '+5' },
        last24Hours: { threats: '+8', anomalies: '+23' },
      },
    };
  }

  async getCurrentAnomalies(severity?: string): Promise<any> {
    return {
      total: 12,
      critical: 2,
      high: 4,
      medium: 6,
      anomalies: [
        { id: '1', type: 'access_pattern', severity: 'high', detectedAt: new Date() },
        { id: '2', type: 'data_volume', severity: 'critical', detectedAt: new Date() },
      ],
    };
  }

  async getBehavioralAnalysisSummary(): Promise<any> {
    return {
      usersAnalyzed: 1500,
      abnormalBehaviors: 23,
      riskScoreDistribution: {
        high: 8,
        medium: 15,
        low: 1477,
      },
      topRiskyUsers: ['user-123', 'user-456'],
    };
  }

  async getActiveSecurityAlerts(): Promise<any> {
    return {
      totalActive: 15,
      byPriority: {
        critical: 2,
        high: 5,
        medium: 8,
      },
      alerts: [
        { id: '1', title: 'Unusual data access', priority: 'critical', age: 15 },
        { id: '2', title: 'Failed login attempts', priority: 'high', age: 30 },
      ],
    };
  }
}

export default { SecurityMonitoringController, SecurityMonitoringService };
