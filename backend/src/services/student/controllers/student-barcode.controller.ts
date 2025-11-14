/**
 * @fileoverview Student Barcode Controller
 * @description HTTP endpoints for student barcode operations
 * @module student/controllers/student-barcode.controller
 */

import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth';
import { StudentService } from '../student.service';
import { GenerateBarcodeDto } from '../dto/generate-barcode.dto';
import { VerifyBarcodeDto } from '../dto/verify-barcode.dto';

import { BaseController } from '@/common/base';
/**
 * Student Barcode Controller
 *
 * Handles student barcode operations:
 * - Generate student barcodes
 * - Verify barcode scans
 * - Get barcode information
 */
@ApiTags('students')

@Version('1')
@Controller('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StudentBarcodeController extends BaseController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Generate barcode for student
   */
  @Post(':id/barcode')
  @ApiOperation({
    summary: 'Generate barcode for student',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Generates a unique barcode for student identification. Used for attendance tracking, cafeteria access, and library systems. Requires ADMIN or COUNSELOR role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Barcode generated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or barcode generation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires ADMIN or COUNSELOR role',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Student already has an active barcode',
  })
  async generateBarcode(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() generateBarcodeDto: GenerateBarcodeDto,
  ): Promise<any> {
    return await this.studentService.generateStudentBarcode(id, generateBarcodeDto);
  }

  /**
   * Verify barcode scan
   */
  @Post('verify-barcode')
  @ApiOperation({
    summary: 'Verify barcode scan for student identification',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Verifies a barcode scan and returns student information. Used by attendance systems, cafeteria POS, and security checkpoints.',
  })
  @ApiResponse({
    status: 200,
    description: 'Barcode verified successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid barcode or verification failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Barcode not found or inactive',
  })
  async verifyBarcode(@Body() verifyBarcodeDto: VerifyBarcodeDto): Promise<any> {
    return await this.studentService.verifyStudentBarcode(verifyBarcodeDto);
  }

  /**
   * Get barcode information
   */
  @Get(':id/barcode')
  @ApiOperation({
    summary: 'Get barcode information for student',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Returns current barcode information including status, generation date, and usage statistics.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Barcode information retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found or no barcode assigned',
  })
  async getBarcodeInfo(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<any> {
    return await this.studentService.getStudentBarcodeInfo(id);
  }

  /**
   * Deactivate barcode
   */
  @Put(':id/barcode/deactivate')
  @ApiOperation({
    summary: 'Deactivate student barcode',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Deactivates a student barcode. Used when barcode is lost, stolen, or student graduates/transfers. Requires ADMIN or COUNSELOR role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Barcode deactivated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires ADMIN or COUNSELOR role',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found or no active barcode',
  })
  async deactivateBarcode(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<any> {
    return await this.studentService.deactivateStudentBarcode(id);
  }
}
