/**
 * LOC: EDU-DOWN-HOUSING-ASSIGNMENT-CTRL
 * File: housing-assignment-controller.ts
 * Purpose: Housing Assignment REST Controller - Production-grade HTTP endpoints
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
  Logger,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  HousingAssignmentService,
  HousingAssignment,
  RoomAvailability,
  HousingPreference,
} from './housing-assignment-service';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';

@ApiTags('housing-assignment')
@ApiBearerAuth()
@Controller('housing-assignment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HousingAssignmentController {
  private readonly logger = new Logger(HousingAssignmentController.name);

  constructor(private readonly housingAssignmentService: HousingAssignmentService) {}

  @Post('assign')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Assign housing to student' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentId: { type: 'string' },
        dormitoryId: { type: 'string' },
        roomId: { type: 'string' },
        academicYear: { type: 'string' }
      }
    }
  })
  @ApiCreatedResponse({ description: 'Housing assigned', type: HousingAssignment })
  @ApiBadRequestResponse({ description: 'Invalid housing data' })
  async assignHousing(
    @Body('studentId', ParseUUIDPipe) studentId: string,
    @Body('dormitoryId', ParseUUIDPipe) dormitoryId: string,
    @Body('roomId', ParseUUIDPipe) roomId: string,
    @Body('academicYear') academicYear: string
  ): Promise<HousingAssignment> {
    return this.housingAssignmentService.assignHousing(studentId, dormitoryId, roomId, academicYear);
  }

  @Get('student/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get housing assignments for student' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Housing assignments retrieved', type: [HousingAssignment] })
  @ApiNotFoundResponse({ description: 'Student not found' })
  async getStudentHousing(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<HousingAssignment[]> {
    return this.housingAssignmentService.getStudentHousing(studentId);
  }

  @Get('availability/:dormitoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get available rooms in dormitory' })
  @ApiParam({ name: 'dormitoryId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Available rooms retrieved', type: [RoomAvailability] })
  async getAvailableRooms(
    @Param('dormitoryId', ParseUUIDPipe) dormitoryId: string
  ): Promise<RoomAvailability[]> {
    return this.housingAssignmentService.getAvailableRooms(dormitoryId);
  }

  @Put('assignments/:assignmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update housing assignment' })
  @ApiParam({ name: 'assignmentId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        dormitoryId: { type: 'string' },
        roomId: { type: 'string' },
        status: { type: 'string', enum: ['assigned', 'confirmed', 'pending', 'cancelled'] }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Assignment updated' })
  async updateHousingAssignment(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
    @Body() updates: Partial<HousingAssignment>
  ): Promise<HousingAssignment> {
    return this.housingAssignmentService.updateHousingAssignment(assignmentId, updates);
  }

  @Post('preferences')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit housing preferences' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentId: { type: 'string' },
        preferenceRanking: { type: 'array', items: { type: 'string' } },
        roomType: { type: 'string' },
        specialRequests: { type: 'string' }
      }
    }
  })
  @ApiCreatedResponse({ description: 'Preferences submitted', type: HousingPreference })
  async submitHousingPreference(
    @Body() preference: HousingPreference
  ): Promise<HousingPreference> {
    return this.housingAssignmentService.submitHousingPreference(preference);
  }

  @Get('preferences/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get student housing preferences' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Preferences retrieved' })
  @ApiNotFoundResponse({ description: 'Preferences not found' })
  async getHousingPreferences(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<HousingPreference | null> {
    return this.housingAssignmentService.getHousingPreferences(studentId);
  }

  @Put('assignments/:assignmentId/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm housing assignment' })
  @ApiParam({ name: 'assignmentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Assignment confirmed' })
  async confirmHousingAssignment(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string
  ): Promise<HousingAssignment> {
    return this.housingAssignmentService.confirmHousingAssignment(assignmentId);
  }

  @Delete('assignments/:assignmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel housing assignment' })
  @ApiParam({ name: 'assignmentId', type: 'string' })
  @ApiResponse({ status: 204, description: 'Assignment cancelled' })
  async cancelHousingAssignment(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string
  ): Promise<void> {
    return this.housingAssignmentService.cancelHousingAssignment(assignmentId);
  }

  @Get('occupancy/:dormitoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get dormitory occupancy statistics' })
  @ApiParam({ name: 'dormitoryId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Occupancy data retrieved' })
  async getDormitoryOccupancy(
    @Param('dormitoryId', ParseUUIDPipe) dormitoryId: string
  ): Promise<Record<string, any>> {
    return this.housingAssignmentService.getDormitoryOccupancy(dormitoryId);
  }

  @Get('report')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate housing assignment report' })
  @Query('academicYear') academicYear: string
  @ApiResponse({ status: 200, description: 'Report generated' })
  async generateHousingReport(
    @Query('academicYear') academicYear: string
  ): Promise<Record<string, any>> {
    return this.housingAssignmentService.generateHousingReport(academicYear);
  }
}
