import { BadRequestException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from '../../shared/base/base.service';
import { MedicationRepository } from '../medication.repository';
import { CreateMedicationDto } from '../dto/create-medication.dto';
import { DeactivateMedicationDto } from '../dto/deactivate-medication.dto';
import { ListMedicationsQueryDto } from '../dto/list-medications-query.dto';
import { UpdateMedicationDto } from '../dto/update-medication.dto';
import { PaginatedMedicationResponse } from '../entities/medication.entity';
import { StudentMedication } from '../entities/student-medication.entity';

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
/**
 * Medication Events
 * Used for event-driven architecture to avoid circular dependencies
 */
export class MedicationCreatedEvent {
  constructor(
    public readonly medication: any,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class MedicationUpdatedEvent {
  constructor(
    public readonly medication: any,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class MedicationDeactivatedEvent {
  constructor(
    public readonly medication: any,
    public readonly timestamp: Date = new Date(),
  ) {}
}

@Injectable()
export class MedicationService extends BaseService {

  constructor(
    protected readonly requestContext: RequestContextService,
    private readonly medicationRepository: MedicationRepository,
    @Optional() private readonly eventEmitter: EventEmitter2,
  ) {
    super(requestContext);
  }

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
  async createMedication(
    createDto: CreateMedicationDto,
  ): Promise<StudentMedication> {
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

    // Emit event for medication creation
    // Event listeners (like WebSocket service) will handle notifications
    if (this.eventEmitter) {
      this.eventEmitter.emit(
        'medication.created',
        new MedicationCreatedEvent(medication),
      );
    }

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

    // Emit event for medication update
    if (this.eventEmitter) {
      this.eventEmitter.emit(
        'medication.updated',
        new MedicationUpdatedEvent(medication),
      );
    }

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

    // Emit event for medication deactivation
    if (this.eventEmitter) {
      this.eventEmitter.emit(
        'medication.deactivated',
        new MedicationDeactivatedEvent(medication),
      );
    }

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

  /**
   * Get medication statistics
   *
   * Retrieves aggregated statistics about medications across the system.
   * Includes counts by active status, total medications, and other metrics.
   *
   * @returns Medication statistics object
   */
  async getMedicationStats(): Promise<any> {
    this.logger.log('Getting medication statistics');

    const { medications, total } = await this.medicationRepository.findAll({
      page: 1,
      limit: 999999, // Get all medications for stats
    });

    // Calculate statistics
    const activeMedications = medications.filter(
      (med) => med.isActive === true,
    ).length;

    const inactiveMedications = medications.filter(
      (med) => med.isActive === false,
    ).length;

    // Count by route
    const routeCounts = medications.reduce(
      (acc, med) => {
        acc[med.route] = (acc[med.route] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count medications with end dates
    const withEndDate = medications.filter((med) => med.endDate).length;
    const withoutEndDate = total - withEndDate;

    const stats = {
      total,
      active: activeMedications,
      inactive: inactiveMedications,
      byRoute: routeCounts,
      withEndDate,
      withoutEndDate,
    };

    this.logger.log(`Medication statistics: ${JSON.stringify(stats)}`);
    return stats;
  }

  /**
   * NOTE: WebSocket notifications are now handled via event listeners
   *
   * The WebSocket service listens for medication events:
   * - medication.created
   * - medication.updated
   * - medication.deactivated
   *
   * This decouples MedicationService from WebSocketService and eliminates
   * the circular dependency.
   *
   * To implement WebSocket notifications, create an event listener in the
   * WebSocket module:
   *
   * @OnEvent('medication.created')
   * async handleMedicationCreated(event: MedicationCreatedEvent) {
   *   // Send WebSocket notification
   * }
   */

  /**
   * Batch find medications by IDs (for DataLoader)
   * Returns medications in the same order as requested IDs
   * Delegates to repository for database access
   */
  async findByIds(ids: string[]): Promise<(StudentMedication | null)[]> {
    this.logger.log(`Batch fetching ${ids.length} medications by IDs`);
    return this.medicationRepository.findByIds(ids);
  }

  /**
   * Batch find medications by student IDs (for DataLoader)
   * Returns array of medication arrays for each student ID
   * Delegates to repository for database access
   */
  async findByStudentIds(studentIds: string[]): Promise<StudentMedication[][]> {
    this.logger.log(
      `Batch fetching medications for ${studentIds.length} students`,
    );
    return this.medicationRepository.findByStudentIds(studentIds);
  }
}
