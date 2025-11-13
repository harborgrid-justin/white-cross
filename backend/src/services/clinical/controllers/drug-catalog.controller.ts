import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DrugInteractionService } from '../services/drug-interaction.service';
import { DrugSearchDto } from '../dto/drug/drug-search.dto';
import { AddDrugDto } from '../dto/drug/add-drug.dto';
import { UpdateDrugDto } from '../dto/drug/update-drug.dto';

import { BaseController } from '@/common/base';
/**
 * Drug Catalog Controller
 * Handles drug catalog management operations
 */
@ApiTags('Clinical - Drug Catalog')
@ApiBearerAuth()
@Controller('clinical/drugs')
export class DrugCatalogController extends BaseController {
  constructor(
    private readonly drugInteractionService: DrugInteractionService,
  ) {}

  /**
   * Search drugs by name or brand
   */
  @Post('search')
  @ApiOperation({ summary: 'Search drugs by name or brand' })
  @ApiResponse({ status: 200, description: 'Drugs found successfully' })
  async searchDrugs(@Body() searchDto: DrugSearchDto) {
    return this.drugInteractionService.searchDrugs(
      searchDto.query,
      searchDto.limit,
    );
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
  async updateDrug(
    @Param('id') id: string,
    @Body() updateDrugDto: UpdateDrugDto,
  ) {
    return this.drugInteractionService.updateDrug(id, updateDrugDto);
  }

  /**
   * Get drugs by class
   */
  @Get('class/:drugClass')
  @ApiOperation({ summary: 'Get drugs by classification' })
  @ApiParam({
    name: 'drugClass',
    description: 'Drug class (e.g., NSAID, antibiotic)',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Controlled substances found successfully',
  })
  async getControlledSubstances(@Query('schedule') schedule?: string) {
    return this.drugInteractionService.getControlledSubstances(schedule);
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
