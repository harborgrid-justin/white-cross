/**
 * LOC: EDU-DOWN-INSTITUTIONAL-RESEARCH-CTRL-006
 * File: /reuse/education/composites/downstream/institutional-research-controller.ts
 *
 * Purpose: Institutional Research REST Controller - Production-grade HTTP endpoints
 * Handles institutional analytics, data analysis, and strategic research
 *
 * Upstream: InstitutionalResearchService, InstitutionalResearchComposite
 * Downstream: REST API clients, Research systems, Analytics dashboards
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
import { InstitutionalResearchService } from './institutional-research-service';

// Guard and Interceptor imports
// import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
// import { RolesGuard } from '@/common/guards/roles.guard';
// import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
// import { Roles } from '@/common/decorators/roles.decorator';

/**
 * Institutional Research Controller
 * Provides REST API endpoints for institutional research and analytics
 */
@ApiTags('Institutional Research')
@Controller('api/v1/institutional-research')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(LoggingInterceptor)
export class InstitutionalResearchController {
  private readonly logger = new Logger(InstitutionalResearchController.name);

  constructor(private readonly researchService: InstitutionalResearchService) {}

  /**
   * Get all research projects
   */
  @Get('projects')
  @ApiOperation({
    summary: 'Get research projects',
    description: 'Retrieve paginated list of research projects',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiOkResponse({
    description: 'Research projects retrieved successfully',
  })
  async findProjects(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @Query('status') status?: string,
  ) {
    return this.researchService.findProjects({
      page,
      limit,
      status,
    });
  }

  /**
   * Get research project by ID
   */
  @Get('projects/:projectId')
  @ApiOperation({
    summary: 'Get research project',
    description: 'Retrieve a specific research project',
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiOkResponse({ description: 'Project found' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async findProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.researchService.findProject(projectId);
  }

  /**
   * Create research project
   */
  @Post('projects')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create research project',
    description: 'Create a new institutional research project',
  })
  @ApiBody({
    description: 'Research project data',
    schema: {
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        principal_investigator: { type: 'string' },
        startDate: { type: 'string', format: 'date' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Project created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid project data' })
  async createProject(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createProjectDto: any,
  ) {
    this.logger.log(`Creating research project: ${createProjectDto.title}`);
    return this.researchService.createProject(createProjectDto);
  }

  /**
   * Update research project
   */
  @Put('projects/:projectId')
  @ApiOperation({
    summary: 'Update research project',
    description: 'Update an existing research project',
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiOkResponse({ description: 'Project updated successfully' })
  async updateProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateProjectDto: any,
  ) {
    this.logger.log(`Updating research project: ${projectId}`);
    return this.researchService.updateProject(projectId, updateProjectDto);
  }

  /**
   * Delete research project
   */
  @Delete('projects/:projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete research project',
    description: 'Delete a research project',
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiOkResponse({ description: 'Project deleted successfully' })
  async deleteProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    this.logger.log(`Deleting research project: ${projectId}`);
    return this.researchService.deleteProject(projectId);
  }

  /**
   * Get enrollment analytics
   */
  @Get('analytics/enrollment')
  @ApiOperation({
    summary: 'Get enrollment analytics',
    description: 'Retrieve comprehensive enrollment analytics',
  })
  @ApiQuery({ name: 'termId', required: false })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiOkResponse({ description: 'Analytics retrieved' })
  async getEnrollmentAnalytics(
    @Query('termId') termId?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.researchService.getEnrollmentAnalytics({
      termId,
      departmentId,
    });
  }

  /**
   * Get student success analytics
   */
  @Get('analytics/student-success')
  @ApiOperation({
    summary: 'Get student success analytics',
    description: 'Retrieve student success and retention metrics',
  })
  @ApiQuery({ name: 'cohortYear', required: false })
  @ApiOkResponse({ description: 'Analytics retrieved' })
  async getStudentSuccessAnalytics(
    @Query('cohortYear') cohortYear?: string,
  ) {
    return this.researchService.getStudentSuccessAnalytics({ cohortYear });
  }

  /**
   * Get degree completion analytics
   */
  @Get('analytics/degree-completion')
  @ApiOperation({
    summary: 'Get degree completion analytics',
    description: 'Retrieve degree completion rates and time-to-degree metrics',
  })
  @ApiQuery({ name: 'degreeType', required: false })
  @ApiOkResponse({ description: 'Analytics retrieved' })
  async getDegreeCompletionAnalytics(
    @Query('degreeType') degreeType?: string,
  ) {
    return this.researchService.getDegreeCompletionAnalytics({ degreeType });
  }

  /**
   * Get faculty analytics
   */
  @Get('analytics/faculty')
  @ApiOperation({
    summary: 'Get faculty analytics',
    description: 'Retrieve faculty workload and productivity metrics',
  })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiOkResponse({ description: 'Analytics retrieved' })
  async getFacultyAnalytics(
    @Query('departmentId') departmentId?: string,
  ) {
    return this.researchService.getFacultyAnalytics({ departmentId });
  }

  /**
   * Get demographic analytics
   */
  @Get('analytics/demographics')
  @ApiOperation({
    summary: 'Get demographic analytics',
    description: 'Retrieve student demographic analysis',
  })
  @ApiOkResponse({ description: 'Analytics retrieved' })
  async getDemographicAnalytics() {
    return this.researchService.getDemographicAnalytics();
  }

  /**
   * Generate custom report
   */
  @Post('reports/custom')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Generate custom report',
    description: 'Generate custom research report',
  })
  @ApiBody({
    description: 'Report specification',
    schema: {
      properties: {
        title: { type: 'string' },
        metrics: { type: 'array' },
        filters: { type: 'object' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Report generation started' })
  async generateCustomReport(@Body() reportSpec: any) {
    this.logger.log(`Generating custom report: ${reportSpec.title}`);
    return this.researchService.generateCustomReport(reportSpec);
  }

  /**
   * Get report by ID
   */
  @Get('reports/:reportId')
  @ApiOperation({
    summary: 'Get report',
    description: 'Retrieve a specific research report',
  })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiOkResponse({ description: 'Report found' })
  async getReport(@Param('reportId', ParseUUIDPipe) reportId: string) {
    return this.researchService.getReport(reportId);
  }

  /**
   * Export analytics data
   */
  @Get('export/:format')
  @ApiOperation({
    summary: 'Export analytics data',
    description: 'Export institutional research data',
  })
  @ApiParam({ name: 'format', enum: ['csv', 'xlsx', 'json'] })
  @ApiQuery({ name: 'reportId', required: false })
  @ApiOkResponse({ description: 'Export generated successfully' })
  async export(
    @Param('format') format: 'csv' | 'xlsx' | 'json',
    @Query('reportId') reportId?: string,
  ) {
    this.logger.log(`Exporting research data in ${format} format`);
    return this.researchService.export(format, reportId);
  }

  /**
   * Get key performance indicators
   */
  @Get('kpis/dashboard')
  @ApiOperation({
    summary: 'Get KPIs',
    description: 'Retrieve institutional key performance indicators',
  })
  @ApiOkResponse({ description: 'KPIs retrieved' })
  async getKpis() {
    return this.researchService.getKpis();
  }

  /**
   * Get trend analysis
   */
  @Get('trends/analysis')
  @ApiOperation({
    summary: 'Get trend analysis',
    description: 'Retrieve institutional trends over time',
  })
  @ApiQuery({ name: 'metric', required: false })
  @ApiQuery({ name: 'years', required: false, type: Number })
  @ApiOkResponse({ description: 'Trends retrieved' })
  async getTrendAnalysis(
    @Query('metric') metric?: string,
    @Query('years', new ParseIntPipe({ optional: true })) years: number = 5,
  ) {
    return this.researchService.getTrendAnalysis({ metric, years });
  }

  /**
   * Schedule automated report
   */
  @Post('reports/schedule')
  @ApiOperation({
    summary: 'Schedule report',
    description: 'Schedule automated report generation',
  })
  @ApiOkResponse({ description: 'Report scheduled successfully' })
  async scheduleReport(@Body() scheduleData: any) {
    return this.researchService.scheduleReport(scheduleData);
  }

  /**
   * Get benchmarking data
   */
  @Get('benchmarking/comparison')
  @ApiOperation({
    summary: 'Get benchmarking comparison',
    description: 'Retrieve peer institution comparison data',
  })
  @ApiQuery({ name: 'metric', required: false })
  @ApiOkResponse({ description: 'Benchmarking data retrieved' })
  async getBenchmarkingData(
    @Query('metric') metric?: string,
  ) {
    return this.researchService.getBenchmarkingData(metric);
  }
}
