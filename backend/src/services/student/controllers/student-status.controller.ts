/**
 * @fileoverview Student Status Controller
 * @module student/controllers/student-status.controller
 * @description HTTP endpoints for student status management operations
 */

import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth';
import { HealthRecordAuditInterceptor } from '@/health-record/interceptors';
import { StudentStatusService } from '@/services/student-status.service';
import { TransferStudentDto } from '../dto/transfer-student.dto';
import { Student } from '@/database';

import { BaseController } from '@/common/base';
/**
 * Student Status Controller
 *
 * Handles student status management operations:
 * - Deactivate/reactivate students
 * - Transfer students between schools
 */
@ApiTags('students-status')
@ApiBearerAuth()
@Controller('students')
@UseGuards(JwtAuthGuard)
@UseInterceptors(HealthRecordAuditInterceptor)
export class StudentStatusController extends BaseController {
  constructor(private readonly statusService: StudentStatusService) {}

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a student' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Student deactivated successfully', type: Student })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason?: string,
  ): Promise<Student> {
    return await this.statusService.deactivate(id, reason);
  }

  @Patch(':id/reactivate')
  @ApiOperation({ summary: 'Reactivate a student' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Student reactivated successfully', type: Student })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async reactivate(@Param('id', ParseUUIDPipe) id: string): Promise<Student> {
    return await this.statusService.reactivate(id);
  }

  @Patch(':id/transfer')
  @ApiOperation({ summary: 'Transfer a student to another school' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Student transferred successfully', type: Student })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async transfer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() transferDto: TransferStudentDto,
  ): Promise<Student> {
    return await this.statusService.transfer(id, transferDto);
  }
}