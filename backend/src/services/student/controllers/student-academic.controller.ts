/**
 * @fileoverview Student Academic Controller
 * @description HTTP endpoints for student academic records
 * @module student/controllers/student-academic.controller
 */

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/services/auth';
import { StudentService } from '../student.service';
import { AcademicHistoryDto } from '../dto/academic-history.dto';
import { ImportTranscriptDto } from '../dto/import-transcript.dto';
import { PerformanceTrendsDto } from '../dto/performance-trends.dto';

import { BaseController } from '@/common/base';
/**
 * Student Academic Controller
 *
 * Handles student academic records operations:
 * - Import academic transcripts
 * - Get academic history
 * - Analyze performance trends
 */
@ApiTags('students')
@Controller('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StudentAcademicController extends BaseController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Import academic transcript
   */
  @Post(':id/transcript')
  @ApiOperation({
    summary: 'Import academic transcript for student',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Imports academic transcript data including grades, courses, GPA, and attendance records. Validates transcript format and calculates academic metrics. Requires ADMIN or COUNSELOR role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Academic transcript imported successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid transcript format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires ADMIN or COUNSELOR role',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async importTranscript(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() importTranscriptDto: ImportTranscriptDto,
  ): Promise<any> {
    return this.studentService.importAcademicTranscript(id, importTranscriptDto);
  }

  /**
   * Get academic history
   */
  @Get(':id/academic-history')
  @ApiOperation({
    summary: 'Get complete academic history for student',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Returns comprehensive academic history including all transcripts, grades, courses, and academic achievements. Used for academic planning and college applications.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Academic history retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async getAcademicHistory(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() query: AcademicHistoryDto,
  ): Promise<any> {
    return this.studentService.getAcademicHistory(id, query);
  }

  /**
   * Get performance trends
   */
  @Get(':id/performance-trends')
  @ApiOperation({
    summary: 'Analyze academic performance trends for student',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Analyzes academic performance over time including GPA trends, subject performance patterns, and attendance correlation. Provides insights for intervention planning.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Performance trends analyzed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found or insufficient data',
  })
  async getPerformanceTrends(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() query: PerformanceTrendsDto,
  ): Promise<any> {
    return this.studentService.getPerformanceTrends(id, query);
  }
}
