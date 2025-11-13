/**
 * @fileoverview Student Analytics Controller
 * @description HTTP endpoints for student statistics and export operations
 * @module student/controllers/student-analytics.controller
 */

import { Controller, Get, Param, ParseUUIDPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '@/auth';
import { HealthRecordAuditInterceptor } from '@/health-record/interceptors';
import { StudentService } from '../student.service';
import type { StudentDataExport, StudentStatistics } from '../types';

import { BaseController } from '../../../common/base';
/**
 * Student Analytics Controller
 *
 * Handles student analytics and export operations:
 * - Student statistics and metrics
 * - Data export functionality
 */
@ApiTags('students')
@Controller('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StudentAnalyticsController extends BaseController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Get student statistics
   */
  @Get(':id/statistics')
  @ApiOperation({
    summary: 'Get student statistics',
    description:
      'Retrieves aggregated statistics for a student (health records, allergies, medications, etc.).',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        healthRecords: { type: 'number', example: 25 },
        allergies: { type: 'number', example: 2 },
        medications: { type: 'number', example: 1 },
        appointments: { type: 'number', example: 8 },
        incidents: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async getStatistics(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<StudentStatistics> {
    return this.studentService.getStatistics(id);
  }

  /**
   * Export student data
   */
  @Get(':id/export')
  @UseInterceptors(HealthRecordAuditInterceptor)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Export student data',
    description:
      'Generates comprehensive data export for a student including full profile and statistics.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Data exported successfully',
    schema: {
      type: 'object',
      properties: {
        exportDate: { type: 'string', format: 'date-time' },
        student: { $ref: '#/components/schemas/Student' },
        statistics: {
          type: 'object',
          properties: {
            healthRecords: { type: 'number' },
            allergies: { type: 'number' },
            medications: { type: 'number' },
            appointments: { type: 'number' },
            incidents: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async exportData(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<StudentDataExport> {
    return this.studentService.exportData(id);
  }
}
