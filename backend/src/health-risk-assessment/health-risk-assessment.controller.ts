import { Controller, Get, HttpCode, HttpStatus, Param, Query, Version } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from '@/common/base';
import { HealthRiskAssessmentService } from './health-risk-assessment.service';
import { HealthRiskScoreDto, HighRiskQueryDto, HighRiskStudentDto } from './dto';

/**
 * Health Risk Assessment Controller
 *
 * Provides endpoints for calculating and retrieving student health risk assessments.
 * Risk scores are calculated based on allergies, chronic conditions, medications,
 * and recent incident history.
 */
@ApiTags('Health Risk Assessments')
@ApiBearerAuth()

@Controller('health-risk-assessments')
export class HealthRiskAssessmentController extends BaseController {
  constructor(private readonly healthRiskAssessmentService: HealthRiskAssessmentService) {
    super();
  }

  /**
   * Calculate comprehensive health risk score for a specific student
   *
   * @param studentId - UUID of the student
   * @returns Health risk score with factors, level, and recommendations
   */
  @Get(':studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calculate health risk score for a student',
    description:
      'Calculates a comprehensive health risk assessment score (0-100) based on ' +
      'allergies, chronic conditions, medications, and recent incident history. ' +
      'Returns risk factors, overall score, risk level, and recommendations.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'UUID of the student to assess',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Health risk assessment calculated successfully',
    type: HealthRiskScoreDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during risk calculation',
  })
  async calculateRiskScore(@Param('studentId') studentId: string): Promise<HealthRiskScoreDto> {
    this.logInfo(`Calculating risk score for student: ${studentId}`);
    return this.healthRiskAssessmentService.calculateRiskScore(studentId);
  }

  /**
   * Get list of high-risk students
   *
   * @param query - Optional minimum score threshold (default: 50)
   * @returns Array of high-risk students with their assessments
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get high-risk students',
    description:
      'Retrieves a list of active students whose health risk score meets or exceeds ' +
      'the specified minimum threshold. Results are sorted by risk score (highest first).',
  })
  @ApiQuery({
    name: 'minScore',
    description:
      'Minimum risk score threshold (0-100). Default is 50 (high risk).',
    required: false,
    type: Number,
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'High-risk students retrieved successfully',
    type: [HighRiskStudentDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during student retrieval',
  })
  async getHighRiskStudents(@Query() query: HighRiskQueryDto): Promise<HighRiskStudentDto[]> {
    const minScore = query.minScore ?? 50;
    this.logInfo(`Retrieving high-risk students (minScore: ${minScore})`);
    return this.healthRiskAssessmentService.getHighRiskStudents(minScore);
  }
}
