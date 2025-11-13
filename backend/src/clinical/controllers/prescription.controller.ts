import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrescriptionService } from '../services/prescription.service';
import { CreatePrescriptionDto } from '../dto/prescription/create-prescription.dto';
import { UpdatePrescriptionDto } from '../dto/prescription/update-prescription.dto';
import { FillPrescriptionDto } from '../dto/prescription/fill-prescription.dto';
import { PrescriptionFiltersDto } from '../dto/prescription/prescription-filters.dto';
import { Prescription } from '../../database/models/prescription.model';

import { BaseController } from '@/common/base';
@ApiTags('Clinical - Prescriptions')
@ApiBearerAuth()
@Controller('clinical/prescriptions')
export class PrescriptionController extends BaseController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create prescription' })
  @ApiResponse({
    status: 201,
    description: 'Prescription created successfully',
  })
  async create(
    @Body() createDto: CreatePrescriptionDto,
  ): Promise<Prescription> {
    return this.prescriptionService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Query prescriptions' })
  @ApiResponse({
    status: 200,
    description: 'Prescriptions retrieved successfully',
  })
  async findAll(
    @Query() filters: PrescriptionFiltersDto,
  ): Promise<{ prescriptions: Prescription[]; total: number }> {
    return this.prescriptionService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prescription by ID' })
  @ApiResponse({
    status: 200,
    description: 'Prescription retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  async findOne(@Param('id') id: string): Promise<Prescription> {
    return this.prescriptionService.findOne(id);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get prescriptions for a student' })
  @ApiResponse({
    status: 200,
    description: 'Prescriptions retrieved successfully',
  })
  async findByStudent(
    @Param('studentId') studentId: string,
  ): Promise<Prescription[]> {
    return this.prescriptionService.findByStudent(studentId);
  }

  @Get('student/:studentId/active')
  @ApiOperation({ summary: 'Get active prescriptions for a student' })
  @ApiResponse({
    status: 200,
    description: 'Active prescriptions retrieved successfully',
  })
  async findActiveByStudent(
    @Param('studentId') studentId: string,
  ): Promise<Prescription[]> {
    return this.prescriptionService.findActiveByStudent(studentId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update prescription' })
  @ApiResponse({
    status: 200,
    description: 'Prescription updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    return this.prescriptionService.update(id, updateDto);
  }

  @Patch(':id/fill')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fill prescription' })
  @ApiResponse({ status: 200, description: 'Prescription filled successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  async fill(
    @Param('id') id: string,
    @Body() fillDto: FillPrescriptionDto,
  ): Promise<Prescription> {
    return this.prescriptionService.fill(id, fillDto);
  }

  @Patch(':id/mark-picked-up')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark prescription as picked up' })
  @ApiResponse({
    status: 200,
    description: 'Prescription marked as picked up successfully',
  })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  async markPickedUp(@Param('id') id: string): Promise<Prescription> {
    return this.prescriptionService.markPickedUp(id);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel prescription' })
  @ApiResponse({
    status: 200,
    description: 'Prescription cancelled successfully',
  })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  async cancel(@Param('id') id: string): Promise<Prescription> {
    return this.prescriptionService.cancel(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete prescription' })
  @ApiResponse({
    status: 204,
    description: 'Prescription deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.prescriptionService.remove(id);
  }
}
