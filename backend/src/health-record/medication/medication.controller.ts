import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MedicationService } from './medication.service';
import { HealthRecordCreateMedicationDto } from './dto/create-medication.dto';
import { UpdateHealthRecordMedicationDto } from './dto/update-medication.dto';
import { Medication   } from '@/database/models';

import { BaseController } from '@/common/base';
@ApiTags('medications')
@ApiBearerAuth()

@Controller('medications')
export class HealthRecordMedicationController extends BaseController {
  constructor(private readonly medicationService: MedicationService) {
    super();}

  @Post()
  @ApiOperation({ summary: 'Create a new medication' })
  @ApiResponse({
    status: 201,
    description: 'Medication created successfully',
    type: Medication,
  })
  @ApiResponse({
    status: 409,
    description: 'Medication with this NDC already exists',
  })
  async create(
    @Body() createDto: HealthRecordCreateMedicationDto,
  ): Promise<Medication> {
    return this.medicationService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all medications with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of medications',
    type: [Medication],
  })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'isControlled', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('isActive') isActive?: string,
    @Query('isControlled') isControlled?: string,
    @Query('search') search?: string,
  ): Promise<Medication[]> {
    const options: any = {};

    if (isActive !== undefined) {
      options.isActive = isActive === 'true';
    }

    if (isControlled !== undefined) {
      options.isControlled = isControlled === 'true';
    }

    if (search) {
      options.search = search;
    }

    return this.medicationService.findAll(options);
  }

  @Get('controlled')
  @ApiOperation({ summary: 'Get all controlled substances' })
  @ApiResponse({
    status: 200,
    description: 'List of controlled medications',
    type: [Medication],
  })
  async getControlledSubstances(): Promise<Medication[]> {
    return this.medicationService.getControlledSubstances();
  }

  @Get('witness-required')
  @ApiOperation({
    summary: 'Get medications requiring witness for administration',
  })
  @ApiResponse({
    status: 200,
    description: 'List of medications requiring witness',
    type: [Medication],
  })
  async getWitnessRequiredMedications(): Promise<Medication[]> {
    return this.medicationService.getWitnessRequiredMedications();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medication by ID' })
  @ApiParam({ name: 'id', description: 'Medication UUID' })
  @ApiResponse({
    status: 200,
    description: 'Medication details',
    type: Medication,
  })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  async findById(@Param('id') id: string): Promise<Medication> {
    return this.medicationService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update medication' })
  @ApiParam({ name: 'id', description: 'Medication UUID' })
  @ApiResponse({
    status: 200,
    description: 'Medication updated successfully',
    type: Medication,
  })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  @ApiResponse({
    status: 409,
    description: 'Medication with this NDC already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateHealthRecordMedicationDto,
  ): Promise<Medication> {
    return this.medicationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate medication (soft delete)' })
  @ApiParam({ name: 'id', description: 'Medication UUID' })
  @ApiResponse({
    status: 204,
    description: 'Medication deactivated successfully',
  })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  async deactivate(@Param('id') id: string): Promise<void> {
    // TODO: Get user ID from authentication context
    await this.medicationService.deactivate(id, 'system');
  }

  @Post(':id/reactivate')
  @ApiOperation({ summary: 'Reactivate medication' })
  @ApiParam({ name: 'id', description: 'Medication UUID' })
  @ApiResponse({
    status: 200,
    description: 'Medication reactivated successfully',
    type: Medication,
  })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  async reactivate(@Param('id') id: string): Promise<Medication> {
    return this.medicationService.reactivate(id);
  }
}
