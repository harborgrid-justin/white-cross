import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PrescriptionService } from '../services/prescription.service';
import { CreatePrescriptionDto } from '../dto/prescription/create-prescription.dto';
import { UpdatePrescriptionDto } from '../dto/prescription/update-prescription.dto';
import { FillPrescriptionDto } from '../dto/prescription/fill-prescription.dto';
import { PrescriptionFiltersDto } from '../dto/prescription/prescription-filters.dto';

@ApiTags('Clinical - Prescriptions')
@Controller('clinical/prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @ApiOperation({ summary: 'Create prescription' })
  async create(@Body() createDto: CreatePrescriptionDto) {
    return this.prescriptionService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Query prescriptions' })
  async findAll(@Query() filters: PrescriptionFiltersDto) {
    return this.prescriptionService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prescription by ID' })
  async findOne(@Param('id') id: string) {
    return this.prescriptionService.findOne(id);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get prescriptions for a student' })
  async findByStudent(@Param('studentId') studentId: string) {
    return this.prescriptionService.findByStudent(studentId);
  }

  @Get('student/:studentId/active')
  @ApiOperation({ summary: 'Get active prescriptions for a student' })
  async findActiveByStudent(@Param('studentId') studentId: string) {
    return this.prescriptionService.findActiveByStudent(studentId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update prescription' })
  async update(@Param('id') id: string, @Body() updateDto: UpdatePrescriptionDto) {
    return this.prescriptionService.update(id, updateDto);
  }

  @Post(':id/fill')
  @ApiOperation({ summary: 'Fill prescription' })
  async fill(@Param('id') id: string, @Body() fillDto: FillPrescriptionDto) {
    return this.prescriptionService.fill(id, fillDto);
  }

  @Post(':id/mark-picked-up')
  @ApiOperation({ summary: 'Mark prescription as picked up' })
  async markPickedUp(@Param('id') id: string) {
    return this.prescriptionService.markPickedUp(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel prescription' })
  async cancel(@Param('id') id: string) {
    return this.prescriptionService.cancel(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete prescription' })
  async remove(@Param('id') id: string) {
    await this.prescriptionService.remove(id);
  }
}
