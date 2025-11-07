import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ClinicalNote } from '../entities/clinical-note.entity';
import { CreateNoteDto } from '../dto/note/create-note.dto';
import { UpdateNoteDto } from '../dto/note/update-note.dto';
import { NoteFiltersDto } from '../dto/note/note-filters.dto';

@Injectable()
export class ClinicalNoteService {
  private readonly logger = new Logger(ClinicalNoteService.name);

  constructor(
    @InjectModel(ClinicalNote)
    private noteModel: typeof ClinicalNote,
  ) {}

  async create(createDto: CreateNoteDto): Promise<ClinicalNote> {
    return this.noteModel.create(createDto as any);
  }

  async findOne(id: string): Promise<ClinicalNote> {
    const note = await this.noteModel.findByPk(id, { include: ['visit'] });
    if (!note) throw new NotFoundException(`Note ${id} not found`);
    return note;
  }

  async findAll(
    filters: NoteFiltersDto,
  ): Promise<{ notes: ClinicalNote[]; total: number }> {
    const whereClause: any = {};

    if (filters.studentId) whereClause.studentId = filters.studentId;
    if (filters.visitId) whereClause.visitId = filters.visitId;
    if (filters.type) whereClause.type = filters.type;
    if (filters.createdBy) whereClause.createdBy = filters.createdBy;
    if (filters.signedOnly) whereClause.isSigned = true;
    if (filters.unsignedOnly) whereClause.isSigned = false;

    const { rows: notes, count: total } = await this.noteModel.findAndCountAll({
      where: whereClause,
      offset: filters.offset || 0,
      limit: filters.limit || 20,
      order: [['createdAt', 'DESC']],
    });

    return { notes, total };
  }

  async findByVisit(visitId: string): Promise<ClinicalNote[]> {
    return this.noteModel.findAll({
      where: { visitId },
      order: [['createdAt', 'DESC']],
    });
  }

  async findByStudent(
    studentId: string,
    limit: number = 10,
  ): Promise<ClinicalNote[]> {
    return this.noteModel.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']],
      limit,
    });
  }

  async update(id: string, updateDto: UpdateNoteDto): Promise<ClinicalNote> {
    const note = await this.findOne(id);
    if (note.isSigned)
      throw new BadRequestException('Cannot update a signed note');
    Object.assign(note, updateDto);
    return note.save();
  }

  async sign(id: string): Promise<ClinicalNote> {
    const note = await this.findOne(id);
    if (note.isSigned) throw new BadRequestException('Note is already signed');
    note.sign();
    return note.save();
  }

  async remove(id: string): Promise<void> {
    const note = await this.findOne(id);
    if (note.isSigned)
      throw new BadRequestException('Cannot delete a signed note');
    await note.destroy();
    this.logger.log(`Deleted note ${id}`);
  }
}
