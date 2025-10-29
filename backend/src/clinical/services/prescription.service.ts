import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, literal } from 'sequelize';
import { Prescription } from '../entities/prescription.entity';
import { PrescriptionStatus } from '../enums/prescription-status.enum';
import { CreatePrescriptionDto } from '../dto/prescription/create-prescription.dto';
import { UpdatePrescriptionDto } from '../dto/prescription/update-prescription.dto';
import { FillPrescriptionDto } from '../dto/prescription/fill-prescription.dto';
import { PrescriptionFiltersDto } from '../dto/prescription/prescription-filters.dto';

/**
 * Prescription Service
 * Manages medication prescriptions including creation, filling, and tracking
 */
@Injectable()
export class PrescriptionService {
  private readonly logger = new Logger(PrescriptionService.name);

  constructor(
    @InjectModel(Prescription)
    private prescriptionModel: typeof Prescription,
  ) {}

  /**
   * Create a new prescription
   */
  async create(createDto: CreatePrescriptionDto): Promise<Prescription> {
    this.logger.log(`Creating prescription for student ${createDto.studentId}: ${createDto.drugName}`);

    return this.prescriptionModel.create(createDto as any);
  }

  /**
   * Find prescription by ID
   */
  async findOne(id: string): Promise<Prescription> {
    const prescription = await this.prescriptionModel.findByPk(id, {
      include: ['visit', 'treatmentPlan'],
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription ${id} not found`);
    }

    return prescription;
  }

  /**
   * Find all prescriptions with filters
   */
  async findAll(filters: PrescriptionFiltersDto): Promise<{
    prescriptions: Prescription[];
    total: number;
  }> {
    const whereClause: any = {};

    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }

    if (filters.visitId) {
      whereClause.visitId = filters.visitId;
    }

    if (filters.treatmentPlanId) {
      whereClause.treatmentPlanId = filters.treatmentPlanId;
    }

    if (filters.prescribedBy) {
      whereClause.prescribedBy = filters.prescribedBy;
    }

    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.drugName) {
      whereClause.drugName = { [Op.iLike]: `%${filters.drugName}%` };
    }

    if (filters.activeOnly) {
      whereClause.status = {
        [Op.in]: [PrescriptionStatus.FILLED, PrescriptionStatus.PICKED_UP]
      };
    }

    const { rows: prescriptions, count: total } = await this.prescriptionModel.findAndCountAll({
      where: whereClause,
      offset: filters.offset || 0,
      limit: filters.limit || 20,
      order: [['createdAt', 'DESC']],
    });

    return { prescriptions, total };
  }

  /**
   * Get prescriptions by student ID
   */
  async findByStudent(studentId: string, limit: number = 10): Promise<Prescription[]> {
    return this.prescriptionModel.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']],
      limit,
    });
  }

  /**
   * Get active prescriptions for a student
   */
  async findActiveByStudent(studentId: string): Promise<Prescription[]> {
    return this.prescriptionModel.findAll({
      where: {
        studentId,
        status: {
          [Op.in]: [PrescriptionStatus.FILLED, PrescriptionStatus.PICKED_UP]
        }
      },
      order: [['startDate', 'DESC']],
    });
  }

  /**
   * Update prescription
   */
  async update(id: string, updateDto: UpdatePrescriptionDto): Promise<Prescription> {
    const prescription = await this.findOne(id);

    Object.assign(prescription, updateDto);
    await prescription.save();
    return prescription;
  }

  /**
   * Fill a prescription at pharmacy
   */
  async fill(id: string, fillDto: FillPrescriptionDto): Promise<Prescription> {
    const prescription = await this.findOne(id);

    if (
      prescription.status !== PrescriptionStatus.PENDING &&
      prescription.status !== PrescriptionStatus.SENT
    ) {
      throw new BadRequestException(
        `Cannot fill prescription with status: ${prescription.status}`
      );
    }

    // Validate refills
    if (fillDto.refillNumber && fillDto.refillNumber > 0) {
      if (!prescription.hasRefillsRemaining()) {
        throw new BadRequestException('No refills remaining for this prescription');
      }
      prescription.refillsUsed = fillDto.refillNumber;
    }

    // Update prescription
    prescription.pharmacyName = fillDto.pharmacyName;
    prescription.quantityFilled += fillDto.quantityFilled;
    prescription.filledDate = fillDto.filledDate;
    prescription.status =
      prescription.quantityFilled >= prescription.quantity
        ? PrescriptionStatus.FILLED
        : PrescriptionStatus.PARTIALLY_FILLED;

    if (fillDto.notes) {
      prescription.notes = prescription.notes
        ? `${prescription.notes}\n${fillDto.notes}`
        : fillDto.notes;
    }

    this.logger.log(`Filled prescription ${id} at ${fillDto.pharmacyName}`);
    await prescription.save();
    return prescription;
  }

  /**
   * Mark prescription as picked up
   */
  async markPickedUp(id: string): Promise<Prescription> {
    const prescription = await this.findOne(id);

    if (prescription.status !== PrescriptionStatus.FILLED) {
      throw new BadRequestException('Can only mark filled prescriptions as picked up');
    }

    prescription.status = PrescriptionStatus.PICKED_UP;
    prescription.pickedUpDate = new Date();

    await prescription.save();
    return prescription;
  }

  /**
   * Cancel a prescription
   */
  async cancel(id: string): Promise<Prescription> {
    const prescription = await this.findOne(id);

    if (
      prescription.status === PrescriptionStatus.FILLED ||
      prescription.status === PrescriptionStatus.PICKED_UP
    ) {
      throw new BadRequestException('Cannot cancel a filled or picked up prescription');
    }

    prescription.status = PrescriptionStatus.CANCELLED;
    await prescription.save();
    return prescription;
  }

  /**
   * Delete prescription
   */
  async remove(id: string): Promise<void> {
    const deletedCount = await this.prescriptionModel.destroy({
      where: { id }
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Prescription ${id} not found`);
    }

    this.logger.log(`Deleted prescription ${id}`);
  }

  /**
   * Get prescriptions needing refills (low refills remaining)
   */
  async findNeedingRefills(): Promise<Prescription[]> {
    return this.prescriptionModel.findAll({
      where: {
        status: {
          [Op.in]: [PrescriptionStatus.FILLED, PrescriptionStatus.PICKED_UP]
        },
        [Op.and]: [
          { refillsAuthorized: { [Op.gt]: { [Op.col]: 'refillsUsed' } } },
          literal('refillsAuthorized - refillsUsed <= 1')
        ]
      },
      order: [['endDate', 'ASC']],
    });
  }
}
