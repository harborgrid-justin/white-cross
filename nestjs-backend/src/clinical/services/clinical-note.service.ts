import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalNote } from '../entities/clinical-note.entity';
import { CreateNoteDto } from '../dto/note/create-note.dto';
import { UpdateNoteDto } from '../dto/note/update-note.dto';
import { NoteFiltersDto } from '../dto/note/note-filters.dto';

@Injectable()
export class ClinicalNoteService {
  private readonly logger = new Logger(ClinicalNoteService.name);

  constructor(
    @InjectRepository(ClinicalNote)
    private noteRepository: Repository<ClinicalNote>,
  ) {}

  async create(createDto: CreateNoteDto): Promise<ClinicalNote> {
    const note = this.noteRepository.create(createDto);
    return this.noteRepository.save(note);
  }

  async findOne(id: string): Promise<ClinicalNote> {
    const note = await this.noteRepository.findOne({ where: { id }, relations: ['visit'] });
    if (!note) throw new NotFoundException(`Note ${id} not found`);
    return note;
  }

  async findAll(filters: NoteFiltersDto): Promise<{ notes: ClinicalNote[]; total: number }> {
    const queryBuilder = this.noteRepository.createQueryBuilder('note');

    if (filters.studentId) queryBuilder.andWhere('note.studentId = :studentId', { studentId: filters.studentId });
    if (filters.visitId) queryBuilder.andWhere('note.visitId = :visitId', { visitId: filters.visitId });
    if (filters.type) queryBuilder.andWhere('note.type = :type', { type: filters.type });
    if (filters.createdBy) queryBuilder.andWhere('note.createdBy = :createdBy', { createdBy: filters.createdBy });
    if (filters.signedOnly) queryBuilder.andWhere('note.isSigned = true');
    if (filters.unsignedOnly) queryBuilder.andWhere('note.isSigned = false');

    const [notes, total] = await queryBuilder
      .skip(filters.offset || 0)
      .take(filters.limit || 20)
      .orderBy('note.createdAt', 'DESC')
      .getManyAndCount();

    return { notes, total };
  }

  async findByVisit(visitId: string): Promise<ClinicalNote[]> {
    return this.noteRepository.find({
      where: { visitId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStudent(studentId: string, limit: number = 10): Promise<ClinicalNote[]> {
    return this.noteRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async update(id: string, updateDto: UpdateNoteDto): Promise<ClinicalNote> {
    const note = await this.findOne(id);
    if (note.isSigned) throw new BadRequestException('Cannot update a signed note');
    Object.assign(note, updateDto);
    return this.noteRepository.save(note);
  }

  async sign(id: string): Promise<ClinicalNote> {
    const note = await this.findOne(id);
    if (note.isSigned) throw new BadRequestException('Note is already signed');
    note.sign();
    return this.noteRepository.save(note);
  }

  async remove(id: string): Promise<void> {
    const note = await this.findOne(id);
    if (note.isSigned) throw new BadRequestException('Cannot delete a signed note');
    await this.noteRepository.delete(id);
    this.logger.log(`Deleted note ${id}`);
  }
}
