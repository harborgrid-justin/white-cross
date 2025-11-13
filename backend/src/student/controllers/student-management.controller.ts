/**
 * @fileoverview Student Management Controller
 * @description HTTP endpoints for student management operations
 * @module student/controllers/student-management.controller
 */

import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth';
import { StudentService } from '../student.service';
import { StudentBulkUpdateDto } from '../dto/bulk-update.dto';
import { TransferStudentDto } from '../dto/transfer-student.dto';

import { BaseController } from '../../common/base';
/**
 * Student Management Controller
 *
 * Handles student management operations:
 * - Activate/deactivate students
 * - Transfer students between nurses/grades
 * - Bulk update operations
 */
@ApiTags('students')
@Controller('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StudentManagementController extends BaseController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Deactivate student
   */
  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate student',
    description:
      'Deactivates a student by setting isActive to false. Optional reason can be provided.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'reason',
    description: 'Reason for deactivation',
    required: false,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Student deactivated successfully',
    type: 'Student',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async deactivate(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query('reason') reason?: string,
  ) {
    return this.studentService.deactivate(id, reason);
  }

  /**
   * Reactivate student
   */
  @Patch(':id/reactivate')
  @ApiOperation({
    summary: 'Reactivate student',
    description: 'Reactivates a previously deactivated student by setting isActive to true.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Student reactivated successfully',
    type: 'Student',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async reactivate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.studentService.reactivate(id);
  }

  /**
   * Transfer student
   */
  @Patch(':id/transfer')
  @ApiOperation({
    summary: 'Transfer student',
    description: 'Transfers student to a different nurse and/or grade level.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Student transferred successfully',
    type: 'Student',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Student or nurse not found',
  })
  async transfer(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() transferDto: TransferStudentDto,
  ) {
    return this.studentService.transfer(id, transferDto);
  }

  /**
   * Bulk update students
   */
  @Post('bulk-update')
  @ApiOperation({
    summary: 'Bulk update students',
    description: 'Updates multiple students with the same data (nurse, grade, or active status).',
  })
  @ApiResponse({
    status: 200,
    description: 'Students updated successfully',
    schema: {
      type: 'object',
      properties: {
        updated: { type: 'number', example: 15 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async bulkUpdate(@Body() bulkUpdateDto: StudentBulkUpdateDto) {
    return this.studentService.bulkUpdate(bulkUpdateDto);
  }
}
