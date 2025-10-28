import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClinicalNoteService } from '../services/clinical-note.service';
import { CreateNoteDto } from '../dto/note/create-note.dto';
import { UpdateNoteDto } from '../dto/note/update-note.dto';
import { NoteFiltersDto } from '../dto/note/note-filters.dto';

@ApiTags('Clinical - Clinical Notes')
@Controller('clinical/notes')
export class ClinicalNoteController {
  constructor(private readonly noteService: ClinicalNoteService) {}

  @Post()
  @ApiOperation({ summary: 'Create clinical note' })
  async create(@Body() createDto: CreateNoteDto) {
    return this.noteService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Query clinical notes' })
  async findAll(@Query() filters: NoteFiltersDto) {
    return this.noteService.findAll(filters);
  }

  @Get('visit/:visitId')
  @ApiOperation({ summary: 'Get notes for a visit' })
  async findByVisit(@Param('visitId') visitId: string) {
    return this.noteService.findByVisit(visitId);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get notes for a student' })
  async findByStudent(@Param('studentId') studentId: string) {
    return this.noteService.findByStudent(studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get note by ID' })
  async findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update note' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateNoteDto) {
    return this.noteService.update(id, updateDto);
  }

  @Post(':id/sign')
  @ApiOperation({ summary: 'Sign clinical note' })
  async sign(@Param('id') id: string) {
    return this.noteService.sign(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete note' })
  async remove(@Param('id') id: string) {
    await this.noteService.remove(id);
  }
}
