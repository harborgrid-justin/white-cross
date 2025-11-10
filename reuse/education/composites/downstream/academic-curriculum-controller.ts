/**
 * LOC: EDU-DOWN-CURRICULUM-CTRL-007
 * File: /reuse/education/composites/downstream/academic-curriculum-controller.ts
 *
 * Purpose: Academic Curriculum REST Controller - Production-grade HTTP endpoints
 * Handles curriculum design, program management, course mapping, and accreditation
 *
 * Upstream: AcademicCurriculumService, CurriculumManagementComposite
 * Downstream: REST API clients, Curriculum management systems, Accreditation tools
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
import { AcademicCurriculumService } from './academic-curriculum-service';

// Guard and Interceptor imports
// import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
// import { RolesGuard } from '@/common/guards/roles.guard';
// import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
// import { Roles } from '@/common/decorators/roles.decorator';

/**
 * Academic Curriculum Controller
 * Provides REST API endpoints for curriculum management
 */
@ApiTags('Curriculum Management')
@Controller('api/v1/curriculum')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(LoggingInterceptor)
export class AcademicCurriculumController {
  private readonly logger = new Logger(AcademicCurriculumController.name);

  constructor(private readonly curriculumService: AcademicCurriculumService) {}

  /**
   * Get all curriculum programs
   */
  @Get('programs')
  @ApiOperation({
    summary: 'Get all programs',
    description: 'Retrieve paginated list of curriculum programs',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'departmentId', required: false, type: String })
  @ApiOkResponse({
    description: 'Programs retrieved successfully',
  })
  async findPrograms(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.curriculumService.findPrograms({
      page,
      limit,
      departmentId,
    });
  }

  /**
   * Get program by ID
   */
  @Get('programs/:programId')
  @ApiOperation({
    summary: 'Get program by ID',
    description: 'Retrieve a specific curriculum program',
  })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  @ApiOkResponse({ description: 'Program found' })
  @ApiNotFoundResponse({ description: 'Program not found' })
  async findProgram(@Param('programId', ParseUUIDPipe) programId: string) {
    return this.curriculumService.findProgram(programId);
  }

  /**
   * Create curriculum program
   */
  @Post('programs')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create program',
    description: 'Create a new curriculum program',
  })
  @ApiBody({
    description: 'Program data',
    schema: {
      properties: {
        name: { type: 'string' },
        code: { type: 'string' },
        departmentId: { type: 'string' },
        degreeType: { type: 'string' },
        credits: { type: 'number' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Program created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid program data' })
  async createProgram(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createProgramDto: any,
  ) {
    this.logger.log(`Creating program: ${createProgramDto.name}`);
    return this.curriculumService.createProgram(createProgramDto);
  }

  /**
   * Update program
   */
  @Put('programs/:programId')
  @ApiOperation({
    summary: 'Update program',
    description: 'Update an existing curriculum program',
  })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  @ApiOkResponse({ description: 'Program updated successfully' })
  async updateProgram(
    @Param('programId', ParseUUIDPipe) programId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateProgramDto: any,
  ) {
    this.logger.log(`Updating program: ${programId}`);
    return this.curriculumService.updateProgram(programId, updateProgramDto);
  }

  /**
   * Delete program
   */
  @Delete('programs/:programId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete program',
    description: 'Delete a curriculum program',
  })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  @ApiOkResponse({ description: 'Program deleted successfully' })
  async deleteProgram(@Param('programId', ParseUUIDPipe) programId: string) {
    this.logger.log(`Deleting program: ${programId}`);
    return this.curriculumService.deleteProgram(programId);
  }

  /**
   * Get all courses
   */
  @Get('courses')
  @ApiOperation({
    summary: 'Get all courses',
    description: 'Retrieve paginated list of courses',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'departmentId', required: false, type: String })
  @ApiOkResponse({
    description: 'Courses retrieved successfully',
  })
  async findCourses(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.curriculumService.findCourses({
      page,
      limit,
      departmentId,
    });
  }

  /**
   * Get course by ID
   */
  @Get('courses/:courseId')
  @ApiOperation({
    summary: 'Get course by ID',
    description: 'Retrieve a specific course',
  })
  @ApiParam({ name: 'courseId', description: 'Course UUID' })
  @ApiOkResponse({ description: 'Course found' })
  async findCourse(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return this.curriculumService.findCourse(courseId);
  }

  /**
   * Create course
   */
  @Post('courses')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create course',
    description: 'Create a new course in curriculum',
  })
  @ApiBody({
    description: 'Course data',
    schema: {
      properties: {
        code: { type: 'string' },
        title: { type: 'string' },
        credits: { type: 'number' },
        description: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Course created successfully' })
  async createCourse(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createCourseDto: any,
  ) {
    this.logger.log(`Creating course: ${createCourseDto.code}`);
    return this.curriculumService.createCourse(createCourseDto);
  }

  /**
   * Update course
   */
  @Put('courses/:courseId')
  @ApiOperation({
    summary: 'Update course',
    description: 'Update an existing course',
  })
  @ApiParam({ name: 'courseId', description: 'Course UUID' })
  @ApiOkResponse({ description: 'Course updated successfully' })
  async updateCourse(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateCourseDto: any,
  ) {
    this.logger.log(`Updating course: ${courseId}`);
    return this.curriculumService.updateCourse(courseId, updateCourseDto);
  }

  /**
   * Delete course
   */
  @Delete('courses/:courseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete course',
    description: 'Delete a course',
  })
  @ApiParam({ name: 'courseId', description: 'Course UUID' })
  @ApiOkResponse({ description: 'Course deleted successfully' })
  async deleteCourse(@Param('courseId', ParseUUIDPipe) courseId: string) {
    this.logger.log(`Deleting course: ${courseId}`);
    return this.curriculumService.deleteCourse(courseId);
  }

  /**
   * Set course prerequisites
   */
  @Post('courses/:courseId/prerequisites')
  @ApiOperation({
    summary: 'Set prerequisites',
    description: 'Define prerequisite courses',
  })
  @ApiParam({ name: 'courseId', description: 'Course UUID' })
  @ApiOkResponse({ description: 'Prerequisites set successfully' })
  async setPrerequisites(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() prerequisiteData: any,
  ) {
    return this.curriculumService.setPrerequisites(courseId, prerequisiteData);
  }

  /**
   * Map course to program
   */
  @Post('programs/:programId/courses/:courseId/map')
  @ApiOperation({
    summary: 'Map course to program',
    description: 'Add course to program curriculum',
  })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  @ApiParam({ name: 'courseId', description: 'Course UUID' })
  @ApiOkResponse({ description: 'Course mapped successfully' })
  async mapCourseTOProgram(
    @Param('programId', ParseUUIDPipe) programId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() mappingData: any,
  ) {
    return this.curriculumService.mapCourseToProgram(programId, courseId, mappingData);
  }

  /**
   * Get learning outcomes
   */
  @Get('programs/:programId/learning-outcomes')
  @ApiOperation({
    summary: 'Get learning outcomes',
    description: 'Retrieve program learning outcomes',
  })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  @ApiOkResponse({ description: 'Learning outcomes retrieved' })
  async getLearningOutcomes(@Param('programId', ParseUUIDPipe) programId: string) {
    return this.curriculumService.getLearningOutcomes(programId);
  }

  /**
   * Define learning outcomes
   */
  @Post('programs/:programId/learning-outcomes')
  @ApiOperation({
    summary: 'Define learning outcomes',
    description: 'Create program learning outcomes',
  })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  @ApiOkResponse({ description: 'Learning outcomes created' })
  async defineLearningOutcomes(
    @Param('programId', ParseUUIDPipe) programId: string,
    @Body() outcomeData: any,
  ) {
    return this.curriculumService.defineLearningOutcomes(programId, outcomeData);
  }

  /**
   * Get degree requirements
   */
  @Get('programs/:programId/requirements')
  @ApiOperation({
    summary: 'Get degree requirements',
    description: 'Retrieve degree requirements for program',
  })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  @ApiOkResponse({ description: 'Requirements retrieved' })
  async getDegreeRequirements(@Param('programId', ParseUUIDPipe) programId: string) {
    return this.curriculumService.getDegreeRequirements(programId);
  }

  /**
   * Publish curriculum
   */
  @Patch('programs/:programId/publish')
  @ApiOperation({
    summary: 'Publish curriculum',
    description: 'Publish curriculum version for use',
  })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  @ApiOkResponse({ description: 'Curriculum published successfully' })
  async publishCurriculum(
    @Param('programId', ParseUUIDPipe) programId: string,
  ) {
    return this.curriculumService.publishCurriculum(programId);
  }

  /**
   * Validate curriculum completeness
   */
  @Post('programs/:programId/validate')
  @ApiOperation({
    summary: 'Validate curriculum',
    description: 'Validate curriculum is complete and valid',
  })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  @ApiOkResponse({ description: 'Validation completed' })
  async validateCurriculum(
    @Param('programId', ParseUUIDPipe) programId: string,
  ) {
    return this.curriculumService.validateCurriculum(programId);
  }

  /**
   * Export curriculum
   */
  @Get('programs/:programId/export/:format')
  @ApiOperation({
    summary: 'Export curriculum',
    description: 'Export curriculum in specified format',
  })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  @ApiParam({ name: 'format', enum: ['csv', 'xlsx', 'pdf'] })
  @ApiOkResponse({ description: 'Export generated successfully' })
  async exportCurriculum(
    @Param('programId', ParseUUIDPipe) programId: string,
    @Param('format') format: 'csv' | 'xlsx' | 'pdf',
  ) {
    return this.curriculumService.exportCurriculum(programId, format);
  }

  /**
   * Get curriculum versions
   */
  @Get('programs/:programId/versions')
  @ApiOperation({
    summary: 'Get curriculum versions',
    description: 'Retrieve version history of curriculum',
  })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  @ApiOkResponse({ description: 'Versions retrieved' })
  async getCurriculumVersions(@Param('programId', ParseUUIDPipe) programId: string) {
    return this.curriculumService.getCurriculumVersions(programId);
  }
}
