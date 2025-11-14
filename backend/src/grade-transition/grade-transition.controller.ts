import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/services/auth/guards/jwt-auth.guard';
import { GradeTransitionService } from './grade-transition.service';
import { BulkTransitionDto, BulkTransitionResultDto, TransitionStudentDto } from './dto';
import { Student } from '../services/student/entities/student.entity';

import { BaseController } from '@/common/base';
/**
 * Grade Transition Controller
 * Handles API endpoints for automated grade transitions
 */
@ApiTags('Grade Transition')

@Controller('student-management/grade-transitions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GradeTransitionController extends BaseController {
  constructor(
    private readonly gradeTransitionService: GradeTransitionService,
  ) {
    super();}

  /**
   * Perform bulk grade transition for end of school year
   * POST /student-management/grade-transitions/bulk
   */
  @Post('bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Perform bulk grade transition',
    description:
      'Processes grade level transitions for all eligible students. Includes promotion criteria validation, retention decisions, and graduation processing. Can be run in dry-run mode for testing. Requires ADMIN role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk grade transition completed successfully',
    type: BulkTransitionResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or transition criteria not met',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires ADMIN role',
  })
  async performBulkGradeTransition(
    @Body() bulkTransitionDto: BulkTransitionDto,
  ): Promise<BulkTransitionResultDto> {
    const { effectiveDate, dryRun } = bulkTransitionDto;
    return await this.gradeTransitionService.performBulkTransition(
      effectiveDate,
      dryRun ?? true, // Default to true for safety
    );
  }

  /**
   * Get students eligible for graduation
   * GET /student-management/grade-transitions/graduating
   */
  @Get('graduating')
  @ApiOperation({
    summary: 'Get graduating students',
    description:
      'Retrieves all students who are eligible for graduation (12th grade students)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of graduating students retrieved successfully',
    type: [Student],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getGraduatingStudents(): Promise<Student[]> {
    return await this.gradeTransitionService.getGraduatingStudents();
  }

  /**
   * Transition individual student to a new grade
   * POST /student-management/grade-transitions/:studentId
   */
  @Post(':studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Transition individual student',
    description: 'Transitions a specific student to a new grade level',
  })
  @ApiResponse({
    status: 200,
    description: 'Student grade transitioned successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Student grade transitioned successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async transitionStudent(
    @Param('studentId') studentId: string,
    @Body() transitionStudentDto: TransitionStudentDto,
  ): Promise<{ success: boolean; message: string }> {
    const { newGrade, transitionedBy } = transitionStudentDto;
    await this.gradeTransitionService.transitionStudent(
      studentId,
      newGrade,
      transitionedBy,
    );
    return {
      success: true,
      message: 'Student grade transitioned successfully',
    };
  }
}
