/**
 * @fileoverview Student Core Controller
 * @module student/controllers/student-core.controller
 * @description HTTP endpoints for basic student CRUD operations
 */

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, UseInterceptors, Version } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth';
import { HealthRecordAuditInterceptor } from '@/health-record/interceptors';
import { StudentCrudService } from '../services/student-crud.service';
import type { PaginatedResponse } from '../types';
import { CreateStudentDto } from '../dto/create-student.dto';
import { StudentFilterDto } from '../dto/student-filter.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Student } from '@/database';

import { BaseController } from '@/common/base';
/**
 * Student Core Controller
 *
 * Handles basic CRUD operations for students:
 * - Create new students
 * - Retrieve students (single, paginated list)
 * - Update student information
 * - Delete students
 */
@ApiTags('students-core')
@ApiBearerAuth()

@Version('1')
@Controller('students')
@UseGuards(JwtAuthGuard)
@UseInterceptors(HealthRecordAuditInterceptor)
export class StudentCoreController extends BaseController {
  constructor(private readonly crudService: StudentCrudService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully',
    type: Student,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'Conflict - student number already exists' })
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.crudService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of students' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Sort order (asc/desc)',
  })
  @ApiResponse({
    status: 200,
    description: 'Students retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Student' }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async findAll(@Query() filterDto: StudentFilterDto): Promise<PaginatedResponse<Student>> {
    return this.crudService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Student found', type: Student })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Student> {
    return this.crudService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Student updated successfully', type: Student })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 409, description: 'Conflict - student number already exists' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return this.crudService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a student' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Student deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.crudService.remove(id);
  }
}