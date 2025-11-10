/**
 * LOC: EDU-DOWN-GRADING-CTRL
 * File: grading-controller.ts
 * Purpose: Grading REST Controller - Production-grade HTTP endpoints
 */

import {
  Controller,
  Get,
  Post,
  Put,
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
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GradingService, GradeRecord, TranscriptGrade } from './grading-service';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';

@ApiTags('grading')
@ApiBearerAuth()
@Controller('grading')
@UseGuards(JwtAuthGuard, RolesGuard)
@Injectable()
export class GradingController {
  private readonly logger = new Logger(GradingController.name);

  constructor(private readonly gradingService: GradingService) {}

  @Post('grades')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit grade for student' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentId: { type: 'string' },
        courseId: { type: 'string' },
        grade: { type: 'string', enum: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'] },
        instructorId: { type: 'string' }
      }
    }
  })
  @ApiCreatedResponse({ description: 'Grade submitted', type: GradeRecord })
  @ApiBadRequestResponse({ description: 'Invalid grade data' })
  @ApiOperation({ summary: 'submitGrade', description: 'Execute submitGrade operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'submitGrade', description: 'Execute submitGrade operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async submitGrade(
    @Body('studentId', ParseUUIDPipe) studentId: string,
    @Body('courseId', ParseUUIDPipe) courseId: string,
    @Body('grade') grade: string,
    @Body('instructorId', ParseUUIDPipe) instructorId: string
  ): Promise<GradeRecord> {
    return this.gradingService.submitGrade(studentId, courseId, grade, instructorId);
  }

  @Get('student/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all grades for student' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Student grades retrieved', type: [GradeRecord] })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiOperation({ summary: 'getStudentGrades', description: 'Execute getStudentGrades operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getStudentGrades', description: 'Execute getStudentGrades operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getStudentGrades(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<GradeRecord[]> {
    return this.gradingService.getStudentGrades(studentId);
  }

  @Get('course/:courseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all grades for course' })
  @ApiParam({ name: 'courseId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Course grades retrieved', type: [GradeRecord] })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @ApiOperation({ summary: 'getCourseGrades', description: 'Execute getCourseGrades operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getCourseGrades', description: 'Execute getCourseGrades operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getCourseGrades(
    @Param('courseId', ParseUUIDPipe) courseId: string
  ): Promise<GradeRecord[]> {
    return this.gradingService.getCourseGrades(courseId);
  }

  @Put('grades/:gradeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update grade' })
  @ApiParam({ name: 'gradeId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newGrade: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Grade updated' })
  @ApiBadRequestResponse({ description: 'Invalid grade' })
  @ApiOperation({ summary: 'updateGrade', description: 'Execute updateGrade operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'updateGrade', description: 'Execute updateGrade operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async updateGrade(
    @Param('gradeId', ParseUUIDPipe) gradeId: string,
    @Body('newGrade') newGrade: string
  ): Promise<GradeRecord> {
    return this.gradingService.updateGrade(gradeId, newGrade);
  }

  @Get('gpa/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate student GPA' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'GPA calculated', schema: { type: 'object', properties: { gpa: { type: 'number' } } } })
  @ApiOperation({ summary: 'calculateGPA', description: 'Execute calculateGPA operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'calculateGPA', description: 'Execute calculateGPA operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async calculateGPA(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<{ gpa: number }> {
    const gpa = await this.gradingService.calculateGPA(studentId);
    return { gpa };
  }

  @Get('transcript/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get student transcript' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Transcript retrieved', type: [TranscriptGrade] })
  @ApiNotFoundResponse({ description: 'Transcript not found' })
  @ApiOperation({ summary: 'getTranscript', description: 'Execute getTranscript operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getTranscript', description: 'Execute getTranscript operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getTranscript(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<TranscriptGrade[]> {
    return this.gradingService.getTranscript(studentId);
  }

  @Put('grades/:gradeId/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve grade submission' })
  @ApiParam({ name: 'gradeId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Grade approved' })
  @ApiOperation({ summary: 'approveGrade', description: 'Execute approveGrade operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'approveGrade', description: 'Execute approveGrade operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async approveGrade(
    @Param('gradeId', ParseUUIDPipe) gradeId: string
  ): Promise<GradeRecord> {
    return this.gradingService.approveGrade(gradeId);
  }

  @Get('report/:courseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate grade report for course' })
  @ApiParam({ name: 'courseId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Report generated' })
  @ApiOperation({ summary: 'generateGradeReport', description: 'Execute generateGradeReport operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'generateGradeReport', description: 'Execute generateGradeReport operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async generateGradeReport(
    @Param('courseId', ParseUUIDPipe) courseId: string
  ): Promise<Record<string, any>> {
    return this.gradingService.generateGradeReport(courseId);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Bulk submit grades' })
  @ApiBody({
    type: Array,
    description: 'Array of grade records'
  })
  @ApiCreatedResponse({ description: 'Grades submitted' })
  @ApiBadRequestResponse({ description: 'Invalid grade data' })
  @ApiOperation({ summary: 'bulkSubmitGrades', description: 'Execute bulkSubmitGrades operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'bulkSubmitGrades', description: 'Execute bulkSubmitGrades operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async bulkSubmitGrades(
    @Body(ValidationPipe) grades: GradeRecord[]
  ): Promise<GradeRecord[]> {
    return this.gradingService.bulkSubmitGrades(grades);
  }
}
