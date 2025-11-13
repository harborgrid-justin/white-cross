import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MedicationInteractionService } from './medication-interaction.service';
import { CheckNewMedicationDto, InteractionCheckResultDto } from './dto';

import { BaseController } from '../common/base';
/**
 * Medication Interaction Controller
 * Provides endpoints for checking drug-drug interactions
 *
 * Migrated from backend/src/routes/enhancedFeatures.ts
 */
@ApiTags('medication-interaction')
@ApiBearerAuth()
@Controller('medication-interaction')
export class MedicationInteractionController extends BaseController {
  private readonly logger = new Logger(MedicationInteractionController.name);

  constructor(
    private readonly medicationInteractionService: MedicationInteractionService,
  ) {}

  /**
   * Check interactions in student's current medications
   * GET /medication-interaction/students/:studentId/check
   */
  @Get('students/:studentId/check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check student medication interactions',
    description:
      'Analyzes all current medications for a student to detect potential drug-drug interactions',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication interaction check completed',
    type: InteractionCheckResultDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async checkStudentMedications(
    @Param('studentId') studentId: string,
  ): Promise<InteractionCheckResultDto> {
    this.logger.log(
      `Checking medication interactions for student ${studentId}`,
    );
    return this.medicationInteractionService.checkStudentMedications(studentId);
  }

  /**
   * Check if new medication will interact with existing ones
   * POST /medication-interaction/students/:studentId/check-new
   */
  @Post('students/:studentId/check-new')
  @HttpCode(HttpStatus.OK)
  async checkNewMedication(
    @Param('studentId') studentId: string,
    @Body() checkNewMedicationDto: CheckNewMedicationDto,
  ): Promise<InteractionCheckResultDto> {
    this.logger.log(
      `Checking new medication ${checkNewMedicationDto.medicationName} for student ${studentId}`,
    );
    return this.medicationInteractionService.checkNewMedication(
      studentId,
      checkNewMedicationDto.medicationName,
    );
  }

  /**
   * Get interaction recommendations for a student
   * GET /medication-interaction/students/:studentId/recommendations
   */
  @Get('students/:studentId/recommendations')
  @HttpCode(HttpStatus.OK)
  async getInteractionRecommendations(
    @Param('studentId') studentId: string,
  ): Promise<{ recommendations: string[] }> {
    this.logger.log(
      `Getting interaction recommendations for student ${studentId}`,
    );
    const recommendations =
      await this.medicationInteractionService.getInteractionRecommendations(
        studentId,
      );
    return { recommendations };
  }
}
