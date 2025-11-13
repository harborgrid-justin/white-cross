import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthAlert, HealthMetricsService, MetricsOverview } from './health-metrics.service';
import { CreateVitalsDto } from './dto/create-vitals.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { GetMetricsQueryDto } from './dto/get-metrics-query.dto';
import { GetVitalsQueryDto } from './dto/get-vitals-query.dto';
import { GetAlertsQueryDto } from './dto/get-alerts-query.dto';
import { GetTrendsQueryDto } from './dto/get-trends-query.dto';
import { GetDepartmentQueryDto } from './dto/get-department-query.dto';

import { BaseController } from '@/common/base';
@ApiTags('Health Metrics')
@ApiBearerAuth()
@Controller('health-metrics')
@UsePipes(new ValidationPipe({ transform: true }))
export class HealthMetricsController extends BaseController {
  constructor(private readonly healthMetricsService: HealthMetricsService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Get health metrics overview',
    description:
      'Retrieves comprehensive health metrics overview with departmental statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Health metrics overview retrieved successfully',
    type: 'MetricsOverview',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async getMetricsOverview(
    @Query() query: GetMetricsQueryDto,
  ): Promise<MetricsOverview> {
    return this.healthMetricsService.getMetricsOverview(
      query.timeRange,
      query.department,
      query.refresh,
    );
  }

  @Get('vitals/live')
  @ApiOperation({
    summary: 'Get live vital signs monitoring',
    description:
      'Retrieves real-time vital signs data for active monitoring. Used in critical care scenarios where immediate health status visibility is required. Includes filtering for critical patients and department-specific monitoring.',
  })
  @ApiQuery({
    name: 'patientIds',
    required: false,
    type: String,
    description:
      'Comma-separated patient IDs to monitor. If not provided, returns all patients in department. Format: "123,456,789"',
    example: '123,456,789',
  })
  @ApiQuery({
    name: 'department',
    required: false,
    type: String,
    description: 'Filter by department code (ICU, ER, WARD, etc.)',
    example: 'ICU',
  })
  @ApiQuery({
    name: 'critical',
    required: false,
    type: Boolean,
    description:
      'Filter for only critical vital signs requiring immediate attention',
    example: true,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of records to return (default: 50)',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Live vital signs retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          patientId: {
            type: 'number',
            example: 123,
            description: 'Patient identifier',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T09:30:00Z',
          },
          vitals: {
            type: 'object',
            properties: {
              heartRate: {
                type: 'number',
                example: 72,
                description: 'Heart rate in BPM',
              },
              bloodPressure: {
                type: 'object',
                properties: {
                  systolic: { type: 'number', example: 120 },
                  diastolic: { type: 'number', example: 80 },
                },
              },
              temperature: {
                type: 'number',
                example: 98.6,
                description: 'Temperature in Fahrenheit',
              },
              oxygenSaturation: {
                type: 'number',
                example: 98,
                description: 'SpO2 percentage',
              },
              respiratoryRate: {
                type: 'number',
                example: 16,
                description: 'Breaths per minute',
              },
            },
          },
          alertLevel: {
            type: 'string',
            enum: ['normal', 'warning', 'critical'],
            example: 'normal',
          },
          department: { type: 'string', example: 'ICU' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions for patient data access',
  })
  async getLiveVitals(@Query() query: GetVitalsQueryDto): Promise<any[]> {
    return this.healthMetricsService.getLiveVitals(
      query.patientIds,
      query.department,
      query.critical,
      query.limit,
    );
  }

  @Get('patients/:id/trends')
  @ApiOperation({
    summary: 'Get patient health trends analysis',
    description:
      "Retrieves trending data for a specific patient's health metrics over time. Used for medical analysis, treatment effectiveness evaluation, and long-term health monitoring. Supports customizable time ranges and metric granularity.",
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Patient ID for trend analysis',
    example: '123',
  })
  @ApiQuery({
    name: 'metrics',
    required: false,
    type: String,
    description:
      'Comma-separated list of metrics to include in trends (heartRate,bloodPressure,temperature,etc.)',
    example: 'heartRate,bloodPressure,temperature',
  })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    type: String,
    description: 'Time range for trend analysis (1h, 4h, 24h, 7d, 30d)',
    example: '24h',
  })
  @ApiQuery({
    name: 'granularity',
    required: false,
    type: String,
    description: 'Data point granularity (minute, hour, day)',
    example: 'hour',
  })
  @ApiResponse({
    status: 200,
    description: 'Patient health trends retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T09:00:00Z',
          },
          metrics: {
            type: 'object',
            properties: {
              heartRate: {
                type: 'number',
                example: 72,
                description: 'Average heart rate for time period',
              },
              bloodPressure: {
                type: 'object',
                properties: {
                  systolic: { type: 'number', example: 120 },
                  diastolic: { type: 'number', example: 80 },
                },
              },
              temperature: { type: 'number', example: 98.6 },
              trend: {
                type: 'string',
                enum: ['improving', 'stable', 'declining'],
                example: 'stable',
              },
            },
          },
          annotations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', example: 'medication' },
                note: {
                  type: 'string',
                  example: 'Blood pressure medication administered',
                },
                timestamp: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions for patient data access',
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  async getPatientTrends(
    @Param('id') patientId: string,
    @Query() query: GetTrendsQueryDto,
  ): Promise<any[]> {
    return this.healthMetricsService.getPatientTrends(
      parseInt(patientId, 10),
      query.metrics,
      query.timeRange,
      query.granularity,
    );
  }

  @Get('departments/performance')
  @ApiOperation({
    summary: 'Get department performance metrics',
    description:
      'Retrieves comprehensive performance metrics for healthcare departments. Includes patient volume, response times, critical incident rates, and staff efficiency metrics. Used for administrative oversight and quality improvement initiatives.',
  })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    type: String,
    description:
      'Time range for performance analysis (1h, 4h, 24h, 7d, 30d). Defaults to 24h',
    example: '24h',
  })
  @ApiQuery({
    name: 'includeHistorical',
    required: false,
    type: Boolean,
    description: 'Include historical comparison data for trend analysis',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Department performance metrics retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          departmentId: { type: 'string', example: 'ICU' },
          departmentName: { type: 'string', example: 'Intensive Care Unit' },
          metrics: {
            type: 'object',
            properties: {
              patientVolume: {
                type: 'number',
                example: 45,
                description: 'Total patients in timeframe',
              },
              averageStayDuration: {
                type: 'number',
                example: 2.5,
                description: 'Average stay in hours',
              },
              criticalIncidents: {
                type: 'number',
                example: 3,
                description: 'Number of critical incidents',
              },
              responseTime: {
                type: 'object',
                properties: {
                  average: {
                    type: 'number',
                    example: 4.2,
                    description: 'Average response time in minutes',
                  },
                  p95: {
                    type: 'number',
                    example: 8.5,
                    description: '95th percentile response time',
                  },
                },
              },
              staffUtilization: {
                type: 'number',
                example: 85.5,
                description: 'Staff utilization percentage',
              },
            },
          },
          alerts: {
            type: 'object',
            properties: {
              active: {
                type: 'number',
                example: 2,
                description: 'Active alerts count',
              },
              resolved: {
                type: 'number',
                example: 8,
                description: 'Resolved alerts in timeframe',
              },
            },
          },
          comparison: {
            type: 'object',
            properties: {
              previousPeriod: {
                type: 'number',
                example: -5.2,
                description: 'Percentage change from previous period',
              },
              trend: {
                type: 'string',
                enum: ['improving', 'stable', 'declining'],
                example: 'improving',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - insufficient permissions for department metrics access',
  })
  async getDepartmentPerformance(
    @Query() query: GetDepartmentQueryDto,
  ): Promise<any[]> {
    return this.healthMetricsService.getDepartmentPerformance(
      query.timeRange || '24h',
      query.includeHistorical,
    );
  }

  @Post('vitals')
  @ApiOperation({
    summary: 'Record new vital signs',
    description:
      'Records new vital signs measurement for a patient. Includes automatic alert generation for critical values and integration with patient monitoring systems. Supports batch recording for multiple measurements.',
  })
  @ApiBody({
    type: CreateVitalsDto,
    description: 'Vital signs data to record',
    schema: {
      type: 'object',
      required: ['patientId', 'vitals', 'recordedBy'],
      properties: {
        patientId: {
          type: 'number',
          example: 123,
          description: 'Patient identifier',
        },
        vitals: {
          type: 'object',
          properties: {
            heartRate: {
              type: 'number',
              example: 72,
              description: 'Heart rate in BPM',
            },
            bloodPressure: {
              type: 'object',
              properties: {
                systolic: { type: 'number', example: 120 },
                diastolic: { type: 'number', example: 80 },
              },
            },
            temperature: {
              type: 'number',
              example: 98.6,
              description: 'Temperature in Fahrenheit',
            },
            oxygenSaturation: {
              type: 'number',
              example: 98,
              description: 'SpO2 percentage',
            },
            respiratoryRate: {
              type: 'number',
              example: 16,
              description: 'Breaths per minute',
            },
          },
        },
        recordedBy: {
          type: 'string',
          example: 'nurse_123',
          description: 'ID of recording healthcare provider',
        },
        notes: {
          type: 'string',
          example: 'Patient resting, stable condition',
          description: 'Optional notes about the measurement',
        },
        location: {
          type: 'string',
          example: 'ICU-Room-205',
          description: 'Location where vitals were taken',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Vital signs recorded successfully',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: 456,
          description: 'Unique ID of the vital signs record',
        },
        patientId: { type: 'number', example: 123 },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T09:30:00Z',
        },
        vitals: { type: 'object', description: 'Recorded vital signs data' },
        alerts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'high_blood_pressure' },
              severity: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'critical'],
                example: 'medium',
              },
              message: {
                type: 'string',
                example: 'Blood pressure slightly elevated',
              },
            },
          },
        },
        recordedBy: { type: 'string', example: 'nurse_123' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - invalid vital signs data or missing required fields',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions to record vital signs',
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  async recordVitals(@Body() createVitalsDto: CreateVitalsDto): Promise<any> {
    return this.healthMetricsService.recordVitals(createVitalsDto);
  }

  @Get('alerts')
  @ApiOperation({
    summary: 'Get health alerts',
    description:
      'Retrieves active and historical health alerts based on vital signs monitoring. Includes filtering by severity, department, and status. Critical for early warning systems and patient safety monitoring.',
  })
  @ApiQuery({
    name: 'severity',
    required: false,
    type: String,
    description: 'Filter by alert severity level',
    enum: ['low', 'medium', 'high', 'critical'],
    example: 'high',
  })
  @ApiQuery({
    name: 'department',
    required: false,
    type: String,
    description: 'Filter by department code',
    example: 'ICU',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by alert status',
    enum: ['active', 'acknowledged', 'resolved'],
    example: 'active',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of alerts to return',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Health alerts retrieved successfully',
    type: 'HealthAlert',
    isArray: true,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 789,
            description: 'Alert unique identifier',
          },
          patientId: { type: 'number', example: 123 },
          type: {
            type: 'string',
            example: 'vital_signs_critical',
            description: 'Type of health alert',
          },
          severity: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'critical'],
            example: 'high',
          },
          message: {
            type: 'string',
            example: 'Heart rate critically high: 140 BPM',
          },
          department: { type: 'string', example: 'ICU' },
          status: {
            type: 'string',
            enum: ['active', 'acknowledged', 'resolved'],
            example: 'active',
          },
          triggeredBy: {
            type: 'object',
            properties: {
              metric: { type: 'string', example: 'heart_rate' },
              value: { type: 'number', example: 140 },
              threshold: { type: 'number', example: 120 },
            },
          },
          timestamps: {
            type: 'object',
            properties: {
              created: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T09:30:00Z',
              },
              acknowledged: {
                type: 'string',
                format: 'date-time',
                nullable: true,
              },
              resolved: { type: 'string', format: 'date-time', nullable: true },
            },
          },
          assignedTo: {
            type: 'string',
            example: 'nurse_456',
            description: 'Healthcare provider assigned to handle alert',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - insufficient permissions for health alerts access',
  })
  async getHealthAlerts(
    @Query() query: GetAlertsQueryDto,
  ): Promise<HealthAlert[]> {
    return this.healthMetricsService.getHealthAlerts(
      query.severity,
      query.department,
      query.status,
      query.limit,
    );
  }

  @Patch('alerts/:id')
  @ApiOperation({
    summary: 'Update health alert status',
    description:
      'Updates the status of a health alert (acknowledge, resolve, or reassign). Includes audit trail for compliance and enables proper alert lifecycle management in critical care scenarios.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Health alert ID to update',
    example: '789',
  })
  @ApiBody({
    type: UpdateAlertDto,
    description: 'Alert status update data',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['active', 'acknowledged', 'resolved'],
          example: 'acknowledged',
          description: 'New status for the alert',
        },
        assignedTo: {
          type: 'string',
          example: 'nurse_456',
          description: 'Healthcare provider to assign alert to',
        },
        notes: {
          type: 'string',
          example: 'Patient responded well to intervention',
          description: 'Optional notes about the status change',
        },
        resolution: {
          type: 'string',
          example: 'Medication adjusted, vitals stabilized',
          description: 'Resolution details (required when status is resolved)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Alert status updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 789 },
        status: { type: 'string', example: 'acknowledged' },
        updatedBy: { type: 'string', example: 'nurse_456' },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T09:35:00Z',
        },
        auditTrail: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              action: { type: 'string', example: 'status_change' },
              from: { type: 'string', example: 'active' },
              to: { type: 'string', example: 'acknowledged' },
              timestamp: { type: 'string', format: 'date-time' },
              performedBy: { type: 'string', example: 'nurse_456' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - invalid status transition or missing required fields',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions to update alerts',
  })
  @ApiResponse({
    status: 404,
    description: 'Alert not found',
  })
  async updateAlertStatus(
    @Param('id') alertId: string,
    @Body() updateAlertDto: UpdateAlertDto,
  ): Promise<any> {
    return this.healthMetricsService.updateAlertStatus(
      parseInt(alertId, 10),
      updateAlertDto,
    );
  }
}
