import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { VitalSigns } from '../entities/vital-signs.entity';
import { RecordVitalsDto } from '../dto/vitals/record-vitals.dto';
import { UpdateVitalsDto } from '../dto/vitals/update-vitals.dto';
import { VitalsFiltersDto } from '../dto/vitals/vitals-filters.dto';

@Injectable()
export class VitalSignsService {
  private readonly logger = new Logger(VitalSignsService.name);

  constructor(
    @InjectModel(VitalSigns)
    private vitalsModel: typeof VitalSigns,
  ) {}

  async record(recordDto: RecordVitalsDto): Promise<VitalSigns> {
    const vitals = await this.vitalsModel.create(recordDto as any);
    // vitals.updateBMI(); // Calculate BMI if height and weight provided - method may not exist
    return vitals;
  }

  async findOne(id: string): Promise<VitalSigns> {
    const vitals = await this.vitalsModel.findByPk(id);
    if (!vitals) throw new NotFoundException(`Vital signs ${id} not found`);
    return vitals;
  }

  async findAll(filters: VitalsFiltersDto): Promise<{ vitals: VitalSigns[]; total: number }> {
    const whereClause: any = {};

    if (filters.studentId) whereClause.studentId = filters.studentId;
    // visitId removed - not in model
    if (filters.recordedBy) whereClause.measuredBy = filters.recordedBy;

    if (filters.dateFrom || filters.dateTo) {
      if (filters.dateFrom && filters.dateTo) {
        whereClause.measurementDate = { [Op.between]: [filters.dateFrom, filters.dateTo] };
      } else if (filters.dateFrom) {
        whereClause.measurementDate = { [Op.gte]: filters.dateFrom };
      } else if (filters.dateTo) {
        whereClause.measurementDate = { [Op.lte]: filters.dateTo };
      }
    }

    const { rows: vitals, count: total } = await this.vitalsModel.findAndCountAll({
      where: whereClause,
      offset: filters.offset || 0,
      limit: filters.limit || 20,
      order: [['measurementDate', 'DESC']],
    });

    return { vitals, total };
  }

  // findByVisit removed - visitId not in model

  async findByStudent(studentId: string, limit: number = 10): Promise<VitalSigns[]> {
    return this.vitalsModel.findAll({
      where: { studentId },
      order: [['measurementDate', 'DESC']],
      limit,
    });
  }

  async getTrends(studentId: string, startDate: Date, endDate: Date): Promise<VitalSigns[]> {
    return this.vitalsModel.findAll({
      where: {
        studentId,
        measurementDate: { [Op.between]: [startDate, endDate] },
      },
      order: [['measurementDate', 'ASC']],
    });
  }

  async update(id: string, updateDto: UpdateVitalsDto): Promise<VitalSigns> {
    const vitals = await this.findOne(id);
    Object.assign(vitals, updateDto);
    // if (updateDto.height || updateDto.weight) vitals.updateBMI();
    await vitals.save();
    return vitals;
  }

  async remove(id: string): Promise<void> {
    const result = await this.vitalsModel.destroy({ where: { id } });
    if (result === 0) throw new NotFoundException(`Vital signs ${id} not found`);
    this.logger.log(`Deleted vital signs ${id}`);
  }
}
