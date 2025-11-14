/**
 * @fileoverview Student Query Controller
 * @description HTTP endpoints for student search and filtering operations
 * @module student/controllers/student-query.controller
 */

import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards, Version } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '@/services/auth';
import { StudentService } from '../student.service';

import { BaseController } from '@/common/base';
/**
 * Student Query Controller
 *
 * Handles student query operations:
 * - Search students by text
 * - Filter by grade, nurse, status
 * - Get assigned students for nurses
 * - List all grades
 */
@ApiTags('students')

@Controller('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StudentQueryController extends BaseController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Search students
   */
  @Get('search/query')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiOperation({
    summary: 'Search students',
    description: 'Full-text search across firstName, lastName, and studentNumber fields.',
  })
  @ApiQuery({
    name: 'q',
    description: 'Search query string',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of results',
    required: false,
    type: 'number',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Search results',
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/Student' },
    },
  })
  async search(@Query('q') query: string, @Query('limit') limit?: number) {
    return this.studentService.search(query, limit);
  }

  /**
   * Get all grades
   */
  @Get('grades/list')
  @ApiOperation({
    summary: 'Get all grades',
    description: 'Retrieves list of all unique grade levels currently in use by active students.',
  })
  @ApiResponse({
    status: 200,
    description: 'Grades retrieved successfully',
    schema: {
      type: 'array',
      items: { type: 'string' },
      example: ['K', '1', '2', '3', '4', '5'],
    },
  })
  async getAllGrades() {
    return this.studentService.findAllGrades();
  }

  /**
   * Get students by grade
   */
  @Get('grade/:grade')
  @ApiOperation({
    summary: 'Get students by grade',
    description: 'Retrieves all active students in a specific grade level.',
  })
  @ApiParam({
    name: 'grade',
    description: 'Grade level',
    type: 'string',
    example: '3',
  })
  @ApiResponse({
    status: 200,
    description: 'Students retrieved successfully',
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/Student' },
    },
  })
  async findByGrade(@Param('grade') grade: string) {
    return this.studentService.findByGrade(grade);
  }

  /**
   * Get assigned students for a nurse
   */
  @Get('nurse/:nurseId')
  @ApiOperation({
    summary: 'Get assigned students',
    description: 'Retrieves all active students assigned to a specific nurse.',
  })
  @ApiParam({
    name: 'nurseId',
    description: 'Nurse UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Assigned students retrieved successfully',
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/Student' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  async findAssignedStudents(
    @Param('nurseId', new ParseUUIDPipe({ version: '4' })) nurseId: string,
  ) {
    return this.studentService.findAssignedStudents(nurseId);
  }
}
