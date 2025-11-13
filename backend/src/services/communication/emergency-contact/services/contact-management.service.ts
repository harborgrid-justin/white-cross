/**
 * Contact Management Service
 *
 * Handles CRUD operations for emergency contacts including:
 * - Contact retrieval by ID and student ID
 * - Contact creation with business rule enforcement
 * - Contact updates with validation
 * - Contact deletion (soft delete) with safety checks
 * - Primary contact enforcement (max 2 primary contacts per student)
 *
 * This service manages the core business logic for emergency contact data
 * and ensures data integrity through transactions and validation.
 */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmergencyContact } from '@/database/models';
import { Student } from '@/database/models';
import { ContactPriority } from '../../contact/enums';
import { EmergencyContactCreateDto } from '../dto/create-emergency-contact.dto';
import { EmergencyContactUpdateDto } from '../dto/update-emergency-contact.dto';
import { ContactValidationService } from './contact-validation.service';
import { BaseService, FilterOptions } from '../../common/shared/service-utilities';

@Injectable()
export class ContactManagementService extends BaseService<
  EmergencyContact,
  EmergencyContactCreateDto,
  EmergencyContactUpdateDto
> {
  constructor(
    @InjectRepository(EmergencyContact)
    repository: Repository<EmergencyContact>,
    @InjectModel(EmergencyContact)
    private readonly emergencyContactModel: typeof EmergencyContact,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    private readonly validationService: ContactValidationService,
    eventEmitter?: EventEmitter2,
  ) {
    super(repository, eventEmitter, {
      entityName: 'EmergencyContact',
      enableEvents: true,
      enableAudit: true,
    });
  }

  /**
   * Get all emergency contacts for a student
   * Returns active contacts ordered by priority
   *
   * @param studentId - Student identifier
   * @returns Array of active emergency contacts
   */
  async getStudentEmergencyContacts(studentId: string): Promise<EmergencyContact[]> {
    try {
      // Use base service method with custom filters
      const result = await this.findAll({
        studentId,
        isActive: true,
        orderBy: 'priority',
        orderDirection: 'ASC',
      });

      this.logger.log(
        `Retrieved ${result.data.length} emergency contacts for student ${studentId}`,
      );
      return result.data;
    } catch (error: any) {
      this.logger.error(
        `Error fetching student emergency contacts: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to fetch emergency contacts');
    }
  }

  /**
   * Get emergency contact by ID
   *
   * @param id - Contact identifier
   * @returns Emergency contact
   * @throws NotFoundException if contact not found
   */
  async getEmergencyContactById(id: string): Promise<EmergencyContact> {
    // Use base service method
    return await this.findOne(id);
  }

  /**
   * Create new emergency contact
   * Validates student exists, performs data validation, and enforces business rules
   *
   * @param data - Contact creation data
   * @returns Created emergency contact
   * @throws NotFoundException if student not found
   * @throws BadRequestException if validation fails or business rules violated
   */
  async createEmergencyContact(data: EmergencyContactCreateDto): Promise<EmergencyContact> {
    return await this.executeInTransaction(async (_manager) => {
      // Verify student exists and is active
      const student = await this.studentModel.findOne({
        where: { id: data.studentId },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      if (!student.isActive) {
        throw new BadRequestException('Cannot add emergency contact to inactive student');
      }

      // Validate contact data
      this.validationService.validateContactCreation({
        phoneNumber: data.phoneNumber,
        email: data.email,
        notificationChannels: data.notificationChannels,
      });

      // Check PRIMARY contact limit (max 2 per student)
      if (data.priority === ContactPriority.PRIMARY) {
        await this.validatePrimaryContactLimit(data.studentId);
      }

      // Prepare contact data with serialized notification channels
      const contactData = {
        ...data,
        notificationChannels: data.notificationChannels
          ? JSON.stringify(data.notificationChannels)
          : JSON.stringify(['sms', 'email']), // Default channels
      };

      // Use base service create method
      const savedContact = await this.create(contactData);

      this.logger.log(
        `Emergency contact created: ${savedContact.firstName} ${savedContact.lastName} (${savedContact.priority}) for student ${student.firstName} ${student.lastName}`,
      );

      return savedContact;
    });
  }

  /**
   * Update emergency contact
   * Validates updates and enforces business rules for priority changes
   *
   * @param id - Contact identifier
   * @param data - Update data
   * @returns Updated emergency contact
   * @throws NotFoundException if contact not found
   * @throws BadRequestException if validation fails or business rules violated
   */
  async updateEmergencyContact(
    id: string,
    data: EmergencyContactUpdateDto,
  ): Promise<EmergencyContact> {
    return await this.executeInTransaction(async (_manager) => {
      const existingContact = await this.findOne(id);

      // Validate update data
      this.validationService.validateContactUpdate(data, existingContact);

      // Handle priority changes with PRIMARY contact enforcement
      if (data.priority !== undefined && data.priority !== existingContact.priority) {
        await this.validatePriorityChange(id, existingContact, data.priority);
      }

      // Handle deactivation - ensure at least one PRIMARY contact remains active
      if (
        data.isActive === false &&
        existingContact.isActive &&
        existingContact.priority === ContactPriority.PRIMARY
      ) {
        await this.validatePrimaryContactDeactivation(id, existingContact.studentId);
      }

      // Prepare update data with serialized notification channels
      const updateData: any = { ...data };
      if ((data as any).notificationChannels) {
        updateData.notificationChannels = JSON.stringify((data as any).notificationChannels);
      }

      // Use base service update method
      return await this.update(id, updateData);
    });
  }

  /**
   * Delete emergency contact (soft delete)
   * Sets isActive to false instead of removing from database
   *
   * @param id - Contact identifier
   * @returns Success indicator
   * @throws NotFoundException if contact not found
   * @throws BadRequestException if deletion would violate business rules
   */
  async deleteEmergencyContact(id: string): Promise<{ success: boolean }> {
    return await this.executeInTransaction(async (_manager) => {
      const contact = await this.findOne(id);

      // Prevent deletion if this is the only active PRIMARY contact
      if (contact.isActive && contact.priority === ContactPriority.PRIMARY) {
        await this.validatePrimaryContactDeactivation(id, contact.studentId);
      }

      // Use base service remove method (soft delete)
      await this.remove(id);

      this.logger.log(`Emergency contact deleted: ${contact.firstName} ${contact.lastName}`);

      return { success: true };
    });
  }

  // ==================== Private Business Rule Validators ====================

  /**
   * Validate PRIMARY contact limit
   * Ensures student doesn't exceed max 2 PRIMARY contacts
   *
   * @param studentId - Student identifier
   * @throws BadRequestException if limit exceeded
   */
  private async validatePrimaryContactLimit(studentId: string): Promise<void> {
    const existingPrimaryContacts = await this.count({
      studentId,
      priority: ContactPriority.PRIMARY,
      isActive: true,
    });

    if (existingPrimaryContacts >= 2) {
      throw new BadRequestException(
        'Student already has 2 primary contacts. Please set one as SECONDARY before adding another PRIMARY contact.',
      );
    }
  }

  /**
   * Validate priority change
   * Ensures priority changes don't violate business rules
   *
   * @param contactId - Contact identifier
   * @param existingContact - Current contact state
   * @param newPriority - Desired priority level
   * @throws BadRequestException if change would violate business rules
   */
  private async validatePriorityChange(
    contactId: string,
    existingContact: EmergencyContact,
    newPriority: ContactPriority,
  ): Promise<void> {
    if (newPriority === ContactPriority.PRIMARY) {
      // Upgrading to PRIMARY - check limit using base service count method
      const existingPrimaryContacts = await this.count({
        studentId: existingContact.studentId,
        priority: ContactPriority.PRIMARY,
        isActive: true,
      });

      // Subtract 1 if the current contact is already PRIMARY (shouldn't happen in this flow)
      const adjustedCount =
        existingContact.priority === ContactPriority.PRIMARY
          ? existingPrimaryContacts - 1
          : existingPrimaryContacts;

      if (adjustedCount >= 2) {
        throw new BadRequestException(
          'Student already has 2 primary contacts. Please set one as SECONDARY before changing this contact to PRIMARY.',
        );
      }
    } else if (existingContact.priority === ContactPriority.PRIMARY) {
      // Downgrading from PRIMARY - ensure at least one PRIMARY contact remains
      const otherPrimaryContacts = await this.count({
        studentId: existingContact.studentId,
        priority: ContactPriority.PRIMARY,
        isActive: true,
      });

      if (otherPrimaryContacts <= 1) {
        // <= 1 because this includes the current contact
        throw new BadRequestException(
          'Cannot change priority from PRIMARY. Student must have at least one PRIMARY contact. Add another PRIMARY contact first or change this to SECONDARY and promote another contact.',
        );
      }
    }
  }

  /**
   * Validate PRIMARY contact deactivation
   * Ensures at least one active PRIMARY contact remains
   *
   * @param contactId - Contact identifier
   * @param studentId - Student identifier
   * @throws BadRequestException if deactivation would leave no PRIMARY contacts
   */
  private async validatePrimaryContactDeactivation(
    contactId: string,
    studentId: string,
  ): Promise<void> {
    const activePrimaryContacts = await this.count({
      studentId,
      priority: ContactPriority.PRIMARY,
      isActive: true,
    });

    if (activePrimaryContacts <= 1) {
      // <= 1 because this includes the current contact
      throw new BadRequestException(
        'Cannot deactivate the only active PRIMARY contact. Student must have at least one active PRIMARY contact.',
      );
    }
  }

  /**
   * Apply custom filters for emergency contacts
   */
  protected applyCustomFilters(where: any, filters: FilterOptions): void {
    super.applyCustomFilters(where, filters);

    // Add custom filters specific to emergency contacts
    if ((filters as any).studentId) {
      where.studentId = (filters as any).studentId;
    }

    if ((filters as any).priority) {
      where.priority = (filters as any).priority;
    }

    if ((filters as any).relationship) {
      where.relationship = (filters as any).relationship;
    }
  }

  /**
   * Apply search filter for emergency contacts
   */
  protected applySearchFilter(where: any, search: string): void {
    // Search across first name, last name, email, and phone number
    const searchConditions = [
      { firstName: { $ilike: `%${search}%` } },
      { lastName: { $ilike: `%${search}%` } },
      { email: { $ilike: `%${search}%` } },
      { phoneNumber: { $ilike: `%${search}%` } },
      { relationship: { $ilike: `%${search}%` } },
    ];

    (where as any).$or = searchConditions;
  }
}
