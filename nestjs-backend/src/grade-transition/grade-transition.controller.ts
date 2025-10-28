import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GradeTransitionService } from './grade-transition.service';
import {
  BulkTransitionDto,
  TransitionStudentDto,
  BulkTransitionResultDto,
} from './dto';
import { Student } from '../student/entities/student.entity';

/**
 * Grade Transition Controller
 * Handles API endpoints for automated grade transitions
 */
@ApiTags('Grade Transition')
@Controller('api/v1/student-management/grade-transitions')
// @UseGuards(JwtAuthGuard) // Uncomment when auth is set up
// @ApiBearerAuth()
export class GradeTransitionController {
  constructor(
    private readonly gradeTransitionService: GradeTransitionService,
  ) {}

  /**
   * Perform bulk grade transition for end of school year
   * POST /api/v1/student-management/grade-transitions/bulk
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
   * GET /api/v1/student-management/grade-transitions/graduating
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
   * POST /api/v1/student-management/grade-transitions/:studentId
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
        message: { type: 'string', example: 'Student grade transitioned successfully' },
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
