import {
import { SchedulingControllersCompositeService } from './scheduling-service';

/**
 * LOC: EDU-DOWN-SCHEDULING-CTRL-001
 * File: /reuse/education/composites/downstream/scheduling-controller.ts
 *
 * Purpose: Scheduling REST Controller - Production-grade HTTP endpoints for course and term scheduling
 */

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
  UseInterceptors,
  ParseUUIDPipe,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Scheduling')
@Controller('scheduling')
@ApiBearerAuth()
@Injectable()
export class SchedulingController {
  constructor(
    private readonly schedulingService: SchedulingControllersCompositeService) {}

  @Post('terms')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create term schedule', description: 'Creates a new academic term schedule' })
  @ApiCreatedResponse({ description: 'Term schedule created successfully' })
  @ApiOperation({ summary: 'createTermSchedule', description: 'Execute createTermSchedule operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async createTermSchedule(@Body(ValidationPipe) scheduleData: any): Promise<any> {
    this.logger.log('Creating term schedule');
    return this.schedulingService.createTermSchedule(scheduleData);
  }

  @Get('terms/:termId')
  @ApiOperation({ summary: 'Get term schedule', description: 'Retrieves schedule for a specific term' })
  @ApiParam({ name: 'termId', description: 'Term identifier' })
  @ApiOkResponse({ description: 'Term schedule retrieved successfully' })
  @ApiOperation({ summary: 'getTermSchedule', description: 'Execute getTermSchedule operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getTermSchedule(@Param('termId') termId: string): Promise<any> {
    this.logger.log(`Retrieving term schedule ${termId}`);
    return this.schedulingService.getTermSchedule(termId);
  }

  @Put('terms/:termId')
  @ApiOperation({ summary: 'Update term schedule', description: 'Updates an existing term schedule' })
  @ApiParam({ name: 'termId', description: 'Term identifier' })
  @ApiOkResponse({ description: 'Term schedule updated successfully' })
  @ApiOperation({ summary: 'updateTermSchedule', description: 'Execute updateTermSchedule operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async updateTermSchedule(
    @Param('termId') termId: string,
    @Body(ValidationPipe) updates: any,
  ): Promise<any> {
    this.logger.log(`Updating term schedule ${termId}`);
    return this.schedulingService.updateTermSchedule(termId, updates);
  }

  @Get('terms')
  @ApiOperation({ summary: 'List term schedules', description: 'Retrieves list of all term schedules' })
  @ApiQuery({ name: 'status', description: 'Filter by status', required: false })
  @ApiOkResponse({ description: 'Term schedules retrieved successfully' })
  @ApiOperation({ summary: 'listTermSchedules', description: 'Execute listTermSchedules operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async listTermSchedules(@Query() filters?: any): Promise<any> {
    this.logger.log('Listing term schedules');
    return this.schedulingService.listTermSchedules(filters);
  }

  @Post('terms/:termId/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate term schedule', description: 'Validates term schedule for conflicts and issues' })
  @ApiParam({ name: 'termId', description: 'Term identifier' })
  @ApiOkResponse({ description: 'Schedule validation complete' })
  @ApiOperation({ summary: 'validateTermSchedule', description: 'Execute validateTermSchedule operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async validateTermSchedule(@Param('termId') termId: string): Promise<any> {
    this.logger.log(`Validating term schedule ${termId}`);
    return this.schedulingService.validateTermSchedule(termId);
  }

  @Post('terms/:termId/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish term schedule', description: 'Publishes term schedule for student registration' })
  @ApiParam({ name: 'termId', description: 'Term identifier' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['publishedBy'],
      properties: { publishedBy: { type: 'string' } },
    },
  })
  @ApiOkResponse({ description: 'Term schedule published successfully' })
  @ApiOperation({ summary: 'publishTermSchedule', description: 'Execute publishTermSchedule operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async publishTermSchedule(
    @Param('termId') termId: string,
    @Body('publishedBy') publishedBy: string,
  ): Promise<any> {
    this.logger.log(`Publishing term schedule ${termId}`);
    return this.schedulingService.publishTermSchedule(termId, publishedBy);
  }

  @Post('terms/:termId/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive term schedule', description: 'Archives a completed term schedule' })
  @ApiParam({ name: 'termId', description: 'Term identifier' })
  @ApiOkResponse({ description: 'Term schedule archived successfully' })
  @ApiOperation({ summary: 'archiveTermSchedule', description: 'Execute archiveTermSchedule operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async archiveTermSchedule(@Param('termId') termId: string): Promise<any> {
    this.logger.log(`Archiving term schedule ${termId}`);
    return this.schedulingService.archiveTermSchedule(termId);
  }

  @Post('terms/:sourceTermId/clone/:targetTermId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Clone term schedule', description: 'Clones schedule from one term to another' })
  @ApiParam({ name: 'sourceTermId', description: 'Source term identifier' })
  @ApiParam({ name: 'targetTermId', description: 'Target term identifier' })
  @ApiCreatedResponse({ description: 'Term schedule cloned successfully' })
  @ApiOperation({ summary: 'cloneTermSchedule', description: 'Execute cloneTermSchedule operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async cloneTermSchedule(
    @Param('sourceTermId') sourceTermId: string,
    @Param('targetTermId') targetTermId: string,
  ): Promise<any> {
    this.logger.log(`Cloning schedule from ${sourceTermId} to ${targetTermId}`);
    return this.schedulingService.cloneTermSchedule(sourceTermId, targetTermId);
  }

  @Get('conflicts')
  @ApiOperation({ summary: 'Get schedule conflicts', description: 'Retrieves all scheduling conflicts' })
  @ApiQuery({ name: 'termId', description: 'Filter by term', required: false })
  @ApiOkResponse({ description: 'Conflicts retrieved successfully' })
  @ApiOperation({ summary: 'getConflicts', description: 'Execute getConflicts operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getConflicts(@Query('termId') termId?: string): Promise<any> {
    this.logger.log('Retrieving schedule conflicts');
    return this.schedulingService.listConflicts(termId);
  }

  @Post('conflicts/:conflictId/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve conflict', description: 'Resolves a scheduling conflict' })
  @ApiParam({ name: 'conflictId', description: 'Conflict identifier' })
  @ApiBody({ description: 'Resolution details' })
  @ApiOkResponse({ description: 'Conflict resolved successfully' })
  @ApiOperation({ summary: 'resolveConflict', description: 'Execute resolveConflict operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async resolveConflict(
    @Param('conflictId', ParseUUIDPipe) conflictId: string,
    @Body(ValidationPipe) resolutionData: any,
  ): Promise<any> {
    this.logger.log(`Resolving conflict ${conflictId}`);
    return this.schedulingService.resolveConflict(conflictId, resolutionData);
  }

  @Get('rooms/availability')
  @ApiOperation({ summary: 'Check room availability', description: 'Checks classroom availability for scheduling' })
  @ApiQuery({ name: 'termId', description: 'Term identifier', required: true })
  @ApiQuery({ name: 'timeSlot', description: 'Time slot to check', required: true })
  @ApiOkResponse({ description: 'Room availability retrieved successfully' })
  @ApiOperation({ summary: 'checkRoomAvailability', description: 'Execute checkRoomAvailability operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async checkRoomAvailability(
    @Query('termId') termId: string,
    @Query('timeSlot') timeSlot: string,
  ): Promise<any> {
    this.logger.log(`Checking room availability for term ${termId}`);
    return this.schedulingService.checkRoomAvailability(termId, timeSlot);
  }

  @Get('faculty/:facultyId/schedule')
  @ApiOperation({ summary: 'Get faculty schedule', description: 'Retrieves teaching schedule for a faculty member' })
  @ApiParam({ name: 'facultyId', description: 'Faculty identifier' })
  @ApiQuery({ name: 'termId', description: 'Term identifier', required: false })
  @ApiOkResponse({ description: 'Faculty schedule retrieved successfully' })
  @ApiOperation({ summary: 'getFacultySchedule', description: 'Execute getFacultySchedule operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getFacultySchedule(
    @Param('facultyId') facultyId: string,
    @Query('termId') termId?: string,
  ): Promise<any> {
    this.logger.log(`Retrieving schedule for faculty ${facultyId}`);
    return this.schedulingService.getFacultySchedule(facultyId, termId);
  }
}
