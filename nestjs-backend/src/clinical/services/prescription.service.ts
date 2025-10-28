import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
  ) {}

  /**
   * Create a new prescription
   */
  async create(createDto: CreatePrescriptionDto): Promise<Prescription> {
    this.logger.log(`Creating prescription for student ${createDto.studentId}: ${createDto.drugName}`);

    const prescription = this.prescriptionRepository.create(createDto);
    return this.prescriptionRepository.save(prescription);
  }

  /**
   * Find prescription by ID
   */
  async findOne(id: string): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id },
      relations: ['visit', 'treatmentPlan'],
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
    const queryBuilder = this.prescriptionRepository.createQueryBuilder('prescription');

    if (filters.studentId) {
      queryBuilder.andWhere('prescription.studentId = :studentId', {
        studentId: filters.studentId,
      });
    }

    if (filters.visitId) {
      queryBuilder.andWhere('prescription.visitId = :visitId', {
        visitId: filters.visitId,
      });
    }

    if (filters.treatmentPlanId) {
      queryBuilder.andWhere('prescription.treatmentPlanId = :treatmentPlanId', {
        treatmentPlanId: filters.treatmentPlanId,
      });
    }

    if (filters.prescribedBy) {
      queryBuilder.andWhere('prescription.prescribedBy = :prescribedBy', {
        prescribedBy: filters.prescribedBy,
      });
    }

    if (filters.status) {
      queryBuilder.andWhere('prescription.status = :status', { status: filters.status });
    }

    if (filters.drugName) {
      queryBuilder.andWhere('prescription.drugName ILIKE :drugName', {
        drugName: `%${filters.drugName}%`,
      });
    }

    if (filters.activeOnly) {
      queryBuilder.andWhere(
        'prescription.status IN (:...activeStatuses)',
        {
          activeStatuses: [
            PrescriptionStatus.FILLED,
            PrescriptionStatus.PICKED_UP,
          ],
        }
      );
    }

    const [prescriptions, total] = await queryBuilder
      .skip(filters.offset || 0)
      .take(filters.limit || 20)
      .orderBy('prescription.createdAt', 'DESC')
      .getManyAndCount();

    return { prescriptions, total };
  }

  /**
   * Get prescriptions by student ID
   */
  async findByStudent(studentId: string, limit: number = 10): Promise<Prescription[]> {
    return this.prescriptionRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get active prescriptions for a student
   */
  async findActiveByStudent(studentId: string): Promise<Prescription[]> {
    return this.prescriptionRepository
      .createQueryBuilder('prescription')
      .where('prescription.studentId = :studentId', { studentId })
      .andWhere('prescription.status IN (:...activeStatuses)', {
        activeStatuses: [
          PrescriptionStatus.FILLED,
          PrescriptionStatus.PICKED_UP,
        ],
      })
      .orderBy('prescription.startDate', 'DESC')
      .getMany();
  }

  /**
   * Update prescription
   */
  async update(id: string, updateDto: UpdatePrescriptionDto): Promise<Prescription> {
    const prescription = await this.findOne(id);

    Object.assign(prescription, updateDto);
    return this.prescriptionRepository.save(prescription);
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
    return this.prescriptionRepository.save(prescription);
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

    return this.prescriptionRepository.save(prescription);
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
    return this.prescriptionRepository.save(prescription);
  }

  /**
   * Delete prescription
   */
  async remove(id: string): Promise<void> {
    const result = await this.prescriptionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Prescription ${id} not found`);
    }

    this.logger.log(`Deleted prescription ${id}`);
  }

  /**
   * Get prescriptions needing refills (low refills remaining)
   */
  async findNeedingRefills(): Promise<Prescription[]> {
    return this.prescriptionRepository
      .createQueryBuilder('prescription')
      .where('prescription.status IN (:...activeStatuses)', {
        activeStatuses: [PrescriptionStatus.FILLED, PrescriptionStatus.PICKED_UP],
      })
      .andWhere('prescription.refillsAuthorized > prescription.refillsUsed')
      .andWhere('(prescription.refillsAuthorized - prescription.refillsUsed) <= 1')
      .orderBy('prescription.endDate', 'ASC')
      .getMany();
  }
}
