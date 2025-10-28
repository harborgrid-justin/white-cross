/**
 * @fileoverview Student Controller
 * @module student/student.controller
 * @description HTTP endpoints for student management with Swagger documentation
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentFilterDto } from './dto/student-filter.dto';
import { TransferStudentDto } from './dto/transfer-student.dto';
import { BulkUpdateDto } from './dto/bulk-update.dto';

/**
 * Student Controller
 *
 * Handles all HTTP endpoints for student management:
 * - CRUD operations
 * - Search and filtering
 * - Student transfers
 * - Bulk operations
 * - Statistics and exports
 */
@ApiTags('students')
@Controller('students')
// @ApiBearerAuth() // Uncomment when authentication is implemented
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // ==================== CRUD Endpoints ====================

  /**
   * Create a new student
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new student',
    description: 'Creates a new student record with validation. Student number and medical record number must be unique.',
  })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully',
    type: 'Student',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data (validation errors)',
  })
  @ApiResponse({
    status: 409,
    description: 'Student number or medical record number already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  /**
   * Get all students with filters and pagination
   */
  @Get()
  @ApiOperation({
    summary: 'Get all students',
    description: 'Retrieves paginated list of students with optional filters (search, grade, nurse, active status)',
  })
  @ApiResponse({
    status: 200,
    description: 'Students retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Student' },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            total: { type: 'number', example: 150 },
            pages: { type: 'number', example: 8 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll(@Query() filterDto: StudentFilterDto) {
    return this.studentService.findAll(filterDto);
  }

  /**
   * Get student by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get student by ID',
    description: 'Retrieves a single student by their UUID with full profile information',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Student retrieved successfully',
    type: 'Student',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.studentService.findOne(id);
  }

  /**
   * Update student
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update student',
    description: 'Updates student information. All fields are optional. Validates uniqueness constraints.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully',
    type: 'Student',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Student number or medical record number already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }

  /**
   * Delete student (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete student',
    description: 'Soft deletes a student by setting isActive to false. Does not permanently remove data.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 204,
    description: 'Student deleted successfully (soft delete)',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.studentService.remove(id);
  }

  // ==================== Student Management Endpoints ====================

  /**
   * Deactivate student
   */
  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate student',
    description: 'Deactivates a student by setting isActive to false. Optional reason can be provided.',
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
  async bulkUpdate(@Body() bulkUpdateDto: BulkUpdateDto) {
    return this.studentService.bulkUpdate(bulkUpdateDto);
  }

  // ==================== Query Endpoints ====================

  /**
   * Search students
   */
  @Get('search/query')
  @ApiOperation({
    summary: 'Search students',
    description: 'Full-text search across firstName, lastName, and studentNumber fields.',
  })
  @ApiQuery({
    name: 'q',
    description: 'Search query string',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of results',
    required: false,
    type: 'number',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Search results',
    type: ['Student'],
  })
  async search(@Query('q') query: string, @Query('limit') limit?: number) {
    return this.studentService.search(query, limit);
  }

  /**
   * Get all grades
   */
  @Get('grades/list')
  @ApiOperation({
    summary: 'Get all grades',
    description: 'Retrieves list of all unique grade levels currently in use by active students.',
  })
  @ApiResponse({
    status: 200,
    description: 'Grades retrieved successfully',
    schema: {
      type: 'array',
      items: { type: 'string' },
      example: ['K', '1', '2', '3', '4', '5'],
    },
  })
  async getAllGrades() {
    return this.studentService.findAllGrades();
  }

  /**
   * Get students by grade
   */
  @Get('grade/:grade')
  @ApiOperation({
    summary: 'Get students by grade',
    description: 'Retrieves all active students in a specific grade level.',
  })
  @ApiParam({
    name: 'grade',
    description: 'Grade level',
    type: 'string',
    example: '3',
  })
  @ApiResponse({
    status: 200,
    description: 'Students retrieved successfully',
    type: ['Student'],
  })
  async findByGrade(@Param('grade') grade: string) {
    return this.studentService.findByGrade(grade);
  }

  /**
   * Get assigned students for a nurse
   */
  @Get('nurse/:nurseId')
  @ApiOperation({
    summary: 'Get assigned students',
    description: 'Retrieves all active students assigned to a specific nurse.',
  })
  @ApiParam({
    name: 'nurseId',
    description: 'Nurse UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Assigned students retrieved successfully',
    type: ['Student'],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  async findAssignedStudents(@Param('nurseId', new ParseUUIDPipe({ version: '4' })) nurseId: string) {
    return this.studentService.findAssignedStudents(nurseId);
  }

  // ==================== Analytics & Export Endpoints ====================

  /**
   * Get student statistics
   */
  @Get(':id/statistics')
  @ApiOperation({
    summary: 'Get student statistics',
    description: 'Retrieves aggregated statistics for a student (health records, allergies, medications, etc.).',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        healthRecords: { type: 'number', example: 25 },
        allergies: { type: 'number', example: 2 },
        medications: { type: 'number', example: 1 },
        appointments: { type: 'number', example: 8 },
        incidents: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async getStatistics(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.studentService.getStatistics(id);
  }

  /**
   * Export student data
   */
  @Get(':id/export')
  @ApiOperation({
    summary: 'Export student data',
    description: 'Generates comprehensive data export for a student including full profile and statistics.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Data exported successfully',
    schema: {
      type: 'object',
      properties: {
        exportDate: { type: 'string', format: 'date-time' },
        student: { $ref: '#/components/schemas/Student' },
        statistics: {
          type: 'object',
          properties: {
            healthRecords: { type: 'number' },
            allergies: { type: 'number' },
            medications: { type: 'number' },
            appointments: { type: 'number' },
            incidents: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async exportData(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.studentService.exportData(id);
  }
}
