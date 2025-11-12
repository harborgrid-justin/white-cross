/**
 * @fileoverview Student Photo Controller
 * @description HTTP endpoints for student photo management
 * @module student/controllers/student-photo.controller
 */

import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '@/auth';
import { HealthRecordAuditInterceptor } from '@/health-record/interceptors';
import { StudentService } from '../student.service';
import { SearchPhotoDto } from '../dto/search-photo.dto';
import { UploadPhotoDto } from '../dto/upload-photo.dto';

/**
 * Student Photo Controller
 *
 * Handles student photo management operations:
 * - Upload student photos with facial recognition
 * - Search students by photo using facial recognition
 *
 * All operations are audited due to PHI sensitivity.
 */
@ApiTags('students')
@Controller('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StudentPhotoController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Upload student photo
   */
  @Post(':id/photo')
  @UseInterceptors(HealthRecordAuditInterceptor)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: 'Upload student photo',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Uploads and stores student photo with metadata. Includes facial recognition indexing for identification purposes. Requires NURSE or ADMIN role. All photo uploads are audited.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Student photo uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid image format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires NURSE or ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async uploadPhoto(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() uploadPhotoDto: UploadPhotoDto,
  ) {
    return this.studentService.uploadStudentPhoto(id, uploadPhotoDto);
  }

  /**
   * Search students by photo using facial recognition
   */
  @Post('photo/search')
  @UseInterceptors(HealthRecordAuditInterceptor)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Search for student by photo using facial recognition',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Uses facial recognition to identify students from uploaded photos. Returns potential matches with confidence scores. Used for student identification in emergency situations or when student ID is unknown.',
  })
  @ApiResponse({
    status: 200,
    description: 'Photo search completed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid image format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires NURSE or ADMIN role',
  })
  async searchByPhoto(@Body() searchPhotoDto: SearchPhotoDto) {
    return this.studentService.searchStudentsByPhoto(searchPhotoDto);
  }
}
