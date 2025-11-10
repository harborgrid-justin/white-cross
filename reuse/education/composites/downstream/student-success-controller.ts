/**
 * LOC: EDU-DOWN-STUDENT-SUCCESS-CTRL
 * File: student-success-controller.ts
 * Purpose: Student Success REST Controller - Production-grade HTTP endpoints
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
  Logger,
  Query,
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
  StudentSuccessService,
  SuccessIndicator,
  EarlyAlert,
  StudentSuccessPlan,
} from './student-success-service';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';

@ApiTags('student-success')
@ApiBearerAuth()
@Controller('student-success')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentSuccessController {
  private readonly logger = new Logger(StudentSuccessController.name);

  constructor(private readonly studentSuccessService: StudentSuccessService) {}

  @Get('indicators/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get success indicators for student' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Success indicators retrieved', type: [SuccessIndicator] })
  @ApiNotFoundResponse({ description: 'Student not found' })
  async getSuccessIndicators(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<SuccessIndicator[]> {
    return this.studentSuccessService.getSuccessIndicators(studentId);
  }

  @Post('alerts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create early alert for student' })
  @ApiBody({
    type: EarlyAlert,
    description: 'Early alert details'
  })
  @ApiCreatedResponse({ description: 'Alert created', type: EarlyAlert })
  @ApiBadRequestResponse({ description: 'Invalid alert data' })
  async createEarlyAlert(
    @Body(ValidationPipe) alert: EarlyAlert
  ): Promise<EarlyAlert> {
    return this.studentSuccessService.createEarlyAlert(alert);
  }

  @Get('alerts/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get alerts for student' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Alerts retrieved', type: [EarlyAlert] })
  @ApiNotFoundResponse({ description: 'Student not found' })
  async getStudentAlerts(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<EarlyAlert[]> {
    return this.studentSuccessService.getStudentAlerts(studentId);
  }

  @Put('alerts/:alertId/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve early alert' })
  @ApiParam({ name: 'alertId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        resolutionNotes: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Alert resolved' })
  async resolveAlert(
    @Param('alertId', ParseUUIDPipe) alertId: string,
    @Body('resolutionNotes') resolutionNotes: string
  ): Promise<EarlyAlert> {
    return this.studentSuccessService.resolveAlert(alertId, resolutionNotes);
  }

  @Post('plans')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create student success plan' })
  @ApiBody({
    type: StudentSuccessPlan,
    description: 'Success plan details'
  })
  @ApiCreatedResponse({ description: 'Plan created', type: StudentSuccessPlan })
  @ApiBadRequestResponse({ description: 'Invalid plan data' })
  async createSuccessPlan(
    @Body(ValidationPipe) plan: StudentSuccessPlan
  ): Promise<StudentSuccessPlan> {
    return this.studentSuccessService.createSuccessPlan(plan);
  }

  @Get('plans/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get success plan for student' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Plan retrieved' })
  @ApiNotFoundResponse({ description: 'Plan not found' })
  async getStudentSuccessPlan(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<StudentSuccessPlan | null> {
    return this.studentSuccessService.getStudentSuccessPlan(studentId);
  }

  @Put('plans/:planId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update student success plan' })
  @ApiParam({ name: 'planId', type: 'string' })
  @ApiBody({
    type: StudentSuccessPlan,
    description: 'Updated plan details'
  })
  @ApiResponse({ status: 200, description: 'Plan updated' })
  async updateSuccessPlan(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Body() updates: Partial<StudentSuccessPlan>
  ): Promise<StudentSuccessPlan> {
    return this.studentSuccessService.updateSuccessPlan(planId, updates);
  }

  @Get('at-risk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of at-risk students' })
  @ApiResponse({ status: 200, description: 'At-risk students retrieved', type: [String] })
  async getAtRiskStudents(): Promise<string[]> {
    return this.studentSuccessService.getAtRiskStudents();
  }

  @Put('indicators/:studentId/:indicatorType')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update student success indicator' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiParam({ name: 'indicatorType', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['at_risk', 'on_track', 'exceeding', 'needs_support'] }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Indicator updated' })
  async updateSuccessIndicator(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('indicatorType') indicatorType: string,
    @Body('status') status: string
  ): Promise<SuccessIndicator> {
    return this.studentSuccessService.updateSuccessIndicator(studentId, indicatorType, status);
  }

  @Get('report')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate student success report' })
  @ApiQuery({ name: 'startDate', type: 'string', description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', type: 'string', description: 'End date (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Report generated' })
  async generateSuccessReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<Record<string, any>> {
    return this.studentSuccessService.generateSuccessReport(
      new Date(startDate),
      new Date(endDate)
    );
  }
}
