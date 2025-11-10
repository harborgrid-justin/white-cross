import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VitalSignsService } from '../services/vital-signs.service';
import { RecordVitalsDto } from '../dto/vitals/record-vitals.dto';
import { UpdateVitalsDto } from '../dto/vitals/update-vitals.dto';
import { VitalsFiltersDto } from '../dto/vitals/vitals-filters.dto';

@ApiTags('Clinical - Vital Signs')
@ApiBearerAuth()
@Controller('clinical/vital-signs')
export class VitalSignsController {
  constructor(private readonly vitalsService: VitalSignsService) {}

  @Post()
  @ApiOperation({
    summary: 'Record vital signs',
    description:
      'Records vital signs for a student during a clinical visit. Supports multiple vital sign types including blood pressure, temperature, heart rate, respiratory rate, oxygen saturation, height, weight, and BMI calculations.',
  })
  @ApiBody({ type: RecordVitalsDto })
  @ApiResponse({
    status: 201,
    description: 'Vital signs recorded successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Student or visit not found' })
  async record(@Body() recordDto: RecordVitalsDto) {
    return this.vitalsService.record(recordDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Query vital signs',
    description:
      'Retrieves vital signs with optional filtering by student, date range, visit, or vital type. Supports pagination and sorting options.',
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: 'Filter by student ID',
  })
  @ApiQuery({
    name: 'visitId',
    required: false,
    description: 'Filter by visit ID',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for filtering',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for filtering',
  })
  @ApiQuery({
    name: 'vitalType',
    required: false,
    description: 'Filter by vital sign type',
  })
  @ApiResponse({
    status: 200,
    description: 'Vital signs retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() filters: VitalsFiltersDto) {
    return this.vitalsService.findAll(filters);
  }

  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get vital history for a student',
    description:
      'Retrieves complete vital signs history for a student. Includes growth charts, vital trends, and abnormal readings flagged for clinical attention.',
  })
  @ApiParam({ name: 'studentId', description: 'Student UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Student vital history retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findByStudent(@Param('studentId') studentId: string) {
    return this.vitalsService.findByStudent(studentId);
  }

  @Get('student/:studentId/trends')
  @ApiOperation({
    summary: 'Get vital trends for a student',
    description:
      'Analyzes vital signs trends over time for a specific student. Provides growth velocity, percentile tracking, and identification of concerning patterns requiring clinical follow-up.',
  })
  @ApiParam({ name: 'studentId', description: 'Student UUID', format: 'uuid' })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date for trend analysis',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date for trend analysis',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Vital trends retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid date range' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getTrends(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.vitalsService.getTrends(
      studentId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get vital signs by ID',
    description:
      'Retrieves a specific vital signs record by its UUID. Returns detailed information including measurements, percentiles, and clinical flags.',
  })
  @ApiParam({
    name: 'id',
    description: 'Vital signs record UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Vital signs record retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vital signs record not found' })
  async findOne(@Param('id') id: string) {
    return this.vitalsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update vital signs',
    description:
      'Updates an existing vital signs record. Maintains audit trail of changes for clinical accuracy and compliance tracking.',
  })
  @ApiParam({
    name: 'id',
    description: 'Vital signs record UUID',
    format: 'uuid',
  })
  @ApiBody({ type: UpdateVitalsDto })
  @ApiResponse({
    status: 200,
    description: 'Vital signs updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vital signs record not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateVitalsDto) {
    return this.vitalsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete vital signs',
    description:
      'Soft deletes a vital signs record. Record is retained for audit purposes but marked as deleted. Permanent deletion may be restricted by retention policies.',
  })
  @ApiParam({
    name: 'id',
    description: 'Vital signs record UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 204,
    description: 'Vital signs record deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vital signs record not found' })
  async remove(@Param('id') id: string) {
    await this.vitalsService.remove(id);
  }
}
