/**
 * LOC: EDU-DOWN-REGISTRAR-OFFICE-CTRL
 * File: registrar-office-controller.ts
 * Purpose: Registrar Office REST Controller - Production-grade HTTP endpoints
 */

import {
  Controller,
  Get,
  Post,
  Put,
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
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  RegistrarOfficeService,
  StudentRecord,
  AcademicTranscript,
  RegistrationPeriod,
} from './registrar-office-service';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';

@ApiTags('registrar-office')
@ApiBearerAuth()
@Controller('registrar-office')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RegistrarOfficeController {
  private readonly logger = new Logger(RegistrarOfficeController.name);

  constructor(private readonly registrarOfficeService: RegistrarOfficeService) {}

  @Get('students/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get student record from registrar' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiOkResponse({ description: 'Student record retrieved', type: StudentRecord })
  @ApiNotFoundResponse({ description: 'Student not found' })
  async getStudentRecord(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<StudentRecord> {
    return this.registrarOfficeService.getStudentRecord(studentId);
  }

  @Put('students/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update student record' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiBody({
    type: StudentRecord,
    description: 'Updated student record'
  })
  @ApiResponse({ status: 200, description: 'Record updated' })
  @ApiBadRequestResponse({ description: 'Invalid student data' })
  async updateStudentRecord(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() updates: Partial<StudentRecord>
  ): Promise<StudentRecord> {
    return this.registrarOfficeService.updateStudentRecord(studentId, updates);
  }

  @Post('transcripts/:studentId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate academic transcript' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @Query('official', 'boolean')
  @ApiResponse({ status: 201, description: 'Transcript generated', type: AcademicTranscript })
  @ApiBadRequestResponse({ description: 'Failed to generate transcript' })
  async generateTranscript(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Query('official') official?: string
  ): Promise<AcademicTranscript> {
    const officialCopy = official === 'true';
    return this.registrarOfficeService.generateTranscript(studentId, officialCopy);
  }

  @Get('registration-periods')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all registration periods' })
  @ApiResponse({ status: 200, description: 'Registration periods retrieved', type: [RegistrationPeriod] })
  async getRegistrationPeriods(): Promise<RegistrationPeriod[]> {
    return this.registrarOfficeService.getRegistrationPeriods();
  }

  @Get('registration-periods/active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get active registration period' })
  @ApiResponse({ status: 200, description: 'Active registration period retrieved' })
  async getActiveRegistrationPeriod(): Promise<RegistrationPeriod | null> {
    return this.registrarOfficeService.getActiveRegistrationPeriod();
  }

  @Post('address-change/:studentId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request address change' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newAddress: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Address change requested' })
  async requestAddressChange(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body('newAddress') newAddress: string
  ): Promise<Record<string, any>> {
    return this.registrarOfficeService.requestAddressChange(studentId, newAddress);
  }

  @Post('name-change/:studentId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request name change' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newName: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Name change requested' })
  async requestNameChange(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body('newName') newName: string
  ): Promise<Record<string, any>> {
    return this.registrarOfficeService.requestNameChange(studentId, newName);
  }

  @Get('verify-enrollment/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify student enrollment' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Enrollment verified' })
  async verifyEnrollment(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<{ verified: boolean; message: string }> {
    return this.registrarOfficeService.verifyEnrollment(studentId);
  }

  @Get('degree-audit/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get degree audit for student' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Degree audit retrieved' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  async getDegreeAudit(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<Record<string, any>> {
    return this.registrarOfficeService.getDegreeAudit(studentId);
  }

  @Post('drop-request/:studentId/:courseId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit course drop request' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiParam({ name: 'courseId', type: 'string' })
  @ApiResponse({ status: 201, description: 'Drop request submitted' })
  async submitDropRequest(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string
  ): Promise<Record<string, any>> {
    return this.registrarOfficeService.submitDropRequest(studentId, courseId);
  }

  @Get('registration-status/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get student registration status' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Registration status retrieved' })
  @ApiNotFoundResponse({ description: 'Registration status not found' })
  async getRegistrationStatus(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<Record<string, any>> {
    return this.registrarOfficeService.getRegistrationStatus(studentId);
  }
}
