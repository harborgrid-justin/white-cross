import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DrugInteractionService } from '@/services/drug-interaction.service';
import { InteractionCheckDto } from '../dto/drug/interaction-check.dto';
import { AddInteractionDto } from '../dto/drug/add-interaction.dto';
import { UpdateInteractionDto } from '../dto/drug/update-interaction.dto';

import { BaseController } from '@/common/base';
/**
 * Drug Interaction Management Controller
 * Handles drug interaction operations
 */
@ApiTags('Clinical - Drug Interactions')
@ApiBearerAuth()
@Controller('clinical/drugs')
export class DrugInteractionManagementController extends BaseController {
  constructor(
    private readonly drugInteractionService: DrugInteractionService,
  ) {}

  /**
   * Check drug interactions
   */
  @Post('interactions/check')
  @ApiOperation({
    summary: 'Check drug-drug interactions and allergies',
    description:
      'Performs pairwise interaction checking and calculates overall risk level',
  })
  @ApiResponse({
    status: 200,
    description: 'Interaction check completed successfully',
  })
  async checkInteractions(@Body() interactionCheckDto: InteractionCheckDto) {
    return this.drugInteractionService.checkInteractions(interactionCheckDto);
  }

  /**
   * Add drug interaction
   */
  @Post('interactions')
  @ApiOperation({ summary: 'Add a drug-drug interaction' })
  @ApiResponse({ status: 201, description: 'Interaction created successfully' })
  @ApiResponse({ status: 409, description: 'Interaction already exists' })
  async addInteraction(@Body() addInteractionDto: AddInteractionDto) {
    return this.drugInteractionService.addInteraction(addInteractionDto);
  }

  /**
   * Update drug interaction
   */
  @Patch('interactions/:id')
  @ApiOperation({ summary: 'Update drug interaction' })
  @ApiParam({ name: 'id', description: 'Interaction ID' })
  @ApiResponse({ status: 200, description: 'Interaction updated successfully' })
  @ApiResponse({ status: 404, description: 'Interaction not found' })
  async updateInteraction(
    @Param('id') id: string,
    @Body() updateInteractionDto: UpdateInteractionDto,
  ) {
    return this.drugInteractionService.updateInteraction(
      id,
      updateInteractionDto,
    );
  }

  /**
   * Delete drug interaction
   */
  @Delete('interactions/:id')
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
  @Get('interactions/statistics/summary')
  @ApiOperation({ summary: 'Get drug interaction statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getInteractionStatistics() {
    return this.drugInteractionService.getInteractionStatistics();
  }
}
