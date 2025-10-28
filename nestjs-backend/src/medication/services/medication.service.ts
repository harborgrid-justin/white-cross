import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { MedicationRepository } from '../medication.repository';
import {
  CreateMedicationDto,
  UpdateMedicationDto,
  DeactivateMedicationDto,
  ListMedicationsQueryDto,
} from '../dto';
import { MedicationEntity, PaginatedMedicationResponse } from '../entities';

/**
 * Medication Service
 *
 * Provides business logic for medication management operations including:
 * - CRUD operations for medications
 * - Student medication tracking
 * - Medication activation/deactivation with audit trail
 * - Medication search and filtering
 * - Pagination support
 *
 * Security:
 * - All operations require authenticated user context
 * - PHI data must be handled securely
 *
 * HIPAA Compliance:
 * - All medication data is Protected Health Information (PHI)
 * - Operations should be audited at the controller/middleware layer
 * - Soft deletion preserves medical history for compliance
 *
 * Business Rules:
 * - Medications can be activated/deactivated but never hard deleted
 * - Deactivation requires reason and type for audit trail
 * - Active medications have status='ACTIVE'
 * - Inactive medications have status != 'ACTIVE'
 */
@Injectable()
export class MedicationService {
  private readonly logger = new Logger(MedicationService.name);

  constructor(private readonly medicationRepository: MedicationRepository) {}

  /**
   * Get all medications with pagination and filtering
   *
   * Retrieves medications from the database with support for:
   * - Pagination (page, limit)
   * - Search by medication name (case-insensitive)
   * - Filter by student ID
   * - Filter by active status
   *
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated list of medications with metadata
   */
  async getMedications(
    query: ListMedicationsQueryDto,
  ): Promise<PaginatedMedicationResponse> {
    this.logger.log(
      `Getting medications: page=${query.page}, limit=${query.limit}, search=${query.search}`,
    );

    const { medications, total } =
      await this.medicationRepository.findAll(query);

    const pages = Math.ceil(total / (query.limit || 20));

    return {
      medications,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 20,
        total,
        pages,
      },
    };
  }

  /**
   * Create a new medication record
   *
   * Creates a new medication with complete prescribing information.
   * Validates required fields and sets default values.
   *
   * @param createDto - Medication creation data
   * @returns Created medication record
   * @throws BadRequestException if validation fails
   */
  async createMedication(createDto: CreateMedicationDto): Promise<any> {
    this.logger.log(
      `Creating medication: ${createDto.medicationName} for student ${createDto.studentId}`,
    );

    // Validate required fields
    if (!createDto.medicationName) {
      throw new BadRequestException('Medication name is required');
    }
    if (!createDto.dosage) {
      throw new BadRequestException('Dosage is required');
    }
    if (!createDto.frequency) {
      throw new BadRequestException('Frequency is required');
    }
    if (!createDto.route) {
      throw new BadRequestException('Route is required');
    }
    if (!createDto.prescribedBy) {
      throw new BadRequestException('Prescribed by is required');
    }
    if (!createDto.startDate) {
      throw new BadRequestException('Start date is required');
    }
    if (!createDto.studentId) {
      throw new BadRequestException('Student ID is required');
    }

    const medication = await this.medicationRepository.create(createDto);

    this.logger.log(`Created medication: ${medication.id}`);
    return medication;
  }

  /**
   * Get a medication by ID
   *
   * Retrieves a single medication record with complete details.
   * Includes associated student information if available.
   *
   * @param id - Medication UUID
   * @returns Medication record
   * @throws NotFoundException if medication doesn't exist
   */
  async getMedicationById(id: string): Promise<any> {
    this.logger.log(`Getting medication by ID: ${id}`);

    const medication = await this.medicationRepository.findById(id);

    if (!medication) {
      this.logger.warn(`Medication not found: ${id}`);
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    return medication;
  }

  /**
   * Get all medications for a specific student
   *
   * Retrieves paginated list of all medications (active and inactive)
   * for a student. Useful for medication history and reconciliation.
   *
   * @param studentId - Student UUID
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @returns Paginated list of student medications
   */
  async getMedicationsByStudent(
    studentId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedMedicationResponse> {
    this.logger.log(
      `Getting medications for student: ${studentId} (page=${page}, limit=${limit})`,
    );

    const { medications, total } =
      await this.medicationRepository.findByStudent(studentId, page, limit);

    const pages = Math.ceil(total / limit);

    return {
      medications,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  /**
   * Update an existing medication
   *
   * Updates medication information with partial data.
   * Only provided fields are updated.
   *
   * @param id - Medication UUID
   * @param updateDto - Partial medication data to update
   * @returns Updated medication record
   * @throws NotFoundException if medication doesn't exist
   * @throws BadRequestException if no fields provided
   */
  async updateMedication(
    id: string,
    updateDto: UpdateMedicationDto,
  ): Promise<any> {
    this.logger.log(`Updating medication: ${id}`);

    // Check if medication exists
    const exists = await this.medicationRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    // Validate at least one field is provided
    const hasFields = Object.keys(updateDto).length > 0;
    if (!hasFields) {
      throw new BadRequestException(
        'At least one field must be provided for update',
      );
    }

    const medication = await this.medicationRepository.update(id, updateDto);

    this.logger.log(`Updated medication: ${id}`);
    return medication;
  }

  /**
   * Deactivate a medication (soft delete)
   *
   * Marks a medication as inactive while preserving the record for
   * audit trail and medical history. Requires reason and type for compliance.
   *
   * @param id - Medication UUID
   * @param deactivateDto - Deactivation reason and type
   * @returns Deactivated medication record
   * @throws NotFoundException if medication doesn't exist
   */
  async deactivateMedication(
    id: string,
    deactivateDto: DeactivateMedicationDto,
  ): Promise<any> {
    this.logger.log(
      `Deactivating medication: ${id} - Reason: ${deactivateDto.reason} (${deactivateDto.deactivationType})`,
    );

    // Check if medication exists
    const exists = await this.medicationRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    const medication = await this.medicationRepository.deactivate(
      id,
      deactivateDto.reason,
      deactivateDto.deactivationType,
    );

    this.logger.log(`Deactivated medication: ${id}`);
    return medication;
  }

  /**
   * Activate a medication (restore from soft delete)
   *
   * Reactivates a previously deactivated medication by setting
   * status back to ACTIVE and clearing the end date.
   *
   * @param id - Medication UUID
   * @returns Activated medication record
   * @throws NotFoundException if medication doesn't exist
   */
  async activateMedication(id: string): Promise<any> {
    this.logger.log(`Activating medication: ${id}`);

    // Check if medication exists
    const exists = await this.medicationRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    const medication = await this.medicationRepository.activate(id);

    this.logger.log(`Activated medication: ${id}`);
    return medication;
  }
}
