/**
 * LOC: EDU-DOWN-OUTCOMES-ASSESSMENT-CTRL
 * File: outcomes-assessment-controller.ts
 * Purpose: Outcomes Assessment REST Controller - Production-grade HTTP endpoints
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  OutcomesAssessmentService,
  LearningOutcome,
  AssessmentResult,
  OutcomesReport,
} from './outcomes-assessment-service';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';

@ApiTags('outcomes-assessment')
@ApiBearerAuth()
@Controller('outcomes-assessment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OutcomesAssessmentController {
  private readonly logger = new Logger(OutcomesAssessmentController.name);

  constructor(private readonly outcomesAssessmentService: OutcomesAssessmentService) {}

  @Post('outcomes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create learning outcome' })
  @ApiBody({
    type: LearningOutcome,
    description: 'Learning outcome details'
  })
  @ApiCreatedResponse({ description: 'Outcome created', type: LearningOutcome })
  @ApiBadRequestResponse({ description: 'Invalid outcome data' })
  async createLearningOutcome(
    @Body(ValidationPipe) outcome: LearningOutcome
  ): Promise<LearningOutcome> {
    return this.outcomesAssessmentService.createLearningOutcome(outcome);
  }

  @Get('outcomes/:programId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get learning outcomes for program' })
  @ApiParam({ name: 'programId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Outcomes retrieved', type: [LearningOutcome] })
  @ApiNotFoundResponse({ description: 'Program not found' })
  async getLearningOutcomes(
    @Param('programId', ParseUUIDPipe) programId: string
  ): Promise<LearningOutcome[]> {
    return this.outcomesAssessmentService.getLearningOutcomes(programId);
  }

  @Post('results')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit assessment result' })
  @ApiBody({
    type: AssessmentResult,
    description: 'Assessment result details'
  })
  @ApiCreatedResponse({ description: 'Result submitted', type: AssessmentResult })
  @ApiBadRequestResponse({ description: 'Invalid result data' })
  async submitAssessmentResult(
    @Body(ValidationPipe) result: AssessmentResult
  ): Promise<AssessmentResult> {
    return this.outcomesAssessmentService.submitAssessmentResult(result);
  }

  @Get('student/:studentId/assessments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get student assessment results' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Assessments retrieved', type: [AssessmentResult] })
  @ApiNotFoundResponse({ description: 'Student not found' })
  async getStudentAssessments(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<AssessmentResult[]> {
    return this.outcomesAssessmentService.getStudentAssessments(studentId);
  }

  @Get('outcomes/:outcomeId/results')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get results for learning outcome' })
  @ApiParam({ name: 'outcomeId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Results retrieved', type: [AssessmentResult] })
  @ApiNotFoundResponse({ description: 'Outcome not found' })
  async getOutcomeResults(
    @Param('outcomeId', ParseUUIDPipe) outcomeId: string
  ): Promise<AssessmentResult[]> {
    return this.outcomesAssessmentService.getOutcomeResults(outcomeId);
  }

  @Post('report')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate outcomes report for program' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        programId: { type: 'string' },
        academicYear: { type: 'string' }
      }
    }
  })
  @ApiCreatedResponse({ description: 'Report generated', type: OutcomesReport })
  async generateOutcomesReport(
    @Body('programId', ParseUUIDPipe) programId: string,
    @Body('academicYear') academicYear: string
  ): Promise<OutcomesReport> {
    return this.outcomesAssessmentService.generateOutcomesReport(programId, academicYear);
  }

  @Put('outcomes/:outcomeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update learning outcome' })
  @ApiParam({ name: 'outcomeId', type: 'string' })
  @ApiBody({
    type: LearningOutcome,
    description: 'Updated outcome details'
  })
  @ApiResponse({ status: 200, description: 'Outcome updated' })
  @ApiBadRequestResponse({ description: 'Invalid outcome data' })
  async updateOutcome(
    @Param('outcomeId', ParseUUIDPipe) outcomeId: string,
    @Body() updates: Partial<LearningOutcome>
  ): Promise<LearningOutcome> {
    return this.outcomesAssessmentService.updateOutcome(outcomeId, updates);
  }

  @Put('results/:resultId/review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Review assessment result' })
  @ApiParam({ name: 'resultId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        feedback: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Result reviewed' })
  async reviewAssessmentResult(
    @Param('resultId', ParseUUIDPipe) resultId: string,
    @Body('feedback') feedback: string
  ): Promise<AssessmentResult> {
    return this.outcomesAssessmentService.reviewAssessmentResult(resultId, feedback);
  }

  @Get('outcomes/:outcomeId/metrics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get outcome metrics' })
  @ApiParam({ name: 'outcomeId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved' })
  async getOutcomeMetrics(
    @Param('outcomeId', ParseUUIDPipe) outcomeId: string
  ): Promise<Record<string, any>> {
    return this.outcomesAssessmentService.getOutcomeMetrics(outcomeId);
  }

  @Delete('outcomes/:outcomeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Archive learning outcome' })
  @ApiParam({ name: 'outcomeId', type: 'string' })
  @ApiResponse({ status: 204, description: 'Outcome archived' })
  async archiveOutcome(
    @Param('outcomeId', ParseUUIDPipe) outcomeId: string
  ): Promise<void> {
    return this.outcomesAssessmentService.archiveOutcome(outcomeId);
  }
}
