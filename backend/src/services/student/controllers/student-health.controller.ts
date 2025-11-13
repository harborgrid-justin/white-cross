/**
 * @fileoverview Student Health Controller
 * @description HTTP endpoints for student health records access (PHI)
 * @module student/controllers/student-health.controller
 */

import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth';
import { HealthRecordAuditInterceptor } from '@/health-record/interceptors';
import { StudentService } from '../student.service';
import { MentalHealthRecordsDto } from '../dto/mental-health-records.dto';
import { StudentHealthRecordsDto } from '../dto/student-health-records.dto';

import { BaseController } from '@/common/base';
/**
 * Student Health Controller
 *
 * Handles sensitive health records access (PHI):
 * - Student health records with audit logging
 * - Mental health records with extra protection
 *
 * All endpoints require proper authorization and audit PHI access.
 */
@ApiTags('students')
@Controller('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StudentHealthController extends BaseController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Get student health records
   */
  @Get(':id/health-records')
  @UseInterceptors(HealthRecordAuditInterceptor)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get student health records',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Returns paginated list of all health records for a student including medications, allergies, immunizations, and visit logs. Full audit trail maintained. Requires assigned nurse or admin access.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Health records retrieved successfully with pagination',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Must be assigned nurse or admin',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async getHealthRecords(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() query: StudentHealthRecordsDto,
  ) {
    return this.studentService.getStudentHealthRecords(id, query.page, query.limit);
  }

  /**
   * Get student mental health records
   */
  @Get(':id/mental-health-records')
  @UseInterceptors(HealthRecordAuditInterceptor)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get student mental health records',
    description:
      'EXTREMELY SENSITIVE PHI ENDPOINT - Returns paginated mental health records including counseling sessions, behavioral assessments, and crisis interventions. Extra protection due to stigma concerns. Strict access control - mental health specialist or admin only. All access logged for compliance and ethical review.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Mental health records retrieved successfully with pagination',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Mental health specialist or admin role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async getMentalHealthRecords(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() query: MentalHealthRecordsDto,
  ) {
    return this.studentService.getStudentMentalHealthRecords(id, query.page, query.limit);
  }
}
