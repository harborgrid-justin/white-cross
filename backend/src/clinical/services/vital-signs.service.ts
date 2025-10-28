import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { VitalSigns } from '../entities/vital-signs.entity';
import { RecordVitalsDto } from '../dto/vitals/record-vitals.dto';
import { UpdateVitalsDto } from '../dto/vitals/update-vitals.dto';
import { VitalsFiltersDto } from '../dto/vitals/vitals-filters.dto';

@Injectable()
export class VitalSignsService {
  private readonly logger = new Logger(VitalSignsService.name);

  constructor(
    @InjectRepository(VitalSigns)
    private vitalsRepository: Repository<VitalSigns>,
  ) {}

  async record(recordDto: RecordVitalsDto): Promise<VitalSigns> {
    const vitals = this.vitalsRepository.create(recordDto);
    vitals.updateBMI(); // Calculate BMI if height and weight provided
    return this.vitalsRepository.save(vitals);
  }

  async findOne(id: string): Promise<VitalSigns> {
    const vitals = await this.vitalsRepository.findOne({ where: { id }, relations: ['visit'] });
    if (!vitals) throw new NotFoundException(`Vital signs ${id} not found`);
    return vitals;
  }

  async findAll(filters: VitalsFiltersDto): Promise<{ vitals: VitalSigns[]; total: number }> {
    const queryBuilder = this.vitalsRepository.createQueryBuilder('vitals');

    if (filters.studentId) queryBuilder.andWhere('vitals.studentId = :studentId', { studentId: filters.studentId });
    if (filters.visitId) queryBuilder.andWhere('vitals.visitId = :visitId', { visitId: filters.visitId });
    if (filters.recordedBy) queryBuilder.andWhere('vitals.recordedBy = :recordedBy', { recordedBy: filters.recordedBy });

    if (filters.dateFrom || filters.dateTo) {
      if (filters.dateFrom && filters.dateTo) {
        queryBuilder.andWhere('vitals.recordedAt BETWEEN :dateFrom AND :dateTo', {
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        });
      } else if (filters.dateFrom) {
        queryBuilder.andWhere('vitals.recordedAt >= :dateFrom', { dateFrom: filters.dateFrom });
      } else if (filters.dateTo) {
        queryBuilder.andWhere('vitals.recordedAt <= :dateTo', { dateTo: filters.dateTo });
      }
    }

    const [vitals, total] = await queryBuilder
      .skip(filters.offset || 0)
      .take(filters.limit || 20)
      .orderBy('vitals.recordedAt', 'DESC')
      .getManyAndCount();

    return { vitals, total };
  }

  async findByVisit(visitId: string): Promise<VitalSigns[]> {
    return this.vitalsRepository.find({
      where: { visitId },
      order: { recordedAt: 'DESC' },
    });
  }

  async findByStudent(studentId: string, limit: number = 10): Promise<VitalSigns[]> {
    return this.vitalsRepository.find({
      where: { studentId },
      order: { recordedAt: 'DESC' },
      take: limit,
    });
  }

  async getTrends(studentId: string, startDate: Date, endDate: Date): Promise<VitalSigns[]> {
    return this.vitalsRepository.find({
      where: {
        studentId,
        recordedAt: Between(startDate, endDate),
      },
      order: { recordedAt: 'ASC' },
    });
  }

  async update(id: string, updateDto: UpdateVitalsDto): Promise<VitalSigns> {
    const vitals = await this.findOne(id);
    Object.assign(vitals, updateDto);
    if (updateDto.height || updateDto.weight) vitals.updateBMI();
    return this.vitalsRepository.save(vitals);
  }

  async remove(id: string): Promise<void> {
    const result = await this.vitalsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Vital signs ${id} not found`);
    this.logger.log(`Deleted vital signs ${id}`);
  }
}
