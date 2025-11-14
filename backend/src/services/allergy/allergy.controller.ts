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
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseBoolPipe, ParseUUIDPipe, Patch, Post, Query, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllergyCrudService } from './services/allergy-crud.service';
import { AllergyQueryService } from './services/allergy-query.service';
import { AllergySafetyService } from './services/allergy-safety.service';
import { AllergyFiltersDto } from './dto/allergy-filters.dto';
import { AllergyUpdateDto } from './dto/update-allergy.dto';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { PaginationDto } from './dto/pagination.dto';
import { VerifyAllergyDto } from './dto/verify-allergy.dto';

import { BaseController } from '@/common/base';
@ApiTags('Allergies')
@ApiBearerAuth()

@Controller('allergies')
export class AllergyController extends BaseController {
  constructor(
    private readonly allergyCrudService: AllergyCrudService,
    private readonly allergyQueryService: AllergyQueryService,
    private readonly allergySafetyService: AllergySafetyService,
  ) {
    super();}

  /**
   * Create a new allergy record
   * POST /allergy
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new allergy record',
    description:
      'Creates a new allergy record for a student with severity classification and clinical information',
  })
  @ApiResponse({
    status: 201,
    description: 'Allergy created successfully',
    type: CreateAllergyDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data - validation errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async createAllergy(@Body() createAllergyDto: CreateAllergyDto) {
    return this.allergyCrudService.createAllergy(createAllergyDto);
  }

  /**
   * Get allergy by ID
   * GET /allergy/:id
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get allergy by ID',
    description: 'Retrieves a single allergy record by UUID',
  })
  @ApiParam({
    name: 'id',
    description: 'Allergy UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Allergy retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Allergy not found',
  })
  async getAllergyById(@Param('id', ParseUUIDPipe) id: string) {
    return this.allergyCrudService.getAllergyById(id);
  }

  /**
   * Get all allergies for a specific student
   * GET /allergy/student/:studentId
   */
  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get all allergies for a student',
    description:
      'Retrieves all allergy records for a specific student, optionally including inactive allergies',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'includeInactive',
    description: 'Include inactive/resolved allergies',
    required: false,
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Student allergies retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          studentId: { type: 'string', format: 'uuid' },
          allergen: { type: 'string', example: 'Peanuts' },
          severity: {
            type: 'string',
            enum: ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'],
          },
          reaction: {
            type: 'string',
            example: 'Anaphylaxis, hives, difficulty breathing',
          },
          verified: { type: 'boolean' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
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
  @ApiOperation({
    summary: 'Get critical allergies',
    description:
      'Retrieves only SEVERE and LIFE_THREATENING allergies for a student - used for safety alerts',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Critical allergies retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
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
  @ApiOperation({
    summary: 'Search allergies',
    description:
      'Advanced allergy search with filters (allergen type, severity, verified status) and pagination',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Items per page',
    required: false,
    type: Number,
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Search results with pagination',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { type: 'object' } },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
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
  @ApiOperation({
    summary: 'Get allergy statistics',
    description:
      'Retrieves aggregated statistics about allergies (counts by severity, type, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalAllergies: { type: 'number', example: 245 },
        bySeverity: {
          type: 'object',
          properties: {
            MILD: { type: 'number', example: 80 },
            MODERATE: { type: 'number', example: 100 },
            SEVERE: { type: 'number', example: 45 },
            LIFE_THREATENING: { type: 'number', example: 20 },
          },
        },
        byType: {
          type: 'object',
          properties: {
            MEDICATION: { type: 'number', example: 50 },
            FOOD: { type: 'number', example: 150 },
            ENVIRONMENTAL: { type: 'number', example: 45 },
          },
        },
        verified: { type: 'number', example: 200 },
        unverified: { type: 'number', example: 45 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getAllergyStatistics(@Query() filters?: AllergyFiltersDto) {
    return this.allergyQueryService.getAllergyStatistics(filters);
  }

  /**
   * Update an allergy record
   * PATCH /allergy/:id
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update an allergy record',
    description: 'Updates an existing allergy record with new information',
  })
  @ApiParam({
    name: 'id',
    description: 'Allergy UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Allergy updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Allergy not found',
  })
  async updateAllergy(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAllergyDto: AllergyUpdateDto,
  ) {
    return this.allergyCrudService.updateAllergy(id, updateAllergyDto);
  }

  /**
   * Deactivate an allergy (soft delete)
   * DELETE /allergy/:id/deactivate
   */
  @Delete(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate allergy',
    description:
      'Soft deletes an allergy record (marks as inactive) - used when allergy is resolved or no longer relevant',
  })
  @ApiParam({
    name: 'id',
    description: 'Allergy UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Allergy deactivated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Allergy not found',
  })
  async deactivateAllergy(@Param('id', ParseUUIDPipe) id: string) {
    return this.allergyCrudService.deactivateAllergy(id);
  }

  /**
   * Permanently delete an allergy record
   * DELETE /allergy/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete allergy permanently',
    description:
      'Permanently deletes an allergy record from the database - use with caution',
  })
  @ApiParam({
    name: 'id',
    description: 'Allergy UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Allergy deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Allergy not found',
  })
  async deleteAllergy(@Param('id', ParseUUIDPipe) id: string) {
    return this.allergyCrudService.deleteAllergy(id);
  }

  /**
   * Verify an allergy record by healthcare professional
   * POST /allergy/:id/verify
   */
  @Post(':id/verify')
  @ApiOperation({
    summary: 'Verify allergy',
    description:
      'Marks an allergy as clinically verified by a healthcare professional',
  })
  @ApiParam({
    name: 'id',
    description: 'Allergy UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Allergy verified successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Allergy not found',
  })
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
  @ApiOperation({
    summary: 'Check drug-allergy conflict',
    description:
      'Safety check to detect potential drug-allergy interactions before medication administration',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['studentId', 'medicationName'],
      properties: {
        studentId: {
          type: 'string',
          format: 'uuid',
          description: 'Student UUID',
        },
        medicationName: {
          type: 'string',
          example: 'Amoxicillin',
          description: 'Medication name to check',
        },
        medicationClass: {
          type: 'string',
          example: 'Penicillin',
          description: 'Medication class (optional)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Conflict check completed',
    schema: {
      type: 'object',
      properties: {
        hasConflict: { type: 'boolean', example: true },
        conflictingAllergies: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              allergen: { type: 'string', example: 'Penicillin' },
              severity: { type: 'string', example: 'SEVERE' },
              reaction: { type: 'string', example: 'Anaphylaxis' },
            },
          },
        },
        recommendation: {
          type: 'string',
          example: 'DO NOT ADMINISTER - Severe allergy conflict detected',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
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
  @ApiOperation({
    summary: 'Bulk create allergies',
    description:
      'Creates multiple allergy records in a single transaction - useful for data imports',
  })
  @ApiBody({
    type: [CreateAllergyDto],
    description: 'Array of allergy records to create',
  })
  @ApiResponse({
    status: 201,
    description: 'Allergies created successfully',
    schema: {
      type: 'object',
      properties: {
        created: { type: 'number', example: 15 },
        failed: { type: 'number', example: 0 },
        errors: { type: 'array', items: { type: 'object' } },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async bulkCreateAllergies(@Body() allergiesData: CreateAllergyDto[]) {
    return this.allergySafetyService.bulkCreateAllergies(allergiesData);
  }
}
