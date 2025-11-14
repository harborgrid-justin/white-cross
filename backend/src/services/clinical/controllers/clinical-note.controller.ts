import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClinicalNoteService } from '../services/clinical-note.service';
import { CreateNoteDto } from '../dto/note/create-note.dto';
import { UpdateNoteDto } from '../dto/note/update-note.dto';
import { NoteFiltersDto } from '../dto/note/note-filters.dto';

import { BaseController } from '@/common/base';
@ApiTags('Clinical - Clinical Notes')
@ApiBearerAuth()

@Controller('clinical/notes')
export class ClinicalNoteController extends BaseController {
  constructor(private readonly noteService: ClinicalNoteService) {}

  @Post()
  @ApiOperation({
    summary: 'Create clinical note',
    description:
      'Creates a new clinical note for documenting student health visits, assessments, treatments, and clinical decisions. Supports structured SOAP format and free-text documentation.',
  })
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({
    status: 201,
    description: 'Clinical note created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Student or visit not found' })
  async create(@Body() createDto: CreateNoteDto) {
    return this.noteService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Query clinical notes',
    description:
      'Retrieves clinical notes with filtering options by student, visit, date range, note type, or clinical staff. Supports pagination and sorting for large datasets.',
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: 'Filter by student ID',
  })
  @ApiQuery({
    name: 'visitId',
    required: false,
    description: 'Filter by visit ID',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for filtering',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for filtering',
  })
  @ApiQuery({
    name: 'noteType',
    required: false,
    description: 'Filter by note type (SOAP, Progress, Assessment)',
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    description: 'Filter by note author ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Clinical notes retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() filters: NoteFiltersDto) {
    return this.noteService.findAll(filters);
  }

  @Get('visit/:visitId')
  @ApiOperation({
    summary: 'Get notes for a visit',
    description:
      'Retrieves all clinical notes associated with a specific student visit. Returns notes in chronological order with author information and electronic signatures.',
  })
  @ApiParam({ name: 'visitId', description: 'Visit UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Visit clinical notes retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  async findByVisit(@Param('visitId') visitId: string) {
    return this.noteService.findByVisit(visitId);
  }

  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get notes for a student',
    description:
      'Retrieves comprehensive clinical documentation history for a student. Includes all clinical notes across visits, assessments, and health encounters for continuity of care.',
  })
  @ApiParam({ name: 'studentId', description: 'Student UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Student clinical notes retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findByStudent(@Param('studentId') studentId: string) {
    return this.noteService.findByStudent(studentId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get note by ID',
    description:
      'Retrieves a specific clinical note by its UUID. Returns complete note content, metadata, signature status, and revision history.',
  })
  @ApiParam({ name: 'id', description: 'Clinical note UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Clinical note retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Clinical note not found' })
  async findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update clinical note',
    description:
      'Updates an existing clinical note. Only unsigned notes can be modified. Creates an audit trail of changes with timestamp and editor information for regulatory compliance.',
  })
  @ApiParam({ name: 'id', description: 'Clinical note UUID', format: 'uuid' })
  @ApiBody({ type: UpdateNoteDto })
  @ApiResponse({
    status: 200,
    description: 'Clinical note updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or note already signed',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Clinical note not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateNoteDto) {
    return this.noteService.update(id, updateDto);
  }

  @Post(':id/sign')
  @ApiOperation({
    summary: 'Sign clinical note',
    description:
      'Applies electronic signature to a clinical note, finalizing the documentation. Once signed, the note becomes read-only and part of the permanent medical record.',
  })
  @ApiParam({ name: 'id', description: 'Clinical note UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Clinical note signed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Note already signed or invalid state',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Clinical note not found' })
  async sign(@Param('id') id: string) {
    return this.noteService.sign(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete clinical note',
    description:
      'Soft deletes a clinical note. Signed notes cannot be deleted. Maintains audit trail and may be restricted by medical record retention policies.',
  })
  @ApiParam({ name: 'id', description: 'Clinical note UUID', format: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'Clinical note deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Cannot delete signed note' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Clinical note not found' })
  async remove(@Param('id') id: string) {
    await this.noteService.remove(id);
  }
}
