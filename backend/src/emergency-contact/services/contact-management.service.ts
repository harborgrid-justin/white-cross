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
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { EmergencyContact } from '../../database/models/emergency-contact.model';
import { Student } from '../../database/models/student.model';
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
  ) {}

  /**
   * Get all emergency contacts for a student
   * Returns active contacts ordered by priority
   *
   * @param studentId - Student identifier
   * @returns Array of active emergency contacts
   */
  async getStudentEmergencyContacts(
    studentId: string,
  ): Promise<EmergencyContact[]> {
    try {
      const contacts = await this.emergencyContactModel.findAll({
        where: {
          studentId,
          isActive: true,
        },
        order: [
          ['priority', 'ASC'],
          ['firstName', 'ASC'],
        ],
      });

      this.logger.log(
        `Retrieved ${contacts.length} emergency contacts for student ${studentId}`,
      );
      return contacts;
    } catch (error) {
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
    try {
      const contact = await this.emergencyContactModel.findOne({
        where: { id },
      });

      if (!contact) {
        throw new NotFoundException('Emergency contact not found');
      }

      this.logger.log(`Retrieved emergency contact: ${id}`);
      return contact;
    } catch (error) {
      this.logger.error(
        `Error getting emergency contact by ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
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
  async createEmergencyContact(
    data: EmergencyContactCreateDto,
  ): Promise<EmergencyContact> {
    if (!this.emergencyContactModel.sequelize) {
      throw new Error('Database connection not available');
    }
    const transaction = await this.emergencyContactModel.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      // Verify student exists and is active
      const student = await this.studentModel.findOne({
        where: { id: data.studentId },
        transaction,
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      if (!student.isActive) {
        throw new BadRequestException(
          'Cannot add emergency contact to inactive student',
        );
      }

      // Validate contact data
      this.validationService.validateContactCreation({
        phoneNumber: data.phoneNumber,
        email: data.email,
        notificationChannels: data.notificationChannels,
      });

      // Check PRIMARY contact limit (max 2 per student)
      if (data.priority === ContactPriority.PRIMARY) {
        await this.validatePrimaryContactLimit(
          data.studentId,
          transaction,
        );
      }

      // Prepare contact data with serialized notification channels
      const contactData = {
        ...data,
        notificationChannels: data.notificationChannels
          ? JSON.stringify(data.notificationChannels)
          : JSON.stringify(['sms', 'email']), // Default channels
      };

      const savedContact = await this.emergencyContactModel.create(
        contactData,
        { transaction },
      );

      await transaction.commit();

      this.logger.log(
        `Emergency contact created: ${savedContact.firstName} ${savedContact.lastName} (${savedContact.priority}) for student ${student.firstName} ${student.lastName}`,
      );

      return savedContact;
    } catch (error) {
      await transaction.rollback();
      // HIPAA-compliant error handling - log details server-side only
      this.logger.error(
        `Error creating emergency contact: ${error.message}`,
        error.stack,
      );

      // Return generic error to client without PHI
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error; // Business logic errors are safe to expose
      }
      throw new Error('Failed to create emergency contact. Please try again.');
    }
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
    if (!this.emergencyContactModel.sequelize) {
      throw new Error('Database connection not available');
    }
    const transaction = await this.emergencyContactModel.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      const existingContact = await this.emergencyContactModel.findOne({
        where: { id },
        transaction,
      });

      if (!existingContact) {
        throw new NotFoundException('Emergency contact not found');
      }

      // Validate update data
      this.validationService.validateContactUpdate(data, existingContact);

      // Handle priority changes with PRIMARY contact enforcement
      if (
        data.priority !== undefined &&
        data.priority !== existingContact.priority
      ) {
        await this.validatePriorityChange(
          id,
          existingContact,
          data.priority,
          transaction,
        );
      }

      // Handle deactivation - ensure at least one PRIMARY contact remains active
      if (
        data.isActive === false &&
        existingContact.isActive &&
        existingContact.priority === ContactPriority.PRIMARY
      ) {
        await this.validatePrimaryContactDeactivation(
          id,
          existingContact.studentId,
          transaction,
        );
      }

      // Prepare update data with serialized notification channels
      const updateData: any = { ...data };
      if (data.notificationChannels) {
        updateData.notificationChannels = JSON.stringify(
          data.notificationChannels,
        );
      }

      await existingContact.update(updateData, { transaction });

      await transaction.commit();

      this.logger.log(
        `Emergency contact updated: ${existingContact.firstName} ${existingContact.lastName}`,
      );

      return existingContact;
    } catch (error) {
      await transaction.rollback();
      // HIPAA-compliant error handling - log details server-side only
      this.logger.error(
        `Error updating emergency contact: ${error.message}`,
        error.stack,
      );

      // Return generic error to client without PHI
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error; // Business logic errors are safe to expose
      }
      throw new Error('Failed to update emergency contact. Please try again.');
    }
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
    if (!this.emergencyContactModel.sequelize) {
      throw new Error('Database connection not available');
    }
    const transaction = await this.emergencyContactModel.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      const contact = await this.emergencyContactModel.findOne({
        where: { id },
        transaction,
      });

      if (!contact) {
        throw new NotFoundException('Emergency contact not found');
      }

      // Prevent deletion if this is the only active PRIMARY contact
      if (contact.isActive && contact.priority === ContactPriority.PRIMARY) {
        await this.validatePrimaryContactDeactivation(
          id,
          contact.studentId,
          transaction,
        );
      }

      await contact.update({ isActive: false }, { transaction });

      await transaction.commit();

      this.logger.log(
        `Emergency contact deleted: ${contact.firstName} ${contact.lastName}`,
      );

      return { success: true };
    } catch (error) {
      await transaction.rollback();
      // HIPAA-compliant error handling - log details server-side only
      this.logger.error(
        `Error deleting emergency contact: ${error.message}`,
        error.stack,
      );

      // Return generic error to client without PHI
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error; // Business logic errors are safe to expose
      }
      throw new Error('Failed to delete emergency contact. Please try again.');
    }
  }

  // ==================== Private Business Rule Validators ====================

  /**
   * Validate PRIMARY contact limit
   * Ensures student doesn't exceed max 2 PRIMARY contacts
   *
   * @param studentId - Student identifier
   * @param transaction - Database transaction
   * @throws BadRequestException if limit exceeded
   */
  private async validatePrimaryContactLimit(
    studentId: string,
    transaction: Transaction,
  ): Promise<void> {
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
   * @param transaction - Database transaction
   * @throws BadRequestException if change would violate business rules
   */
  private async validatePriorityChange(
    contactId: string,
    existingContact: EmergencyContact,
    newPriority: ContactPriority,
    transaction: Transaction,
  ): Promise<void> {
    if (newPriority === ContactPriority.PRIMARY) {
      // Upgrading to PRIMARY - check limit
      const existingPrimaryContacts = await this.emergencyContactModel.count({
        where: {
          studentId: existingContact.studentId,
          priority: ContactPriority.PRIMARY,
          isActive: true,
          id: { [Op.ne]: contactId },
        },
        transaction,
      });

      if (existingPrimaryContacts >= 2) {
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
          id: { [Op.ne]: contactId },
        },
        transaction,
      });

      if (otherPrimaryContacts === 0) {
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
   * @param transaction - Database transaction
   * @throws BadRequestException if deactivation would leave no PRIMARY contacts
   */
  private async validatePrimaryContactDeactivation(
    contactId: string,
    studentId: string,
    transaction: Transaction,
  ): Promise<void> {
    const otherActivePrimaryContacts = await this.emergencyContactModel.count({
      where: {
        studentId,
        priority: ContactPriority.PRIMARY,
        isActive: true,
        id: { [Op.ne]: contactId },
      },
      transaction,
    });

    if (otherActivePrimaryContacts === 0) {
      throw new BadRequestException(
        'Cannot deactivate the only active PRIMARY contact. Student must have at least one active PRIMARY contact.',
      );
    }
  }
}
