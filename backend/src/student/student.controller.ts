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
import type { PaginatedResponse, StudentStatistics, StudentDataExport } from './dto';
import { Student } from '../database/models/student.model';
import {
  CreateStudentDto,
  UpdateStudentDto,
  StudentFilterDto,
  TransferStudentDto,
  StudentBulkUpdateDto,
  StudentHealthRecordsDto,
  MentalHealthRecordsDto,
  UploadPhotoDto,
  SearchPhotoDto,
  ImportTranscriptDto,
  AcademicHistoryDto,
  PerformanceTrendsDto,
  BulkGradeTransitionDto,
  GraduatingStudentsDto,
  StudentScanBarcodeDto,
  VerifyMedicationDto,
  AddWaitlistDto,
  WaitlistStatusDto,
} from './dto';

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
  async bulkUpdate(@Body() bulkUpdateDto: StudentBulkUpdateDto) {
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
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/Student' },
    },
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
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/Student' },
    },
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
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/Student' },
    },
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
  async getStatistics(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<StudentStatistics> {
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
  async exportData(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<StudentDataExport> {
    return this.studentService.exportData(id);
  }

  // ==================== Health Records Access Endpoints ====================

  /**
   * Get student health records
   */
  @Get(':id/health-records')
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

  // ==================== Photo Management Endpoints ====================

  /**
   * Upload student photo
   */
  @Post(':id/photo')
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

  // ==================== Academic Transcript Endpoints ====================

  /**
   * Import academic transcript
   */
  @Post(':id/transcript')
  @ApiOperation({
    summary: 'Import academic transcript for student',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Imports academic transcript data including grades, courses, GPA, and attendance records. Validates transcript format and calculates academic metrics. Requires ADMIN or COUNSELOR role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Academic transcript imported successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid transcript format',
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
  async importTranscript(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() importTranscriptDto: ImportTranscriptDto,
  ) {
    return this.studentService.importAcademicTranscript(id, importTranscriptDto);
  }

  /**
   * Get academic history
   */
  @Get(':id/academic-history')
  @ApiOperation({
    summary: 'Get complete academic history for student',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Returns comprehensive academic history including all transcripts, grades, courses, and academic achievements. Used for academic planning and college applications.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Academic history retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async getAcademicHistory(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() query: AcademicHistoryDto,
  ) {
    return this.studentService.getAcademicHistory(id, query);
  }

  /**
   * Get performance trends
   */
  @Get(':id/performance-trends')
  @ApiOperation({
    summary: 'Analyze academic performance trends for student',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Analyzes academic performance over time including GPA trends, subject performance patterns, and attendance correlation. Provides insights for intervention planning.',
  })
  @ApiParam({
    name: 'id',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Performance trends analyzed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found or insufficient data',
  })
  async getPerformanceTrends(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() query: PerformanceTrendsDto,
  ) {
    return this.studentService.getPerformanceTrends(id, query);
  }

  // ==================== Grade Transition Endpoints ====================

  /**
   * Perform bulk grade transition
   */
  @Post('grade-transitions/bulk')
  @ApiOperation({
    summary: 'Perform bulk grade transition for end of school year',
    description:
      'Processes grade level transitions for all eligible students. Includes promotion criteria validation, retention decisions, and graduation processing. Can be run in dry-run mode for testing. Requires ADMIN role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk grade transition completed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or transition criteria not met',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires ADMIN role',
  })
  async performBulkGradeTransition(@Body() bulkGradeTransitionDto: BulkGradeTransitionDto) {
    return this.studentService.performBulkGradeTransition(bulkGradeTransitionDto);
  }

  /**
   * Get graduating students
   */
  @Get('graduating')
  @ApiOperation({
    summary: 'Get list of students eligible for graduation',
    description:
      'Returns students who meet graduation requirements including credit requirements, assessment scores, and attendance thresholds. Used for graduation planning and ceremonies.',
  })
  @ApiResponse({
    status: 200,
    description: 'Graduating students list retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getGraduatingStudents(@Query() query: GraduatingStudentsDto) {
    return this.studentService.getGraduatingStudents(query);
  }

  // ==================== Barcode Scanning Endpoints ====================

  /**
   * Scan barcode
   */
  @Post('barcode/scan')
  @ApiOperation({
    summary: 'Scan and decode barcode for student/medication identification',
    description:
      'Scans various barcode formats (Code 128, QR, Data Matrix) to identify students, medications, or equipment. Returns decoded information and associated records. Used for quick identification and medication administration.',
  })
  @ApiResponse({
    status: 200,
    description: 'Barcode scanned and decoded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid barcode format or unrecognized code',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Barcode not found in system',
  })
  async scanBarcode(@Body() scanBarcodeDto: StudentScanBarcodeDto) {
    return this.studentService.scanBarcode(scanBarcodeDto);
  }

  /**
   * Verify medication administration using three-point barcode verification
   */
  @Post('barcode/verify-medication')
  @ApiOperation({
    summary: 'Verify medication administration using three-point barcode verification',
    description:
      'HIGHLY SENSITIVE PHI ENDPOINT - Implements five rights of medication administration using barcode verification: Right Patient (student barcode), Right Medication (medication barcode), and Right Person (nurse barcode). Critical safety feature for medication administration.',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication administration verified successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Verification failed - barcode mismatch or safety violation',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires NURSE role',
  })
  @ApiResponse({
    status: 404,
    description: 'Student, medication, or nurse not found',
  })
  async verifyMedicationAdministration(@Body() verifyMedicationDto: VerifyMedicationDto) {
    return this.studentService.verifyMedicationAdministration(verifyMedicationDto);
  }

  // ==================== Waitlist Management Endpoints ====================

  /**
   * Add student to waitlist
   */
  @Post('waitlist')
  @ApiOperation({
    summary: 'Add student to appointment waitlist',
    description:
      'Adds student to waitlist for specific appointment types when no immediate slots are available. Includes priority levels and automatic notification when slots become available.',
  })
  @ApiResponse({
    status: 201,
    description: 'Student added to waitlist successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or student already on waitlist',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async addToWaitlist(@Body() addWaitlistDto: AddWaitlistDto) {
    return this.studentService.addStudentToWaitlist(addWaitlistDto);
  }

  /**
   * Get waitlist status for student
   */
  @Get(':id/waitlist-status')
  @ApiOperation({
    summary: 'Get waitlist status for student',
    description:
      'Returns current waitlist positions and estimated wait times for all appointment types the student is waitlisted for.',
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
    description: 'Student not found',
  })
  async getWaitlistStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() query: WaitlistStatusDto,
  ) {
    return this.studentService.getStudentWaitlistStatus(id, query);
  }
}
