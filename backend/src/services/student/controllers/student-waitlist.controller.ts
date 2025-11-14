/**
 * @fileoverview Student Waitlist Controller
 * @description HTTP endpoints for student waitlist operations
 * @module student/controllers/student-waitlist.controller
 */

import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards, Version } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/services/auth';
import { StudentService } from '../student.service';
import { AddWaitlistDto } from '../dto/add-waitlist.dto';
import { WaitlistPriorityDto } from '../dto/waitlist-priority.dto';

import { BaseController } from '@/common/base';
/**
 * Student Waitlist Controller
 *
 * Handles student waitlist operations:
 * - Add students to waitlist
 * - Manage waitlist priorities
 * - Process waitlist admissions
 * - Remove from waitlist
 */
@ApiTags('students')

@Controller('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StudentWaitlistController extends BaseController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Add student to waitlist
   */
  @Post(':id/waitlist')
  @ApiOperation({
    summary: 'Add student to enrollment waitlist',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Adds a student to the enrollment waitlist with priority ranking. Used when school capacity is reached. Requires ADMIN or COUNSELOR role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Student added to waitlist successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or student already enrolled',
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
    description: 'Student already on waitlist',
  })
  async addToWaitlist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() addToWaitlistDto: AddWaitlistDto,
  ): Promise<any> {
    return await this.studentService.addStudentToWaitlist(id, addToWaitlistDto);
  }

  /**
   * Update waitlist priority
   */
  @Put(':id/waitlist/priority')
  @ApiOperation({
    summary: 'Update student waitlist priority',
    description:
      "HIGHLY SENSITIVE PHI ENDPOINT - Updates a student's priority position on the waitlist. Used for special circumstances or sibling preferences. Requires ADMIN role.",
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Waitlist priority updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid priority',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found on waitlist',
  })
  async updateWaitlistPriority(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() priorityDto: WaitlistPriorityDto,
  ): Promise<any> {
    return await this.studentService.updateWaitlistPriority(id, priorityDto);
  }

  /**
   * Admit student from waitlist
   */
  @Post(':id/waitlist/admit')
  @ApiOperation({
    summary: 'Admit student from waitlist to enrollment',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Processes admission of a student from the waitlist to active enrollment. Updates enrollment records and removes from waitlist. Requires ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Student admitted from waitlist successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or admission failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found on waitlist',
  })
  async admitFromWaitlist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<any> {
    return await this.studentService.admitStudentFromWaitlist(id);
  }

  /**
   * Remove student from waitlist
   */
  @Delete(':id/waitlist')
  @ApiOperation({
    summary: 'Remove student from waitlist',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Removes a student from the enrollment waitlist. Used when student enrolls elsewhere or family withdraws application. Requires ADMIN or COUNSELOR role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Student removed from waitlist successfully',
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
    description: 'Student not found on waitlist',
  })
  async removeFromWaitlist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<any> {
    return await this.studentService.removeStudentFromWaitlist(id);
  }

  /**
   * Get waitlist status
   */
  @Get(':id/waitlist')
  @ApiOperation({
    summary: 'Get student waitlist status and position',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Returns current waitlist status, position, priority, and estimated admission timeline for a student.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Waitlist status retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found on waitlist',
  })
  async getWaitlistStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<any> {
    return await this.studentService.getStudentWaitlistStatus(id);
  }

  /**
   * Get waitlist overview
   */
  @Get('waitlist/overview')
  @ApiOperation({
    summary: 'Get waitlist overview and statistics',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Returns comprehensive waitlist statistics including total students, grade distribution, priority breakdown, and estimated wait times. Requires ADMIN role.',
  })
  @ApiQuery({
    name: 'grade',
    required: false,
    description: 'Filter by grade level',
  })
  @ApiResponse({
    status: 200,
    description: 'Waitlist overview retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires ADMIN role',
  })
  async getWaitlistOverview(@Query('grade') grade?: string): Promise<any> {
    return await this.studentService.getWaitlistOverview(grade);
  }
}
