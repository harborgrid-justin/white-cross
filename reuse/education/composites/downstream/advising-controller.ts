/**
 * LOC: EDU-DOWN-ADVISING-CTRL
 * File: advising-controller.ts
 * Purpose: Advising REST Controller - Production-grade HTTP endpoints
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
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdvisingService, AdvisingSession, DegreePlan, AdvisingNote } from './advising-service';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';

@ApiTags('advising')
@ApiBearerAuth()
@Controller('advising')
@UseGuards(JwtAuthGuard, RolesGuard)
@Injectable()
export class AdvisingController {
  private readonly logger = new Logger(AdvisingController.name);

  constructor(private readonly advisingService: AdvisingService) {}

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Schedule new advising session' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentId: { type: 'string' },
        advisorId: { type: 'string' },
        scheduledDate: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiCreatedResponse({ description: 'Session scheduled', type: AdvisingSession })
  @ApiBadRequestResponse({ description: 'Invalid session data' })
  @ApiOperation({ summary: 'scheduleAdvisingSession', description: 'Execute scheduleAdvisingSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'scheduleAdvisingSession', description: 'Execute scheduleAdvisingSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async scheduleAdvisingSession(
    @Body('studentId', ParseUUIDPipe) studentId: string,
    @Body('advisorId', ParseUUIDPipe) advisorId: string,
    @Body('scheduledDate') scheduledDate: string
  ): Promise<AdvisingSession> {
    return this.advisingService.scheduleAdvisingSession(studentId, advisorId, new Date(scheduledDate));
  }

  @Get('sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get advising session details' })
  @ApiParam({ name: 'sessionId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Session retrieved', type: AdvisingSession })
  @ApiNotFoundResponse({ description: 'Session not found' })
  @ApiOperation({ summary: 'getAdvisingSession', description: 'Execute getAdvisingSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getAdvisingSession', description: 'Execute getAdvisingSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getAdvisingSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string
  ): Promise<AdvisingSession> {
    return this.advisingService.getAdvisingSession(sessionId);
  }

  @Put('sessions/:sessionId/notes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update advising session notes' })
  @ApiParam({ name: 'sessionId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        notes: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Notes updated' })
  @ApiOperation({ summary: 'updateAdvisingNotes', description: 'Execute updateAdvisingNotes operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'updateAdvisingNotes', description: 'Execute updateAdvisingNotes operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async updateAdvisingNotes(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body('notes') notes: string
  ): Promise<AdvisingSession> {
    return this.advisingService.updateAdvisingNotes(sessionId, notes);
  }

  @Post('degree-plans/:studentId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate degree plan for student' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        majorId: { type: 'string' }
      }
    }
  })
  @ApiCreatedResponse({ description: 'Degree plan created', type: DegreePlan })
  @ApiOperation({ summary: 'generateDegreePlan', description: 'Execute generateDegreePlan operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'generateDegreePlan', description: 'Execute generateDegreePlan operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async generateDegreePlan(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body('majorId', ParseUUIDPipe) majorId: string
  ): Promise<DegreePlan> {
    return this.advisingService.generateDegreePlan(studentId, majorId);
  }

  @Get('degree-plans/:studentId/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate student degree plan' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Plan validation result' })
  @ApiOperation({ summary: 'validateDegreePlan', description: 'Execute validateDegreePlan operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'validateDegreePlan', description: 'Execute validateDegreePlan operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async validateDegreePlan(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<{ valid: boolean; errors: string[] }> {
    return this.advisingService.validateDegreePlan(studentId);
  }

  @Get('progress/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get student progress towards degree' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Student progress retrieved' })
  @ApiOperation({ summary: 'getStudentProgress', description: 'Execute getStudentProgress operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getStudentProgress', description: 'Execute getStudentProgress operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getStudentProgress(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<Record<string, any>> {
    return this.advisingService.getStudentProgress(studentId);
  }

  @Post('notes/:studentId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add advising note for student' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' }
      }
    }
  })
  @ApiCreatedResponse({ description: 'Note added', type: AdvisingNote })
  @ApiOperation({ summary: 'addAdvisingNote', description: 'Execute addAdvisingNote operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'addAdvisingNote', description: 'Execute addAdvisingNote operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async addAdvisingNote(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body('content') content: string
  ): Promise<AdvisingNote> {
    return this.advisingService.addAdvisingNote(studentId, content);
  }

  @Get('notes/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all advising notes for student' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Notes retrieved', type: [AdvisingNote] })
  @ApiOperation({ summary: 'getStudentAdvisingNotes', description: 'Execute getStudentAdvisingNotes operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getStudentAdvisingNotes', description: 'Execute getStudentAdvisingNotes operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getStudentAdvisingNotes(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<AdvisingNote[]> {
    return this.advisingService.getStudentAdvisingNotes(studentId);
  }

  @Get('caseload/:advisorId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get advisor caseload' })
  @ApiParam({ name: 'advisorId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Caseload retrieved', type: [String] })
  @ApiOperation({ summary: 'getAdvisorCaseload', description: 'Execute getAdvisorCaseload operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getAdvisorCaseload', description: 'Execute getAdvisorCaseload operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getAdvisorCaseload(
    @Param('advisorId', ParseUUIDPipe) advisorId: string
  ): Promise<string[]> {
    return this.advisingService.getAdvisorCaseload(advisorId);
  }

  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel advising session' })
  @ApiParam({ name: 'sessionId', type: 'string' })
  @ApiResponse({ status: 204, description: 'Session cancelled' })
  @ApiOperation({ summary: 'cancelAdvisingSession', description: 'Execute cancelAdvisingSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'cancelAdvisingSession', description: 'Execute cancelAdvisingSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async cancelAdvisingSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string
  ): Promise<void> {
    return this.advisingService.cancelAdvisingSession(sessionId);
  }
}
