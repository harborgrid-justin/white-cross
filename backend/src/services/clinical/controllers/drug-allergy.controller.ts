import { Body, Controller, Delete, Get, Param, Patch, Post, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DrugInteractionService } from '../services/drug-interaction.service';
import { AddAllergyDto } from '../dto/drug/add-allergy.dto';
import { ClinicalUpdateAllergyDto } from '../dto/drug/update-allergy.dto';

import { BaseController } from '@/common/base';
/**
 * Drug Allergy Controller
 * Handles student drug allergy operations
 */
@ApiTags('Clinical - Drug Allergies')
@ApiBearerAuth()

@Version('1')
@Controller('clinical/drugs')
export class DrugAllergyController extends BaseController {
  constructor(
    private readonly drugInteractionService: DrugInteractionService,
  ) {}

  /**
   * Add student drug allergy
   */
  @Post('allergies')
  @ApiOperation({ summary: 'Add student drug allergy' })
  @ApiResponse({ status: 201, description: 'Allergy recorded successfully' })
  @ApiResponse({ status: 409, description: 'Allergy already exists' })
  async addAllergy(@Body() addAllergyDto: AddAllergyDto) {
    return this.drugInteractionService.addAllergy(addAllergyDto);
  }

  /**
   * Update student drug allergy
   */
  @Patch('allergies/:id')
  @ApiOperation({ summary: 'Update student drug allergy' })
  @ApiParam({ name: 'id', description: 'Allergy ID' })
  @ApiResponse({ status: 200, description: 'Allergy updated successfully' })
  @ApiResponse({ status: 404, description: 'Allergy not found' })
  async updateAllergy(
    @Param('id') id: string,
    @Body() updateAllergyDto: ClinicalUpdateAllergyDto,
  ) {
    return this.drugInteractionService.updateAllergy(id, updateAllergyDto);
  }

  /**
   * Delete student drug allergy
   */
  @Delete('allergies/:id')
  @ApiOperation({ summary: 'Delete student drug allergy' })
  @ApiParam({ name: 'id', description: 'Allergy ID' })
  @ApiResponse({ status: 204, description: 'Allergy deleted successfully' })
  @ApiResponse({ status: 404, description: 'Allergy not found' })
  async deleteAllergy(@Param('id') id: string) {
    await this.drugInteractionService.deleteAllergy(id);
  }

  /**
   * Get student drug allergies
   */
  @Get('allergies/student/:studentId')
  @ApiOperation({ summary: 'Get all allergies for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Allergies found successfully' })
  async getStudentAllergies(@Param('studentId') studentId: string) {
    return this.drugInteractionService.getStudentAllergies(studentId);
  }
}
