/**
 * @fileoverview Advanced Features Controller
 * @module advanced-features/advanced-features.controller
 * @description HTTP endpoints for advanced healthcare features
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdvancedFeaturesService } from './advanced-features.service';
import { RecordScreeningDto } from './dto/record-screening.dto';
import { RecordMeasurementDto } from './dto/record-measurement.dto';
import { SendEmergencyNotificationDto } from './dto/send-emergency-notification.dto';
import { ScanBarcodeDto } from './dto/scan-barcode.dto';
import { VerifyMedicationAdministrationDto } from './dto/verify-medication-administration.dto';

@ApiTags('Advanced Features')
@Controller('advanced-features')
@ApiBearerAuth()
export class AdvancedFeaturesController {
  constructor(
    private readonly advancedFeaturesService: AdvancedFeaturesService,
  ) {}

  // ==================== Screening Endpoints ====================

  @Post('screenings')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Record health screening',
    description: 'Records a health screening (vision, hearing, scoliosis, etc.) for a student with comprehensive results tracking.',
  })
  @ApiResponse({
    status: 201,
    description: 'Screening recorded successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        studentId: { type: 'string', format: 'uuid' },
        screeningType: { type: 'string', example: 'VISION' },
        results: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid screening data - validation errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async recordScreening(@Body() screeningData: RecordScreeningDto) {
    return this.advancedFeaturesService.recordScreening(screeningData);
  }

  @Get('screenings/student/:studentId')
  @ApiOperation({
    summary: 'Get screening history',
    description: 'Retrieves complete screening history for a specific student including all screening types and results.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'screeningType',
    required: false,
    description: 'Filter by screening type (VISION, HEARING, SCOLIOSIS, etc.)',
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of records to return',
    type: 'number',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Screening history retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          screeningType: { type: 'string' },
          results: { type: 'object' },
          screenerName: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async getScreeningHistory(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ) {
    return this.advancedFeaturesService.getScreeningHistory(studentId);
  }

  // ==================== Growth Chart Endpoints ====================

  @Post('growth/measurements')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Record growth measurement',
    description: 'Records height, weight, and BMI measurements for student growth tracking.',
  })
  @ApiResponse({
    status: 201,
    description: 'Measurement recorded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid measurement data',
  })
  async recordMeasurement(@Body() measurementData: RecordMeasurementDto) {
    return this.advancedFeaturesService.recordMeasurement(measurementData);
  }

  @Get('growth/trend/:studentId')
  @ApiOperation({
    summary: 'Analyze growth trend',
    description: 'Analyzes growth trends for a student and generates recommendations.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Growth trend analysis completed',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async analyzeGrowthTrend(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ) {
    return this.advancedFeaturesService.analyzeGrowthTrend(studentId);
  }

  // ==================== Immunization Forecast Endpoints ====================

  @Get('immunization/forecast/:studentId')
  @ApiOperation({
    summary: 'Get immunization forecast',
    description: 'Generates immunization forecast showing upcoming, overdue, and completed immunizations.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Immunization forecast generated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async getImmunizationForecast(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ) {
    return this.advancedFeaturesService.getImmunizationForecast(studentId);
  }

  // ==================== Emergency Notification Endpoints ====================

  @Post('emergency/notifications')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Send emergency notification',
    description: 'Sends emergency notification via multiple channels (SMS, email, push, in-app).',
  })
  @ApiResponse({
    status: 201,
    description: 'Emergency notification sent successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid notification data',
  })
  async sendEmergencyNotification(
    @Body() notificationData: SendEmergencyNotificationDto,
  ) {
    return this.advancedFeaturesService.sendEmergencyNotification(
      notificationData,
    );
  }

  @Get('emergency/history')
  @ApiOperation({
    summary: 'Get emergency notification history',
    description: 'Retrieves emergency notification history, optionally filtered by student.',
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: 'Filter by student UUID',
    schema: { format: 'uuid' },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Limit number of results',
  })
  @ApiResponse({
    status: 200,
    description: 'Emergency history retrieved successfully',
  })
  async getEmergencyHistory(
    @Query('studentId') studentId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.advancedFeaturesService.getEmergencyHistory(studentId, limit);
  }

  // ==================== Barcode Scanning Endpoints ====================

  @Post('barcode/scan')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Scan barcode',
    description: 'Scans and identifies a barcode (student, medication, nurse, inventory, equipment).',
  })
  @ApiResponse({
    status: 200,
    description: 'Barcode scanned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid barcode data',
  })
  async scanBarcode(@Body() scanData: ScanBarcodeDto) {
    return this.advancedFeaturesService.scanBarcode(scanData);
  }

  @Post('barcode/verify-medication')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify medication administration',
    description:
      'Verifies medication administration using three-barcode scan (student, medication, nurse) with Five Rights Check.',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication administration verification completed',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid verification data',
  })
  async verifyMedicationAdministration(
    @Body() verificationData: VerifyMedicationAdministrationDto,
  ) {
    return this.advancedFeaturesService.verifyMedicationAdministration(
      verificationData,
    );
  }
}
