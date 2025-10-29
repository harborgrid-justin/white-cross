/**
 * Medications Controller (v1)
 *
 * RESTful API endpoints for medication management in healthcare module.
 * Handles CRUD operations, activation/deactivation, and student-specific queries.
 *
 * Security:
 * - All endpoints require JWT authentication
 * - NURSE and ADMIN roles required for mutations
 * - Protected Health Information (PHI) - HIPAA compliant
 *
 * @module routes/v1/healthcare
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../shared/decorators';
import { MedicationService } from '../../../medication/services/medication.service';
import {
  CreateMedicationDto,
  UpdateMedicationDto,
  DeactivateMedicationDto,
  ListMedicationsQueryDto,
} from '../../../medication/dto';

@ApiTags('Healthcare - Medications v1')
@Controller('api/v1/medications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MedicationsV1Controller {
  private readonly logger = new Logger(MedicationsV1Controller.name);

  constructor(private readonly medicationService: MedicationService) {}

  @Get()
  @ApiOperation({
    summary: 'List all medications with pagination and filters',
    description: 'Retrieve paginated list of medications with optional filtering by student, active status, etc.',
  })
  @ApiResponse({
    status: 200,
    description: 'Medications retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            medications: { type: 'array', items: { type: 'object' } },
            pagination: {
              type: 'object',
              properties: {
                currentPage: { type: 'number' },
                itemsPerPage: { type: 'number' },
                totalItems: { type: 'number' },
                totalPages: { type: 'number' },
                hasNextPage: { type: 'boolean' },
                hasPreviousPage: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  })
  async listMedications(@Query() query: ListMedicationsQueryDto) {
    this.logger.log(`Listing medications: page=${query.page}, limit=${query.limit}`);

    const result = await this.medicationService.getMedications(query);

    return {
      success: true,
      data: {
        medications: result.medications,
        pagination: {
          currentPage: result.pagination.page,
          itemsPerPage: result.pagination.limit,
          totalItems: result.pagination.total,
          totalPages: result.pagination.pages,
          hasNextPage: result.pagination.page < result.pagination.pages,
          hasPreviousPage: result.pagination.page > 1,
        },
      },
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('ADMIN', 'NURSE')
  @ApiOperation({
    summary: 'Create new medication record',
    description: 'Add a new medication with prescription details. Requires NURSE or ADMIN role.',
  })
  @ApiResponse({
    status: 201,
    description: 'Medication created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Medication created successfully' },
        data: {
          type: 'object',
          properties: {
            medication: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation error',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires NURSE or ADMIN role',
  })
  async createMedication(@Body() createDto: CreateMedicationDto) {
    this.logger.log(`Creating medication: ${createDto.medicationName} for student ${createDto.studentId}`);

    const medication = await this.medicationService.createMedication(createDto);

    this.logger.log(`Medication created successfully: ${medication.id}`);

    return {
      success: true,
      message: 'Medication created successfully',
      data: {
        medication,
      },
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get medication details by ID',
    description: 'Retrieve complete medication information including prescription details.',
  })
  @ApiParam({
    name: 'id',
    description: 'Medication UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            medication: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Medication not found',
  })
  async getMedication(@Param('id') id: string) {
    this.logger.log(`Getting medication by ID: ${id}`);

    const medication = await this.medicationService.getMedicationById(id);

    return {
      success: true,
      data: {
        medication,
      },
    };
  }

  @Put(':id')
  @Roles('ADMIN', 'NURSE')
  @ApiOperation({
    summary: 'Update medication information',
    description: 'Modify dosage, frequency, or instructions. Requires NURSE or ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Medication UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Medication updated successfully' },
        data: {
          type: 'object',
          properties: {
            medication: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - No fields provided or validation error',
  })
  @ApiResponse({
    status: 404,
    description: 'Medication not found',
  })
  async updateMedication(
    @Param('id') id: string,
    @Body() updateDto: UpdateMedicationDto,
  ) {
    this.logger.log(`Updating medication: ${id}`);

    const medication = await this.medicationService.updateMedication(id, updateDto);

    this.logger.log(`Medication updated successfully: ${id}`);

    return {
      success: true,
      message: 'Medication updated successfully',
      data: {
        medication,
      },
    };
  }

  @Post(':id/deactivate')
  @Roles('ADMIN', 'NURSE')
  @ApiOperation({
    summary: 'Deactivate medication (soft delete)',
    description: 'Soft delete medication with reason and type for audit trail. Requires NURSE or ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Medication UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication deactivated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Medication deactivated successfully' },
        data: {
          type: 'object',
          properties: {
            medication: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Medication not found',
  })
  async deactivateMedication(
    @Param('id') id: string,
    @Body() deactivateDto: DeactivateMedicationDto,
  ) {
    this.logger.log(`Deactivating medication: ${id} - Reason: ${deactivateDto.reason}`);

    const medication = await this.medicationService.deactivateMedication(id, deactivateDto);

    this.logger.log(`Medication deactivated successfully: ${id}`);

    return {
      success: true,
      message: 'Medication deactivated successfully',
      data: {
        medication,
      },
    };
  }

  @Post(':id/activate')
  @Roles('ADMIN', 'NURSE')
  @ApiOperation({
    summary: 'Reactivate medication',
    description: 'Restore previously deactivated medication. Requires NURSE or ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Medication UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication activated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Medication activated successfully' },
        data: {
          type: 'object',
          properties: {
            medication: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Medication not found',
  })
  async activateMedication(@Param('id') id: string) {
    this.logger.log(`Activating medication: ${id}`);

    const medication = await this.medicationService.activateMedication(id);

    this.logger.log(`Medication activated successfully: ${id}`);

    return {
      success: true,
      message: 'Medication activated successfully',
      data: {
        medication,
      },
    };
  }

  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get all medications for a student',
    description: 'Retrieve all medications prescribed to a specific student. PHI-protected endpoint.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Student medications retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            medications: { type: 'array', items: { type: 'object' } },
            pagination: {
              type: 'object',
              properties: {
                currentPage: { type: 'number' },
                itemsPerPage: { type: 'number' },
                totalItems: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })
  async getStudentMedications(
    @Param('studentId') studentId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('isActive') isActive?: boolean,
  ) {
    this.logger.log(`Getting medications for student: ${studentId} (isActive=${isActive})`);

    // Get medications for student with pagination
    const result = await this.medicationService.getMedicationsByStudent(
      studentId,
      page,
      limit,
    );

    // Filter by isActive if specified
    let medications = result.medications;
    if (isActive !== undefined) {
      medications = medications.filter(
        (med: any) => med.isActive === isActive,
      );
    }

    return {
      success: true,
      data: {
        medications,
        pagination: {
          currentPage: result.pagination.page,
          itemsPerPage: result.pagination.limit,
          totalItems: isActive !== undefined ? medications.length : result.pagination.total,
          totalPages: result.pagination.pages,
        },
      },
    };
  }
}
