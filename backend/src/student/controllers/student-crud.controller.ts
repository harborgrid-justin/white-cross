/**
 * @fileoverview Student CRUD Controller
 * @description HTTP endpoints for basic student CRUD operations
 * @module student/controllers/student-crud.controller
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth';
import { StudentService } from '../student.service';
import type { PaginatedResponse } from '../types';
import { CreateStudentDto } from '../dto/create-student.dto';
import { StudentFilterDto } from '../dto/student-filter.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Student } from '@/database';

import { BaseController } from '../../../common/base';
/**
 * Student CRUD Controller
 *
 * Handles basic CRUD operations for student management:
 * - Create new students
 * - Retrieve students (single, paginated list)
 * - Update student information
 * - Delete students (soft delete)
 */
@ApiTags('students')
@Controller('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StudentCrudController extends BaseController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Create a new student
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new student',
    description:
      'Creates a new student record with validation. Student number and medical record number must be unique.',
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
    description:
      'Retrieves paginated list of students with optional filters (search, grade, nurse, active status)',
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
  async findAll(@Query() filterDto: StudentFilterDto): Promise<PaginatedResponse<Student>> {
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
    description:
      'Updates student information. All fields are optional. Validates uniqueness constraints.',
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
    description:
      'Soft deletes a student by setting isActive to false. Does not permanently remove data.',
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
}