import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TreatmentPlanService } from '../services/treatment-plan.service';
import { CreateTreatmentPlanDto } from '../dto/treatment/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from '../dto/treatment/update-treatment-plan.dto';
import { TreatmentPlanFiltersDto } from '../dto/treatment/treatment-plan-filters.dto';

/**
 * Treatment Plan Controller
 * REST API for managing student treatment plans
 */
@ApiTags('Clinical - Treatment Plans')
@Controller('clinical/treatment-plans')
export class TreatmentPlanController {
  constructor(private readonly treatmentPlanService: TreatmentPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create treatment plan', description: 'Creates a new treatment plan for a student' })
  @ApiResponse({ status: 201, description: 'Treatment plan created successfully' })
  async create(@Body() createDto: CreateTreatmentPlanDto) {
    return this.treatmentPlanService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Query treatment plans', description: 'Search and filter treatment plans with pagination' })
  @ApiResponse({ status: 200, description: 'Treatment plans retrieved successfully' })
  async findAll(@Query() filters: TreatmentPlanFiltersDto) {
    return this.treatmentPlanService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get treatment plan by ID' })
  @ApiParam({ name: 'id', description: 'Treatment plan ID' })
  @ApiResponse({ status: 200, description: 'Treatment plan found' })
  @ApiResponse({ status: 404, description: 'Treatment plan not found' })
  async findOne(@Param('id') id: string) {
    return this.treatmentPlanService.findOne(id);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get treatment plans for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of results' })
  @ApiResponse({ status: 200, description: 'Student treatment plans retrieved' })
  async findByStudent(@Param('studentId') studentId: string, @Query('limit') limit?: number) {
    return this.treatmentPlanService.findByStudent(studentId, limit);
  }

  @Get('student/:studentId/active')
  @ApiOperation({ summary: 'Get active treatment plans for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Active treatment plans retrieved' })
  async findActiveByStudent(@Param('studentId') studentId: string) {
    return this.treatmentPlanService.findActiveByStudent(studentId);
  }

  @Get('visit/:visitId')
  @ApiOperation({ summary: 'Get treatment plans for a clinic visit' })
  @ApiParam({ name: 'visitId', description: 'Clinic visit ID' })
  @ApiResponse({ status: 200, description: 'Visit treatment plans retrieved' })
  async findByVisit(@Param('visitId') visitId: string) {
    return this.treatmentPlanService.findByVisit(visitId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update treatment plan' })
  @ApiParam({ name: 'id', description: 'Treatment plan ID' })
  @ApiResponse({ status: 200, description: 'Treatment plan updated' })
  @ApiResponse({ status: 404, description: 'Treatment plan not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateTreatmentPlanDto) {
    return this.treatmentPlanService.update(id, updateDto);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate treatment plan' })
  @ApiParam({ name: 'id', description: 'Treatment plan ID' })
  @ApiResponse({ status: 200, description: 'Treatment plan activated' })
  @ApiResponse({ status: 400, description: 'Treatment plan already active' })
  async activate(@Param('id') id: string) {
    return this.treatmentPlanService.activate(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete treatment plan' })
  @ApiParam({ name: 'id', description: 'Treatment plan ID' })
  @ApiResponse({ status: 200, description: 'Treatment plan completed' })
  async complete(@Param('id') id: string) {
    return this.treatmentPlanService.complete(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel treatment plan' })
  @ApiParam({ name: 'id', description: 'Treatment plan ID' })
  @ApiResponse({ status: 200, description: 'Treatment plan cancelled' })
  async cancel(@Param('id') id: string) {
    return this.treatmentPlanService.cancel(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete treatment plan' })
  @ApiParam({ name: 'id', description: 'Treatment plan ID' })
  @ApiResponse({ status: 204, description: 'Treatment plan deleted' })
  @ApiResponse({ status: 404, description: 'Treatment plan not found' })
  async remove(@Param('id') id: string) {
    await this.treatmentPlanService.remove(id);
  }
}
