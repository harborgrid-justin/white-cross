/**
 * Emergency Contact Service
 * @description Service for managing student emergency contacts with verification and notification routing
 */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { EmergencyContact } from '../../database/models/emergency-contact.model';
import {
  ContactCreateEmergencyDto,
  ContactUpdateEmergencyDto,
  ContactVerifyDto,
  EmergencyContactQueryDto,
} from '../dto';
import { ContactPriority, VerificationStatus } from '../enums';

@Injectable()
export class EmergencyContactService {
  private readonly logger = new Logger(EmergencyContactService.name);

  constructor(
    @InjectModel(EmergencyContact)
    private readonly emergencyContactModel: typeof EmergencyContact,
  ) {}

  /**
   * Find all emergency contacts with optional filters
   */
  async findAll(query: EmergencyContactQueryDto) {
    const { page = 1, limit = 20 } = query;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (query.studentId) {
      where.studentId = query.studentId;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.verificationStatus) {
      where.verificationStatus = query.verificationStatus;
    }

    const { rows: contacts, count: total } =
      await this.emergencyContactModel.findAndCountAll({
        where,
        offset,
        limit,
        order: [
          ['priority', 'ASC'],
          ['createdAt', 'ASC'],
        ],
      });

    this.logger.log(
      `Retrieved ${contacts.length} emergency contacts (page ${page}, total ${total})`,
    );

    return {
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find all emergency contacts for a specific student
   */
  async findAllByStudent(studentId: string): Promise<EmergencyContact[]> {
    const contacts = await this.emergencyContactModel.findAll({
      where: {
        studentId,
        isActive: true,
      },
      order: [
        ['priority', 'ASC'],
        ['createdAt', 'ASC'],
      ],
    });

    this.logger.log(
      `Retrieved ${contacts.length} emergency contacts for student ${studentId}`,
    );
    return contacts;
  }

  /**
   * Find one emergency contact by ID
   */
  async findOne(id: string): Promise<EmergencyContact> {
    const contact = await this.emergencyContactModel.findByPk(id);

    if (!contact) {
      throw new NotFoundException(`Emergency contact with ID ${id} not found`);
    }

    return contact;
  }

  /**
   * Create new emergency contact
   */
  async create(dto: ContactCreateEmergencyDto): Promise<EmergencyContact> {
    // Validate required fields
    if (!dto.studentId) {
      throw new BadRequestException('Student ID is required');
    }

    if (!dto.firstName || !dto.lastName) {
      throw new BadRequestException('First name and last name are required');
    }

    if (!dto.phoneNumber) {
      throw new BadRequestException('Phone number is required');
    }

    // Convert notification channels array to JSON string if provided
    let notificationChannelsString: string | undefined;
    if (dto.notificationChannels && Array.isArray(dto.notificationChannels)) {
      notificationChannelsString = JSON.stringify(dto.notificationChannels);
    }

    const contact = this.emergencyContactModel.build({
      ...dto,
      notificationChannels: notificationChannelsString,
      verificationStatus:
        dto.verificationStatus || VerificationStatus.UNVERIFIED,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
    } as any);

    await contact.save();
    this.logger.log(
      `Created emergency contact ${contact.id} for student ${contact.studentId}`,
    );

    return contact;
  }

  /**
   * Update emergency contact
   */
  async update(
    id: string,
    dto: ContactUpdateEmergencyDto,
  ): Promise<EmergencyContact> {
    const contact = await this.findOne(id);

    // Convert notification channels array to JSON string if provided
    let notificationChannelsString: string | undefined;
    if (dto.notificationChannels && Array.isArray(dto.notificationChannels)) {
      notificationChannelsString = JSON.stringify(dto.notificationChannels);
    }

    Object.assign(contact, {
      ...dto,
      notificationChannels:
        notificationChannelsString || contact.notificationChannels,
    });

    await contact.save();
    this.logger.log(`Updated emergency contact ${id}`);

    return contact;
  }

  /**
   * Remove emergency contact
   */
  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const contact = await this.findOne(id);

    // Check if this is the last PRIMARY contact for the student
    const primaryContacts = await this.emergencyContactModel.findAll({
      where: {
        studentId: contact.studentId,
        priority: ContactPriority.PRIMARY,
        isActive: true,
      },
    });

    if (primaryContacts.length === 1 && primaryContacts[0].id === id) {
      throw new BadRequestException(
        'Cannot delete the last primary contact. Student must have at least one primary contact.',
      );
    }

    await contact.destroy();
    this.logger.log(`Removed emergency contact ${id}`);

    return { success: true, message: 'Emergency contact deleted successfully' };
  }

  /**
   * Verify contact
   */
  async verifyContact(
    id: string,
    dto: ContactVerifyDto,
  ): Promise<EmergencyContact> {
    const contact = await this.findOne(id);

    contact.verificationStatus = dto.verificationStatus;

    if (dto.verificationStatus === VerificationStatus.VERIFIED) {
      contact.lastVerifiedAt = new Date();
    }

    if (dto.notes) {
      contact.notes = dto.notes;
    }

    await contact.save();
    this.logger.log(
      `Verified emergency contact ${id} with status ${dto.verificationStatus}`,
    );

    return contact;
  }

  /**
   * Get notification routing for a student
   * Returns contacts in priority order with their notification channels
   */
  async getNotificationRouting(studentId: string): Promise<{
    primary: EmergencyContact[];
    secondary: EmergencyContact[];
    emergencyOnly: EmergencyContact[];
  }> {
    const allContacts = await this.findAllByStudent(studentId);

    const primary = allContacts.filter(
      (c) => c.priority === ContactPriority.PRIMARY,
    );
    const secondary = allContacts.filter(
      (c) => c.priority === ContactPriority.SECONDARY,
    );
    const emergencyOnly = allContacts.filter(
      (c) => c.priority === ContactPriority.EMERGENCY_ONLY,
    );

    this.logger.log(
      `Notification routing for student ${studentId}: ${primary.length} primary, ${secondary.length} secondary, ${emergencyOnly.length} emergency-only`,
    );

    return {
      primary,
      secondary,
      emergencyOnly,
    };
  }

  /**
   * Get primary contacts for a student
   */
  async getPrimaryContacts(studentId: string): Promise<EmergencyContact[]> {
    const contacts = await this.emergencyContactModel.findAll({
      where: {
        studentId,
        priority: ContactPriority.PRIMARY,
        isActive: true,
      },
      order: [['createdAt', 'ASC']],
    });

    return contacts;
  }

  /**
   * Get authorized pickup contacts for a student
   */
  async getAuthorizedPickupContacts(
    studentId: string,
  ): Promise<EmergencyContact[]> {
    const contacts = await this.emergencyContactModel.findAll({
      where: {
        studentId,
        canPickupStudent: true,
        isActive: true,
      },
      order: [
        ['priority', 'ASC'],
        ['lastName', 'ASC'],
      ],
    });

    this.logger.log(
      `Retrieved ${contacts.length} authorized pickup contacts for student ${studentId}`,
    );
    return contacts;
  }
}
