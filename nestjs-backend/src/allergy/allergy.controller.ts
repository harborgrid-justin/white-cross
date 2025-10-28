/**
 * Allergy Controller
 *
 * REST API endpoints for comprehensive allergy management.
 * Provides CRUD operations, advanced search, critical allergy retrieval,
 * and drug-allergy safety checking.
 *
 * @controller AllergyController
 * @route /allergy
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseBoolPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AllergyCrudService } from './services/allergy-crud.service';
import { AllergyQueryService } from './services/allergy-query.service';
import { AllergySafetyService } from './services/allergy-safety.service';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';
import { AllergyFiltersDto } from './dto/allergy-filters.dto';
import { PaginationDto } from './dto/pagination.dto';
import { VerifyAllergyDto } from './dto/verify-allergy.dto';

@Controller('allergy')
export class AllergyController {
  constructor(
    private readonly allergyCrudService: AllergyCrudService,
    private readonly allergyQueryService: AllergyQueryService,
    private readonly allergySafetyService: AllergySafetyService,
  ) {}

  /**
   * Create a new allergy record
   * POST /allergy
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAllergy(@Body() createAllergyDto: CreateAllergyDto) {
    return this.allergyCrudService.createAllergy(createAllergyDto);
  }

  /**
   * Get allergy by ID
   * GET /allergy/:id
   */
  @Get(':id')
  async getAllergyById(@Param('id', ParseUUIDPipe) id: string) {
    return this.allergyCrudService.getAllergyById(id);
  }

  /**
   * Get all allergies for a specific student
   * GET /allergy/student/:studentId
   */
  @Get('student/:studentId')
  async getStudentAllergies(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Query('includeInactive', new ParseBoolPipe({ optional: true }))
    includeInactive?: boolean,
  ) {
    return this.allergyQueryService.getStudentAllergies(
      studentId,
      includeInactive || false,
    );
  }

  /**
   * Get critical allergies for a student (SEVERE and LIFE_THREATENING only)
   * GET /allergy/student/:studentId/critical
   */
  @Get('student/:studentId/critical')
  async getCriticalAllergies(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.allergyQueryService.getCriticalAllergies(studentId);
  }

  /**
   * Search allergies with filters and pagination
   * GET /allergy/search
   */
  @Get('search/all')
  async searchAllergies(
    @Query() filters: AllergyFiltersDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.allergyQueryService.searchAllergies(filters, pagination);
  }

  /**
   * Get allergy statistics
   * GET /allergy/statistics
   */
  @Get('statistics/all')
  async getAllergyStatistics(@Query() filters?: AllergyFiltersDto) {
    return this.allergyQueryService.getAllergyStatistics(filters);
  }

  /**
   * Update an allergy record
   * PATCH /allergy/:id
   */
  @Patch(':id')
  async updateAllergy(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAllergyDto: UpdateAllergyDto,
  ) {
    return this.allergyCrudService.updateAllergy(id, updateAllergyDto);
  }

  /**
   * Deactivate an allergy (soft delete)
   * DELETE /allergy/:id/deactivate
   */
  @Delete(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateAllergy(@Param('id', ParseUUIDPipe) id: string) {
    return this.allergyCrudService.deactivateAllergy(id);
  }

  /**
   * Permanently delete an allergy record
   * DELETE /allergy/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteAllergy(@Param('id', ParseUUIDPipe) id: string) {
    return this.allergyCrudService.deleteAllergy(id);
  }

  /**
   * Verify an allergy record by healthcare professional
   * POST /allergy/:id/verify
   */
  @Post(':id/verify')
  async verifyAllergy(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() verifyAllergyDto: VerifyAllergyDto,
  ) {
    return this.allergySafetyService.verifyAllergy(
      id,
      verifyAllergyDto.verifiedBy,
    );
  }

  /**
   * Check for drug-allergy conflicts
   * POST /allergy/check-conflict
   */
  @Post('check-conflict')
  async checkDrugAllergyConflict(
    @Body()
    body: {
      studentId: string;
      medicationName: string;
      medicationClass?: string;
    },
  ) {
    return this.allergySafetyService.checkDrugAllergyConflict(
      body.studentId,
      body.medicationName,
      body.medicationClass,
    );
  }

  /**
   * Bulk create allergies
   * POST /allergy/bulk
   */
  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkCreateAllergies(@Body() allergiesData: CreateAllergyDto[]) {
    return this.allergySafetyService.bulkCreateAllergies(allergiesData);
  }
}
