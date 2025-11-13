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
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { EmergencyContact } from '@/database/models';
import { Student } from '@/database/models';
import { ContactPriority } from '../../contact/enums';
import { EmergencyContactCreateDto } from '../dto/create-emergency-contact.dto';
import { EmergencyContactUpdateDto } from '../dto/update-emergency-contact.dto';
import { ContactValidationService } from './contact-validation.service';

@Injectable()
export class ContactManagementService {
  private readonly logger = new Logger(ContactManagementService.name);

  constructor(
    @InjectModel(EmergencyContact)
    private readonly emergencyContactModel: typeof EmergencyContact,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    private readonly validationService: ContactValidationService,
  ) {
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
      const contacts = await this.emergencyContactModel.findAll({
        where: { studentId, isActive: true },
        order: [['priority', 'ASC']],
      });

      this.logger.log(
        `Retrieved ${contacts.length} emergency contacts for student ${studentId}`,
      );
      return contacts;
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
    const contact = await this.emergencyContactModel.findByPk(id);
    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }
    return contact;
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
    return await this.withTransaction(async (transaction) => {
      // Verify student exists and is active
      const student = await this.studentModel.findOne({
        where: { id: data.studentId },
        transaction,
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
        await this.validatePrimaryContactLimit(data.studentId, transaction);
      }

      // Prepare contact data with serialized notification channels
      const contactData = {
        ...data,
        notificationChannels: data.notificationChannels
          ? JSON.stringify(data.notificationChannels)
          : JSON.stringify(['sms', 'email']), // Default channels
      };

      const savedContact = await this.emergencyContactModel.create(contactData, {
        transaction,
      });

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
    return await this.withTransaction(async (transaction) => {
      const existingContact = await this.getEmergencyContactById(id);

      // Validate update data
      this.validationService.validateContactUpdate(data, existingContact);

      // Handle priority changes with PRIMARY contact enforcement
      if (data.priority !== undefined && data.priority !== existingContact.priority) {
        await this.validatePriorityChange(existingContact, data.priority, transaction);
      }

      // Handle deactivation - ensure at least one PRIMARY contact remains active
      if (
        data.isActive === false &&
        existingContact.isActive &&
        existingContact.priority === ContactPriority.PRIMARY
      ) {
        await this.validatePrimaryContactDeactivation(existingContact.studentId, transaction);
      }

      // Prepare update data with serialized notification channels
      const updateData: any = { ...data };
      if ((data as any).notificationChannels) {
        updateData.notificationChannels = JSON.stringify((data as any).notificationChannels);
      }

      await existingContact.update(updateData, { transaction });
      return existingContact;
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
    return await this.withTransaction(async (transaction) => {
      const contact = await this.getEmergencyContactById(id);

      // Prevent deletion if this is the only active PRIMARY contact
      if (contact.isActive && contact.priority === ContactPriority.PRIMARY) {
        await this.validatePrimaryContactDeactivation(contact.studentId, transaction);
      }

      await contact.update({ isActive: false }, { transaction });

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
  private async validatePrimaryContactLimit(studentId: string, transaction?: Transaction): Promise<void> {
    const existingPrimaryContacts = await this.emergencyContactModel.count({
      where: {
        studentId,
        priority: ContactPriority.PRIMARY,
        isActive: true,
      },
      transaction,
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
    existingContact: EmergencyContact,
    newPriority: ContactPriority,
    transaction?: Transaction,
  ): Promise<void> {
    if (newPriority === ContactPriority.PRIMARY) {
      // Upgrading to PRIMARY - check limit using base service count method
      const existingPrimaryContacts = await this.emergencyContactModel.count({
        where: {
          studentId: existingContact.studentId,
          priority: ContactPriority.PRIMARY,
          isActive: true,
        },
        transaction,
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
      const otherPrimaryContacts = await this.emergencyContactModel.count({
        where: {
          studentId: existingContact.studentId,
          priority: ContactPriority.PRIMARY,
          isActive: true,
        },
        transaction,
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
    studentId: string,
    transaction?: Transaction,
  ): Promise<void> {
    const activePrimaryContacts = await this.emergencyContactModel.count({
      where: {
        studentId,
        priority: ContactPriority.PRIMARY,
        isActive: true,
      },
      transaction,
    });

    if (activePrimaryContacts <= 1) {
      // <= 1 because this includes the current contact
      throw new BadRequestException(
        'Cannot deactivate the only active PRIMARY contact. Student must have at least one active PRIMARY contact.',
      );
    }
  }

  private async withTransaction<T>(handler: (transaction: Transaction | undefined) => Promise<T>): Promise<T> {
    const sequelize = this.emergencyContactModel.sequelize;
    if (!sequelize) {
      return handler(undefined);
    }

    return sequelize.transaction(async (transaction) => handler(transaction));
  }

}
