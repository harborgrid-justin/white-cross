/**
 * LOC: EDU-DOWN-APPLICATION-CTRL-009
 * File: /reuse/education/composites/downstream/application-processing-controller.ts
 *
 * Purpose: Application Processing REST Controller - Production-grade HTTP endpoints
 * Handles student applications, admissions processing, and application management
 *
 * Upstream: ApplicationProcessingService, AdmissionsManagementComposite
 * Downstream: REST API clients, Application systems, Admissions portals
 * Dependencies: NestJS 10.x, Swagger/OpenAPI, class-validator
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  ParseIntPipe,
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
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ApplicationProcessingService } from './application-processing-service';

// Guard and Interceptor imports
// import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
// import { RolesGuard } from '@/common/guards/roles.guard';
// import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
// import { Roles } from '@/common/decorators/roles.decorator';

/**
 * Application Processing Controller
 * Provides REST API endpoints for application operations
 */
@ApiTags('Application Processing')
@Controller('api/v1/applications')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(LoggingInterceptor)
export class ApplicationProcessingController {
  private readonly logger = new Logger(ApplicationProcessingController.name);

  constructor(private readonly applicationService: ApplicationProcessingService) {}

  /**
   * Get all applications
   */
  @Get()
  @ApiOperation({
    summary: 'Get all applications',
    description: 'Retrieve paginated list of applications',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'programId', required: false, type: String })
  @ApiOkResponse({
    description: 'Applications retrieved successfully',
  })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @Query('status') status?: string,
    @Query('programId') programId?: string,
  ) {
    return this.applicationService.findAll({
      page,
      limit,
      status,
      programId,
    });
  }

  /**
   * Get application by ID
   */
  @Get(':applicationId')
  @ApiOperation({
    summary: 'Get application by ID',
    description: 'Retrieve a specific application',
  })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiOkResponse({ description: 'Application found' })
  @ApiNotFoundResponse({ description: 'Application not found' })
  async findOne(@Param('applicationId', ParseUUIDPipe) applicationId: string) {
    return this.applicationService.findOne(applicationId);
  }

  /**
   * Create application
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create application',
    description: 'Create a new student application',
  })
  @ApiBody({
    description: 'Application data',
    schema: {
      properties: {
        applicantName: { type: 'string' },
        email: { type: 'string' },
        programId: { type: 'string' },
        degreeLevel: { type: 'string' },
        gpa: { type: 'number' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Application created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid application data' })
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createApplicationDto: any,
  ) {
    this.logger.log(`Creating application for: ${createApplicationDto.applicantName}`);
    return this.applicationService.create(createApplicationDto);
  }

  /**
   * Update application
   */
  @Put(':applicationId')
  @ApiOperation({
    summary: 'Update application',
    description: 'Update an existing application',
  })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiOkResponse({ description: 'Application updated successfully' })
  async update(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateApplicationDto: any,
  ) {
    this.logger.log(`Updating application: ${applicationId}`);
    return this.applicationService.update(applicationId, updateApplicationDto);
  }

  /**
   * Delete application
   */
  @Delete(':applicationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete application',
    description: 'Delete an application',
  })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiOkResponse({ description: 'Application deleted successfully' })
  async delete(@Param('applicationId', ParseUUIDPipe) applicationId: string) {
    this.logger.log(`Deleting application: ${applicationId}`);
    return this.applicationService.delete(applicationId);
  }

  /**
   * Submit application
   */
  @Post(':applicationId/submit')
  @ApiOperation({
    summary: 'Submit application',
    description: 'Submit completed application for review',
  })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiOkResponse({ description: 'Application submitted successfully' })
  async submit(@Param('applicationId', ParseUUIDPipe) applicationId: string) {
    return this.applicationService.submit(applicationId);
  }

  /**
   * Review application
   */
  @Post(':applicationId/review')
  @ApiOperation({
    summary: 'Review application',
    description: 'Review and evaluate application',
  })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiOkResponse({ description: 'Review recorded successfully' })
  async review(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Body() reviewData: any,
  ) {
    return this.applicationService.review(applicationId, reviewData);
  }

  /**
   * Assign reviewer
   */
  @Patch(':applicationId/assign-reviewer')
  @ApiOperation({
    summary: 'Assign reviewer',
    description: 'Assign reviewer to application',
  })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiOkResponse({ description: 'Reviewer assigned successfully' })
  async assignReviewer(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Body() assignmentData: any,
  ) {
    return this.applicationService.assignReviewer(applicationId, assignmentData);
  }

  /**
   * Get application status
   */
  @Get(':applicationId/status')
  @ApiOperation({
    summary: 'Get application status',
    description: 'Retrieve current status of application',
  })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiOkResponse({ description: 'Status retrieved successfully' })
  async getStatus(@Param('applicationId', ParseUUIDPipe) applicationId: string) {
    return this.applicationService.getStatus(applicationId);
  }

  /**
   * Get missing documents
   */
  @Get(':applicationId/missing-documents')
  @ApiOperation({
    summary: 'Get missing documents',
    description: 'Retrieve list of missing required documents',
  })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiOkResponse({ description: 'Missing documents retrieved' })
  async getMissingDocuments(@Param('applicationId', ParseUUIDPipe) applicationId: string) {
    return this.applicationService.getMissingDocuments(applicationId);
  }

  /**
   * Upload supporting document
   */
  @Post(':applicationId/documents')
  @ApiOperation({
    summary: 'Upload document',
    description: 'Upload supporting document for application',
  })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiOkResponse({ description: 'Document uploaded successfully' })
  async uploadDocument(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Body() documentData: any,
  ) {
    return this.applicationService.uploadDocument(applicationId, documentData);
  }

  /**
   * Make admission decision
   */
  @Post(':applicationId/decision')
  @ApiOperation({
    summary: 'Make decision',
    description: 'Record admission decision on application',
  })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiOkResponse({ description: 'Decision recorded successfully' })
  async makeDecision(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Body() decisionData: any,
  ) {
    return this.applicationService.makeDecision(applicationId, decisionData);
  }

  /**
   * Send decision letter
   */
  @Post(':applicationId/send-decision')
  @ApiOperation({
    summary: 'Send decision letter',
    description: 'Send decision notification to applicant',
  })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiOkResponse({ description: 'Decision sent successfully' })
  async sendDecision(@Param('applicationId', ParseUUIDPipe) applicationId: string) {
    return this.applicationService.sendDecision(applicationId);
  }

  /**
   * Get applicant timeline
   */
  @Get(':applicationId/timeline')
  @ApiOperation({
    summary: 'Get timeline',
    description: 'Retrieve application timeline and milestones',
  })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiOkResponse({ description: 'Timeline retrieved' })
  async getTimeline(@Param('applicationId', ParseUUIDPipe) applicationId: string) {
    return this.applicationService.getTimeline(applicationId);
  }

  /**
   * Generate comparison report
   */
  @Get('batch/comparison')
  @ApiOperation({
    summary: 'Get comparison report',
    description: 'Generate batch application comparison report',
  })
  @ApiQuery({ name: 'programId', required: false })
  @ApiQuery({ name: 'term', required: false })
  @ApiOkResponse({ description: 'Report generated' })
  async getComparisonReport(
    @Query('programId') programId?: string,
    @Query('term') term?: string,
  ) {
    return this.applicationService.getComparisonReport({ programId, term });
  }

  /**
   * Export applications
   */
  @Get('export/:format')
  @ApiOperation({
    summary: 'Export applications',
    description: 'Export application data',
  })
  @ApiParam({ name: 'format', enum: ['csv', 'xlsx', 'pdf'] })
  @ApiQuery({ name: 'status', required: false })
  @ApiOkResponse({ description: 'Export generated successfully' })
  async export(
    @Param('format') format: 'csv' | 'xlsx' | 'pdf',
    @Query('status') status?: string,
  ) {
    this.logger.log(`Exporting applications in ${format} format`);
    return this.applicationService.export(format, status);
  }

  /**
   * Get application statistics
   */
  @Get('analytics/statistics')
  @ApiOperation({
    summary: 'Get statistics',
    description: 'Retrieve application statistics',
  })
  @ApiQuery({ name: 'term', required: false })
  @ApiOkResponse({ description: 'Statistics retrieved' })
  async getStatistics(@Query('term') term?: string) {
    return this.applicationService.getStatistics({ term });
  }

  /**
   * Bulk update applications
   */
  @Patch('batch/update')
  @ApiOperation({
    summary: 'Bulk update',
    description: 'Update multiple applications',
  })
  @ApiOkResponse({ description: 'Applications updated' })
  async bulkUpdate(@Body() bulkUpdateData: any) {
    return this.applicationService.bulkUpdate(bulkUpdateData);
  }
}
