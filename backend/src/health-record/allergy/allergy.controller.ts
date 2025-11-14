import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllergyService } from './allergy.service';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';
import { CheckMedicationConflictsDto, MedicationConflictResponseDto } from './dto/check-conflicts.dto';
import { JwtAuthGuard } from '../../services/auth';
import { RolesGuard } from '../../services/auth';
import { Roles } from '../../services/auth';
import { UserRole   } from '@/database/models';

import { BaseController } from '@/common/base';
/**
 * Allergy Management Controller
 *
 * Provides REST API endpoints for student allergy records
 * All endpoints are PHI-protected and require authentication
 * Access is logged for HIPAA compliance
 */
@ApiTags('Health Records - Allergies')

@Controller('health-records/allergies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class HealthRecordAllergyController extends BaseController {
  constructor(private readonly allergyService: AllergyService) {
    super();}

  /**
   * Get allergy by ID
   * @requires Authentication
   * @returns Allergy details
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.NURSE, UserRole.COUNSELOR, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get allergy record by ID' })
  @ApiParam({ name: 'id', description: 'Allergy UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Allergy retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({ status: 404, description: 'Allergy not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllergyById(@Param('id') id: string, @Request() req: any) {
    return this.allergyService.findOne(id, req.user);
  }

  /**
   * Get all allergies for a student
   * @requires Authentication
   * @param studentId Student UUID
   * @returns Array of student's allergy records
   */
  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.NURSE, UserRole.COUNSELOR, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get all allergies for a student' })
  @ApiParam({ name: 'studentId', description: 'Student UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Student allergies retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Must be assigned nurse or admin',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentAllergies(
    @Param('studentId') studentId: string,
    @Request() req: any,
  ) {
    return this.allergyService.findByStudent(studentId, req.user);
  }

  /**
   * Create new allergy record
   * @requires ADMIN or NURSE role
   * @param createAllergyDto Allergy data
   * @returns Created allergy with audit trail entry
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.NURSE)
  @ApiOperation({ summary: 'Create new allergy record' })
    @ApiBody({ type: CreateAllergyDto })
  @ApiResponse({
    status: 201,
    description: 'The allergy record has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data provided.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async create(
    @Request() req: any,
    @Body() createAllergyDto: CreateAllergyDto,
  ) {
    return this.allergyService.create(createAllergyDto, req.user);
  }

  /**
   * Update allergy record
   * @requires ADMIN or NURSE role
   * @param id Allergy UUID
   * @param updateAllergyDto Updated allergy data
   * @returns Updated allergy with audit trail entry
   */
  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.NURSE)
  @ApiOperation({ summary: 'Update allergy record' })
  @ApiParam({ name: 'id', description: 'Allergy UUID', type: 'string' })
  @ApiBody({ type: UpdateAllergyDto })
  @ApiResponse({
    status: 200,
    description: 'Allergy updated successfully with audit entry',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires NURSE or ADMIN role',
  })
  @ApiResponse({ status: 404, description: 'Allergy not found' })
  async updateAllergy(
    @Param('id') id: string,
    @Body() updateAllergyDto: UpdateAllergyDto,
    @Request() req: any,
  ) {
    return this.allergyService.update(id, updateAllergyDto, req.user);
  }

  /**
   * Check medication-allergy conflicts
   * CRITICAL SAFETY FEATURE - Prevents allergic reactions
   * @requires Authentication
   * @param checkDto Student ID and medication name
   * @returns Conflict analysis with severity and recommendations
   */
  @Post('check-conflicts')
  @Roles(UserRole.ADMIN, UserRole.NURSE, UserRole.COUNSELOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check medication-allergy conflicts (CRITICAL SAFETY)',
    description:
      "Checks if a medication conflicts with student's known allergies. Returns severity level and recommendations.",
  })
  @ApiBody({ type: CheckMedicationConflictsDto })
  @ApiResponse({
    status: 200,
    description: 'Conflict check completed successfully',
    type: MedicationConflictResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid student ID or medication name',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires NURSE, COUNSELOR, or ADMIN role',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async checkMedicationConflicts(
    @Body() checkDto: CheckMedicationConflictsDto,
    @Request() req: any,
  ): Promise<MedicationConflictResponseDto> {
    const result = await this.allergyService.checkMedicationInteractions(
      checkDto.studentId,
      checkDto.medicationName,
    );

    // Enhanced response with safety recommendations
    let recommendation: 'SAFE' | 'CONSULT_PHYSICIAN' | 'DO_NOT_ADMINISTER' =
      'SAFE';
    let warning: string | undefined;

    if (result.hasInteractions) {
      const hasSevere = result.interactions.some(
        (i: any) => i.severity === 'SEVERE' || i.severity === 'LIFE_THREATENING',
      );

      if (hasSevere) {
        recommendation = 'DO_NOT_ADMINISTER';
        warning = `CRITICAL: Patient has life-threatening or severe allergy. DO NOT administer ${checkDto.medicationName}.`;
      } else {
        recommendation = 'CONSULT_PHYSICIAN';
        warning = `CAUTION: Potential allergic reaction detected. Consult physician before administering ${checkDto.medicationName}.`;
      }
    }

    return {
      hasConflicts: result.hasInteractions,
      conflicts: result.interactions.map((interaction: any) => ({
        allergen: interaction.allergen,
        severity: interaction.severity,
        reaction: interaction.reaction,
        conflictType: 'DIRECT_MATCH' as const,
      })),
      recommendation,
      warning,
    };
  }

  /**
   * Delete allergy record
   * @requires ADMIN role
   * @param id Allergy UUID
   * @returns No content on success
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete allergy record (Admin only)' })
  @ApiParam({ name: 'id', description: 'Allergy UUID', type: 'string' })
  @ApiResponse({
    status: 204,
    description: 'Allergy deleted successfully (no content)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Allergy not found' })
  async deleteAllergy(@Param('id') id: string, @Request() req: any) {
    return this.allergyService.remove(id, req.user);
  }
}
