/**
 * @fileoverview Student Grade Controller
 * @description HTTP endpoints for student grade transitions
 * @module student/controllers/student-grade.controller
 */

import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth';
import { StudentService } from '../student.service';
import { GradeTransitionDto } from '../dto/grade-transition.dto';
import { GraduationDto } from '../dto/graduation.dto';

import { BaseController } from '@/common/base';
/**
 * Student Grade Controller
 *
 * Handles student grade transition operations:
 * - Grade advancement
 * - Grade retention
 * - Graduation processing
 */
@ApiTags('students')

@Controller('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StudentGradeController extends BaseController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Advance student to next grade
   */
  @Post(':id/advance-grade')
  @ApiOperation({
    summary: 'Advance student to next grade level',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Advances student to the next grade level. Validates academic requirements, updates enrollment records, and triggers necessary notifications. Requires ADMIN or COUNSELOR role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Student advanced to next grade successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or academic requirements not met',
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
  async advanceGrade(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() gradeTransitionDto: GradeTransitionDto,
  ): Promise<any> {
    return await this.studentService.advanceStudentGrade(id, gradeTransitionDto);
  }

  /**
   * Retain student in current grade
   */
  @Post(':id/retain-grade')
  @ApiOperation({
    summary: 'Retain student in current grade level',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Retains student in their current grade level. Documents retention reasons, updates academic records, and creates intervention plans. Requires ADMIN or COUNSELOR role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Student retained in current grade successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid retention reason',
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
  async retainGrade(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() gradeTransitionDto: GradeTransitionDto,
  ): Promise<any> {
    return await this.studentService.retainStudentGrade(id, gradeTransitionDto);
  }

  /**
   * Process student graduation
   */
  @Post(':id/graduate')
  @ApiOperation({
    summary: 'Process student graduation',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Processes student graduation including diploma generation, transcript finalization, and alumni record creation. Requires ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Student graduation processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or graduation requirements not met',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async graduateStudent(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() graduationDto: GraduationDto,
  ): Promise<any> {
    return await this.studentService.processStudentGraduation(id, graduationDto);
  }

  /**
   * Get grade transition history
   */
  @Get(':id/grade-history')
  @ApiOperation({
    summary: 'Get grade transition history for student',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Returns complete grade transition history including advancements, retentions, and graduation records.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Grade transition history retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async getGradeHistory(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<any> {
    return await this.studentService.getGradeTransitionHistory(id);
  }
}
