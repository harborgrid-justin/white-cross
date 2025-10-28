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
import { DrugInteractionService } from '../services/drug-interaction.service';
import { DrugSearchDto } from '../dto/drug/drug-search.dto';
import { InteractionCheckDto } from '../dto/drug/interaction-check.dto';
import { AddDrugDto } from '../dto/drug/add-drug.dto';
import { UpdateDrugDto } from '../dto/drug/update-drug.dto';
import { AddInteractionDto } from '../dto/drug/add-interaction.dto';
import { UpdateInteractionDto } from '../dto/drug/update-interaction.dto';
import { AddAllergyDto } from '../dto/drug/add-allergy.dto';
import { UpdateAllergyDto } from '../dto/drug/update-allergy.dto';

/**
 * Drug Interaction Controller
 * REST API for drug catalog, interaction checking, and allergy management
 */
@ApiTags('Clinical - Drug Interactions')
@Controller('clinical/drugs')
export class DrugInteractionController {
  constructor(private readonly drugInteractionService: DrugInteractionService) {}

  /**
   * Search drugs by name or brand
   */
  @Post('search')
  @ApiOperation({ summary: 'Search drugs by name or brand' })
  @ApiResponse({ status: 200, description: 'Drugs found successfully' })
  async searchDrugs(@Body() searchDto: DrugSearchDto) {
    return this.drugInteractionService.searchDrugs(searchDto.query, searchDto.limit);
  }

  /**
   * Get drug by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get drug by ID' })
  @ApiParam({ name: 'id', description: 'Drug ID' })
  @ApiResponse({ status: 200, description: 'Drug found successfully' })
  @ApiResponse({ status: 404, description: 'Drug not found' })
  async getDrugById(@Param('id') id: string) {
    return this.drugInteractionService.getDrugById(id);
  }

  /**
   * Get drug by RxNorm code
   */
  @Get('rxnorm/:code')
  @ApiOperation({ summary: 'Get drug by RxNorm code' })
  @ApiParam({ name: 'code', description: 'RxNorm code' })
  @ApiResponse({ status: 200, description: 'Drug found successfully' })
  @ApiResponse({ status: 404, description: 'Drug not found' })
  async getDrugByRxNorm(@Param('code') code: string) {
    return this.drugInteractionService.searchByRxNorm(code);
  }

  /**
   * Add new drug to catalog
   */
  @Post()
  @ApiOperation({ summary: 'Add new drug to catalog' })
  @ApiResponse({ status: 201, description: 'Drug created successfully' })
  async addDrug(@Body() addDrugDto: AddDrugDto) {
    return this.drugInteractionService.addDrug(addDrugDto);
  }

  /**
   * Update drug information
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update drug information' })
  @ApiParam({ name: 'id', description: 'Drug ID' })
  @ApiResponse({ status: 200, description: 'Drug updated successfully' })
  @ApiResponse({ status: 404, description: 'Drug not found' })
  async updateDrug(@Param('id') id: string, @Body() updateDrugDto: UpdateDrugDto) {
    return this.drugInteractionService.updateDrug(id, updateDrugDto);
  }

  /**
   * Get drugs by class
   */
  @Get('class/:drugClass')
  @ApiOperation({ summary: 'Get drugs by classification' })
  @ApiParam({ name: 'drugClass', description: 'Drug class (e.g., NSAID, antibiotic)' })
  @ApiResponse({ status: 200, description: 'Drugs found successfully' })
  async getDrugsByClass(@Param('drugClass') drugClass: string) {
    return this.drugInteractionService.getDrugsByClass(drugClass);
  }

  /**
   * Get controlled substances
   */
  @Get('controlled/substances')
  @ApiOperation({ summary: 'Get controlled substances' })
  @ApiQuery({
    name: 'schedule',
    required: false,
    description: 'Controlled substance schedule (I-V)',
  })
  @ApiResponse({ status: 200, description: 'Controlled substances found successfully' })
  async getControlledSubstances(@Query('schedule') schedule?: string) {
    return this.drugInteractionService.getControlledSubstances(schedule);
  }

  /**
   * Check drug interactions
   */
  @Post('../interactions/check')
  @ApiOperation({
    summary: 'Check drug-drug interactions and allergies',
    description: 'Performs pairwise interaction checking and calculates overall risk level',
  })
  @ApiResponse({ status: 200, description: 'Interaction check completed successfully' })
  async checkInteractions(@Body() interactionCheckDto: InteractionCheckDto) {
    return this.drugInteractionService.checkInteractions(interactionCheckDto);
  }

  /**
   * Add drug interaction
   */
  @Post('../interactions')
  @ApiOperation({ summary: 'Add a drug-drug interaction' })
  @ApiResponse({ status: 201, description: 'Interaction created successfully' })
  @ApiResponse({ status: 409, description: 'Interaction already exists' })
  async addInteraction(@Body() addInteractionDto: AddInteractionDto) {
    return this.drugInteractionService.addInteraction(addInteractionDto);
  }

  /**
   * Update drug interaction
   */
  @Patch('../interactions/:id')
  @ApiOperation({ summary: 'Update drug interaction' })
  @ApiParam({ name: 'id', description: 'Interaction ID' })
  @ApiResponse({ status: 200, description: 'Interaction updated successfully' })
  @ApiResponse({ status: 404, description: 'Interaction not found' })
  async updateInteraction(
    @Param('id') id: string,
    @Body() updateInteractionDto: UpdateInteractionDto,
  ) {
    return this.drugInteractionService.updateInteraction(id, updateInteractionDto);
  }

  /**
   * Delete drug interaction
   */
  @Delete('../interactions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete drug interaction' })
  @ApiParam({ name: 'id', description: 'Interaction ID' })
  @ApiResponse({ status: 204, description: 'Interaction deleted successfully' })
  @ApiResponse({ status: 404, description: 'Interaction not found' })
  async deleteInteraction(@Param('id') id: string) {
    await this.drugInteractionService.deleteInteraction(id);
  }

  /**
   * Get all interactions for a drug
   */
  @Get(':drugId/interactions')
  @ApiOperation({ summary: 'Get all interactions for a specific drug' })
  @ApiParam({ name: 'drugId', description: 'Drug ID' })
  @ApiResponse({ status: 200, description: 'Interactions found successfully' })
  async getDrugInteractions(@Param('drugId') drugId: string) {
    return this.drugInteractionService.getDrugInteractions(drugId);
  }

  /**
   * Get interaction statistics
   */
  @Get('../interactions/statistics/summary')
  @ApiOperation({ summary: 'Get drug interaction statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getInteractionStatistics() {
    return this.drugInteractionService.getInteractionStatistics();
  }

  /**
   * Add student drug allergy
   */
  @Post('../allergies')
  @ApiOperation({ summary: 'Add student drug allergy' })
  @ApiResponse({ status: 201, description: 'Allergy recorded successfully' })
  @ApiResponse({ status: 409, description: 'Allergy already exists' })
  async addAllergy(@Body() addAllergyDto: AddAllergyDto) {
    return this.drugInteractionService.addAllergy(addAllergyDto);
  }

  /**
   * Update student drug allergy
   */
  @Patch('../allergies/:id')
  @ApiOperation({ summary: 'Update student drug allergy' })
  @ApiParam({ name: 'id', description: 'Allergy ID' })
  @ApiResponse({ status: 200, description: 'Allergy updated successfully' })
  @ApiResponse({ status: 404, description: 'Allergy not found' })
  async updateAllergy(@Param('id') id: string, @Body() updateAllergyDto: UpdateAllergyDto) {
    return this.drugInteractionService.updateAllergy(id, updateAllergyDto);
  }

  /**
   * Delete student drug allergy
   */
  @Delete('../allergies/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
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
  @Get('../allergies/student/:studentId')
  @ApiOperation({ summary: 'Get all allergies for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Allergies found successfully' })
  async getStudentAllergies(@Param('studentId') studentId: string) {
    return this.drugInteractionService.getStudentAllergies(studentId);
  }

  /**
   * Bulk import drugs
   */
  @Post('bulk-import')
  @ApiOperation({
    summary: 'Bulk import drugs from FDA data',
    description: 'Import multiple drugs at once with duplicate detection',
  })
  @ApiResponse({ status: 201, description: 'Bulk import completed' })
  async bulkImportDrugs(@Body() drugs: AddDrugDto[]) {
    return this.drugInteractionService.bulkImportDrugs(drugs);
  }
}
