import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ChronicConditionService } from './chronic-condition.service';
import {
  ChronicConditionCreateDto,
  ChronicConditionUpdateDto,
  ChronicConditionFiltersDto,
  PaginationDto,
  UpdateCarePlanDto,
} from './dto';
import { AccommodationType } from './enums';

/**
 * ChronicConditionController
 *
 * REST API controller for chronic condition management.
 * Provides endpoints for condition tracking, care plan management,
 * educational accommodation coordination, and monitoring.
 */
@ApiTags('Chronic Conditions')
@ApiBearerAuth()
@Controller('chronic-conditions')
export class ChronicConditionController {
  constructor(
    private readonly chronicConditionService: ChronicConditionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create new chronic condition',
    description:
      'Creates a new chronic condition record with ICD-10 coding, care plan, and accommodation tracking',
  })
  @ApiResponse({
    status: 201,
    description: 'Chronic condition successfully created',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() dto: ChronicConditionCreateDto) {
    return this.chronicConditionService.createChronicCondition(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get chronic condition by ID',
    description: 'Retrieves a single chronic condition with full details',
  })
  @ApiParam({ name: 'id', description: 'Chronic condition UUID' })
  @ApiResponse({
    status: 200,
    description: 'Chronic condition found',
  })
  @ApiResponse({ status: 404, description: 'Chronic condition not found' })
  findOne(@Param('id') id: string) {
    return this.chronicConditionService.getChronicConditionById(id);
  }

  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get all chronic conditions for a student',
    description: 'Retrieves all chronic conditions associated with a specific student',
  })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Include inactive/resolved conditions',
  })
  @ApiResponse({
    status: 200,
    description: 'Student chronic conditions retrieved',
  })
  findByStudent(
    @Param('studentId') studentId: string,
    @Query('includeInactive') includeInactive?: boolean,
  ) {
    return this.chronicConditionService.getStudentChronicConditions(
      studentId,
      includeInactive === true || includeInactive === 'true' as any,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update chronic condition',
    description: 'Updates an existing chronic condition record with change tracking',
  })
  @ApiParam({ name: 'id', description: 'Chronic condition UUID' })
  @ApiResponse({
    status: 200,
    description: 'Chronic condition successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Chronic condition not found' })
  update(@Param('id') id: string, @Body() dto: ChronicConditionUpdateDto) {
    return this.chronicConditionService.updateChronicCondition(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate chronic condition',
    description:
      'Soft deletes a chronic condition by marking it as RESOLVED (recommended)',
  })
  @ApiParam({ name: 'id', description: 'Chronic condition UUID' })
  @ApiResponse({
    status: 200,
    description: 'Chronic condition successfully deactivated',
  })
  @ApiResponse({ status: 404, description: 'Chronic condition not found' })
  deactivate(@Param('id') id: string) {
    return this.chronicConditionService.deactivateChronicCondition(id);
  }

  @Delete(':id/permanent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Permanently delete chronic condition',
    description:
      'Hard deletes a chronic condition (WARNING: HIPAA implications, use with caution)',
  })
  @ApiParam({ name: 'id', description: 'Chronic condition UUID' })
  @ApiResponse({
    status: 200,
    description: 'Chronic condition permanently deleted',
  })
  @ApiResponse({ status: 404, description: 'Chronic condition not found' })
  permanentDelete(@Param('id') id: string) {
    return this.chronicConditionService.deleteChronicCondition(id);
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search chronic conditions',
    description:
      'Advanced search with multi-criteria filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results with pagination metadata',
  })
  search(
    @Body() filters: ChronicConditionFiltersDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.chronicConditionService.searchChronicConditions(
      filters,
      pagination,
    );
  }

  @Get('reviews/due')
  @ApiOperation({
    summary: 'Get conditions requiring review',
    description: 'Retrieves conditions with care plans due for review within specified days',
  })
  @ApiQuery({
    name: 'daysAhead',
    required: false,
    type: Number,
    description: 'Number of days to look ahead (default: 30)',
  })
  @ApiResponse({
    status: 200,
    description: 'Conditions requiring review retrieved',
  })
  getReviewsDue(@Query('daysAhead') daysAhead?: number) {
    return this.chronicConditionService.getConditionsRequiringReview(
      daysAhead ? parseInt(daysAhead.toString(), 10) : 30,
    );
  }

  @Get('accommodations/:type')
  @ApiOperation({
    summary: 'Get conditions requiring accommodations',
    description:
      'Retrieves conditions requiring IEP or 504 educational accommodation plans',
  })
  @ApiParam({
    name: 'type',
    enum: AccommodationType,
    description: 'Accommodation type (IEP, 504, or BOTH)',
  })
  @ApiResponse({
    status: 200,
    description: 'Conditions requiring accommodations retrieved',
  })
  getAccommodations(@Param('type') type: AccommodationType) {
    return this.chronicConditionService.getConditionsRequiringAccommodations(
      type,
    );
  }

  @Get('statistics/summary')
  @ApiOperation({
    summary: 'Get chronic condition statistics',
    description:
      'Retrieves comprehensive statistics for chronic condition management and reporting',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  getStatistics(@Query() filters?: ChronicConditionFiltersDto) {
    return this.chronicConditionService.getChronicConditionStatistics(filters);
  }

  @Put(':id/care-plan')
  @ApiOperation({
    summary: 'Update care plan',
    description:
      'Updates the care plan for a chronic condition and refreshes review date',
  })
  @ApiParam({ name: 'id', description: 'Chronic condition UUID' })
  @ApiResponse({
    status: 200,
    description: 'Care plan successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Chronic condition not found' })
  updateCarePlan(
    @Param('id') id: string,
    @Body() dto: UpdateCarePlanDto,
  ) {
    return this.chronicConditionService.updateCarePlan(id, dto.carePlan);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Bulk create chronic conditions',
    description:
      'Creates multiple chronic condition records in a single operation (for data imports)',
  })
  @ApiResponse({
    status: 201,
    description: 'Chronic conditions successfully created',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  bulkCreate(@Body() conditionsData: ChronicConditionCreateDto[]) {
    return this.chronicConditionService.bulkCreateChronicConditions(
      conditionsData,
    );
  }
}
