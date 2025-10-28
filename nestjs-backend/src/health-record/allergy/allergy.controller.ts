import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AllergyService } from './allergy.service';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../database/models/user.model';

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
export class AllergyController {
  constructor(private readonly allergyService: AllergyService) {}

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
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
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
  @ApiResponse({ status: 403, description: 'Forbidden - Must be assigned nurse or admin' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentAllergies(@Param('studentId') studentId: string, @Request() req: any) {
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
    description: 'Allergy created successfully with audit trail entry',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Validation error',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires NURSE or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async createAllergy(@Body() createAllergyDto: CreateAllergyDto, @Request() req: any) {
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
  @ApiResponse({ status: 403, description: 'Forbidden - Requires NURSE or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Allergy not found' })
  async updateAllergy(
    @Param('id') id: string,
    @Body() updateAllergyDto: UpdateAllergyDto,
    @Request() req: any,
  ) {
    return this.allergyService.update(id, updateAllergyDto, req.user);
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
