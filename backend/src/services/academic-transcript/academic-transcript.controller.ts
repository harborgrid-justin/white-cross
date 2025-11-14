/**
 * @fileoverview Academic Transcript Controller
 * @module academic-transcript/academic-transcript.controller
 * @description HTTP endpoints for academic transcript management and SIS integration
 */

import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query, Version } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AcademicTranscriptService } from './academic-transcript.service';
import { TranscriptImportDto } from './dto/transcript-import.dto';
import { AcademicGenerateReportDto } from './dto/generate-report.dto';
import { SyncSISDto } from './dto/sync-sis.dto';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

import { BaseController } from '@/common/base';
/**
 * Academic Transcript Controller
 *
 * Handles all HTTP endpoints for academic transcript management:
 * - Transcript import from SIS
 * - Academic history retrieval
 * - Transcript report generation
 * - SIS synchronization
 * - Performance analytics
 */
@ApiTags('Academic Transcripts')

@Version('1')
@Controller('academic-transcripts')
// @ApiBearerAuth() // Uncomment when authentication is implemented
export class AcademicTranscriptController extends BaseController {
  constructor(
    private readonly academicTranscriptService: AcademicTranscriptService,
  ) {}

  // ==================== Transcript Management ====================

  /**
   * Import academic transcript data
   */
  @Post('import')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Import academic transcript',
    description:
      'Imports academic transcript data from SIS including subjects, grades, attendance, and behavior records.',
  })
  @ApiResponse({
    status: 201,
    description: 'Transcript imported successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'student-uuid_2024-2025_Fall' },
        studentId: { type: 'string', format: 'uuid' },
        academicYear: { type: 'string', example: '2024-2025' },
        semester: { type: 'string', example: 'Fall' },
        gpa: { type: 'number', example: 3.75 },
        subjects: { type: 'array' },
        attendance: { type: 'object' },
        behavior: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data (validation errors)',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async importTranscript(@Body() importDto: TranscriptImportDto) {
    return this.academicTranscriptService.importTranscript(importDto);
  }

  /**
   * Get student's academic history
   */
  @Get(':studentId/history')
  @ApiOperation({
    summary: 'Get academic history',
    description:
      'Retrieves complete academic history for a student across all academic years and semesters.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Academic history retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          studentId: { type: 'string' },
          academicYear: { type: 'string' },
          semester: { type: 'string' },
          gpa: { type: 'number' },
          subjects: { type: 'array' },
          attendance: { type: 'object' },
          behavior: { type: 'object' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getAcademicHistory(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ) {
    return this.academicTranscriptService.getAcademicHistory(studentId);
  }

  /**
   * Get student transcript (current academic year)
   */
  @Get(':studentId')
  @ApiOperation({
    summary: 'Get student transcript',
    description:
      'Retrieves the academic transcript for a student for the current academic year.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'academicYear',
    description: 'Academic year (e.g., 2024-2025)',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'semester',
    description: 'Semester (Fall, Spring, Summer)',
    required: false,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Transcript retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Student or transcript not found',
  })
  async getTranscript(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
    @Query('academicYear') academicYear?: string,
    @Query('semester') semester?: string,
  ) {
    const history =
      await this.academicTranscriptService.getAcademicHistory(studentId);
    // Filter by academicYear and semester if provided
    if (academicYear || semester) {
      return history.filter(
        (record) =>
          (!academicYear || record.academicYear === academicYear) &&
          (!semester || record.semester === semester),
      );
    }
    return history;
  }

  // ==================== Report Generation ====================

  /**
   * Generate transcript report
   */
  @Post(':studentId/report')
  @ApiOperation({
    summary: 'Generate transcript report',
    description:
      'Generates a formatted transcript report in PDF, HTML, or JSON format.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Report generated successfully',
    schema: {
      type: 'object',
      properties: {
        student: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            studentNumber: { type: 'string' },
            grade: { type: 'string' },
          },
        },
        academicRecords: { type: 'array' },
        generatedAt: { type: 'string', format: 'date-time' },
        format: { type: 'string', enum: ['pdf', 'html', 'json'] },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async generateReport(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
    @Body() reportDto: AcademicGenerateReportDto,
  ) {
    const format = reportDto.format || 'json';
    return this.academicTranscriptService.generateTranscriptReport(
      studentId,
      format,
    );
  }

  // ==================== SIS Integration ====================

  /**
   * Sync with external SIS
   */
  @Post(':studentId/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sync with SIS',
    description:
      'Synchronizes student transcript data with external Student Information System (SIS).',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Sync completed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        syncedAt: { type: 'string', format: 'date-time' },
        recordsImported: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or SIS endpoint',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 500,
    description: 'SIS integration error',
  })
  async syncWithSIS(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
    @Body() syncDto: SyncSISDto,
  ) {
    const success = await this.academicTranscriptService.syncWithSIS(
      studentId,
      syncDto.sisApiEndpoint,
    );
    return {
      success,
      syncedAt: new Date().toISOString(),
      recordsImported: success ? 1 : 0,
    };
  }

  // ==================== Analytics ====================

  /**
   * Analyze performance trends
   */
  @Get(':studentId/analytics')
  @ApiOperation({
    summary: 'Get performance analytics',
    description:
      'Analyzes academic performance trends including GPA progression, attendance patterns, and recommendations.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'includeTrends',
    description: 'Include trend analysis',
    required: false,
    type: 'boolean',
  })
  @ApiQuery({
    name: 'includeRecommendations',
    description: 'Include recommendations',
    required: false,
    type: 'boolean',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        gpa: {
          type: 'object',
          properties: {
            current: { type: 'number' },
            average: { type: 'number' },
            trend: {
              type: 'string',
              enum: ['improving', 'declining', 'stable'],
            },
          },
        },
        attendance: {
          type: 'object',
          properties: {
            current: { type: 'number' },
            average: { type: 'number' },
            trend: {
              type: 'string',
              enum: ['improving', 'declining', 'stable'],
            },
          },
        },
        recommendations: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found or insufficient data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getPerformanceAnalytics(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
    @Query() queryDto: AnalyticsQueryDto,
  ) {
    return this.academicTranscriptService.analyzePerformanceTrends(studentId);
  }

  /**
   * Calculate current GPA
   */
  @Get(':studentId/gpa')
  @ApiOperation({
    summary: 'Calculate student GPA',
    description:
      'Calculates the current GPA for a student for the specified academic period.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'academicYear',
    description: 'Academic year to calculate GPA for',
    required: false,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'GPA calculated successfully',
    schema: {
      type: 'object',
      properties: {
        studentId: { type: 'string' },
        gpa: { type: 'number', example: 3.75 },
        academicYear: { type: 'string', example: '2024-2025' },
        calculatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found or no academic records',
  })
  async calculateGPA(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
    @Query('academicYear') academicYear?: string,
  ) {
    const history =
      await this.academicTranscriptService.getAcademicHistory(studentId);

    // Filter by academic year if provided
    const records = academicYear
      ? history.filter((record) => record.academicYear === academicYear)
      : history;

    if (records.length === 0) {
      return {
        studentId,
        gpa: 0,
        academicYear: academicYear || 'all',
        calculatedAt: new Date().toISOString(),
        message: 'No academic records found',
      };
    }

    // Calculate cumulative GPA
    const totalGPA = records.reduce((sum, record) => sum + record.gpa, 0);
    const gpa = totalGPA / records.length;

    return {
      studentId,
      gpa: Math.round(gpa * 100) / 100,
      academicYear: academicYear || 'cumulative',
      calculatedAt: new Date().toISOString(),
      recordCount: records.length,
    };
  }
}
