/**
 * Contact Service
 * @description Service for managing general contacts (guardians, staff, vendors, providers)
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Contact } from '../../database/models/contact.model';
import { CreateContactDto, UpdateContactDto, ContactQueryDto } from '../dto';
import { ContactType } from '../enums';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectModel(Contact)
    private readonly contactModel: typeof Contact,
  ) {}

  /**
   * Get all contacts with pagination and filters
   */
  async getContacts(query: ContactQueryDto) {
    const {
      page = 1,
      limit = 20,
      orderBy = 'lastName',
      orderDirection = 'ASC',
    } = query;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (query.type) {
      where.type = Array.isArray(query.type)
        ? { [Op.in]: query.type }
        : query.type;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.relationTo) {
      where.relationTo = query.relationTo;
    }

    // Handle search across multiple fields
    let searchWhere: any[] | undefined = undefined;
    if (query.search) {
      searchWhere = [
        { firstName: { [Op.iLike]: `%${query.search}%` } },
        { lastName: { [Op.iLike]: `%${query.search}%` } },
        { email: { [Op.iLike]: `%${query.search}%` } },
        { organization: { [Op.iLike]: `%${query.search}%` } },
      ];
    }

    const finalWhere = searchWhere ? { [Op.or]: searchWhere, ...where } : where;

    const { rows: contacts, count: total } =
      await this.contactModel.findAndCountAll({
        where: finalWhere,
        offset,
        limit,
        order: [[orderBy, orderDirection]],
      });

    this.logger.log(
      `Retrieved ${contacts.length} contacts (page ${page}, total ${total})`,
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
   * Get contact by ID
   */
  async getContactById(id: string): Promise<Contact> {
    this.logger.log(`Retrieving contact with ID: ${id}`);

    const contact = await this.contactModel.findByPk(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    this.logger.log(
      `Retrieved contact: ${contact.firstName} ${contact.lastName}`,
    );
    return contact;
  }

  /**
   * Create new contact
   */
  async createContact(dto: CreateContactDto): Promise<Contact> {
    // Validate required fields
    if (!dto.firstName || !dto.lastName) {
      throw new BadRequestException('First name and last name are required');
    }

    if (!dto.type) {
      throw new BadRequestException('Contact type is required');
    }

    // Check for duplicate email if provided
    if (dto.email) {
      const existingContact = await this.contactModel.findOne({
        where: {
          email: dto.email,
          type: dto.type,
          isActive: true,
        },
      });

      if (existingContact) {
        throw new ConflictException(
          `A ${dto.type} contact with this email already exists`,
        );
      }
    }

    const contact = this.contactModel.build({
      ...dto,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
    } as any);

    await contact.save();

    this.logger.log(
      `Created contact ${contact.id} (${contact.firstName} ${contact.lastName})`,
    );

    return contact;
  }

  /**
   * Update contact
   */
  async updateContact(id: string, dto: UpdateContactDto): Promise<Contact> {
    const contact = await this.getContactById(id);

    // Check for duplicate email if being updated
    if (dto.email && dto.email !== contact.email) {
      const existingContact = await this.contactModel.findOne({
        where: {
          email: dto.email,
          type: dto.type || contact.type,
          isActive: true,
          id: { [Op.ne]: id },
        },
      });

      if (existingContact) {
        throw new ConflictException(
          'Another contact with this email already exists',
        );
      }
    }

    Object.assign(contact, dto);
    await contact.save();

    this.logger.log(`Updated contact ${contact.id}`);
    return contact;
  }

  /**
   * Delete contact (soft delete)
   */
  async deleteContact(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const contact = await this.getContactById(id);
    contact.isActive = false;
    await contact.save();

    this.logger.log(`Soft deleted contact ${id}`);
    return { success: true, message: 'Contact deleted successfully' };
  }

  /**
   * Deactivate contact
   */
  async deactivateContact(id: string, updatedBy?: string): Promise<Contact> {
    const contact = await this.getContactById(id);
    contact.isActive = false;
    if (updatedBy) {
      contact.updatedBy = updatedBy;
    }

    await contact.save();
    this.logger.log(`Deactivated contact ${id}`);

    return contact;
  }

  /**
   * Reactivate contact
   */
  async reactivateContact(id: string, updatedBy?: string): Promise<Contact> {
    const contact = await this.getContactById(id);
    contact.isActive = true;
    if (updatedBy) {
      contact.updatedBy = updatedBy;
    }

    await contact.save();
    this.logger.log(`Reactivated contact ${id}`);

    return contact;
  }

  /**
   * Get contacts by relation (e.g., all guardians for a student)
   */
  async getContactsByRelation(
    relationTo: string,
    type?: ContactType,
  ): Promise<Contact[]> {
    const where: any = {
      relationTo,
      isActive: true,
    };

    if (type) {
      where.type = type;
    }

    const contacts = await this.contactModel.findAll({
      where,
      order: [['lastName', 'ASC']],
    });

    this.logger.log(
      `Retrieved ${contacts.length} contacts for relation ${relationTo}`,
    );
    return contacts;
  }

  /**
   * Search contacts
   */
  async searchContacts(query: string, limit: number = 10): Promise<Contact[]> {
    const contacts = await this.contactModel.findAll({
      where: [
        { firstName: { [Op.iLike]: `%${query}%` }, isActive: true },
        { lastName: { [Op.iLike]: `%${query}%` }, isActive: true },
        { email: { [Op.iLike]: `%${query}%` }, isActive: true },
        { organization: { [Op.iLike]: `%${query}%` }, isActive: true },
      ],
      limit,
      order: [['lastName', 'ASC']],
    });

    this.logger.log(
      `Search for "${query}" returned ${contacts.length} results`,
    );
    return contacts;
  }

  /**
   * Get contact statistics
   */
  async getContactStats(): Promise<{
    total: number;
    byType: Record<string, number>;
  }> {
    const total = await this.contactModel.count({ where: { isActive: true } });

    // Get count by type
    const byTypeResults = await this.contactModel.findAll({
      where: { isActive: true },
      attributes: [
        'type',
        [
          this.contactModel.sequelize!.fn(
            'COUNT',
            this.contactModel.sequelize!.col('id'),
          ),
          'count',
        ],
      ],
      group: ['type'],
      raw: true,
    });

    const byType: Record<string, number> = {};
    (byTypeResults as any[]).forEach((result) => {
      byType[result.type] = parseInt(result.count, 10);
    });

    this.logger.log(
      `Contact statistics: ${total} total, ${Object.keys(byType).length} types`,
    );

    return { total, byType };
  }

  /**
   * Batch find contacts by IDs (for DataLoader)
   * Returns contacts in the same order as requested IDs
   */
  async findByIds(ids: string[]): Promise<(Contact | null)[]> {
    try {
      const contacts = await this.contactModel.findAll({
        where: {
          id: { [Op.in]: ids },
        },
      });

      // Create a map for O(1) lookup
      const contactMap = new Map(contacts.map((c) => [c.id, c]));

      // Return in same order as requested IDs, null for missing
      return ids.map((id) => contactMap.get(id) || null);
    } catch (error) {
      this.logger.error(`Failed to batch fetch contacts: ${error.message}`);
      throw new Error('Failed to batch fetch contacts');
    }
  }

  /**
   * Batch find contacts by student IDs (for DataLoader)
   * Returns array of contact arrays for each student ID
   */
  async findByStudentIds(studentIds: string[]): Promise<Contact[][]> {
    try {
      const contacts = await this.contactModel.findAll({
        where: {
          relationTo: { [Op.in]: studentIds },
          isActive: true,
        },
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ],
      });

      // Group contacts by student ID
      const contactsByStudent = new Map<string, Contact[]>();
      contacts.forEach((contact) => {
        const studentId = contact.relationTo;
        if (studentId) {
          if (!contactsByStudent.has(studentId)) {
            contactsByStudent.set(studentId, []);
          }
          contactsByStudent.get(studentId)!.push(contact);
        }
      });

      // Return contacts array for each student, empty array for missing
      return studentIds.map((id) => contactsByStudent.get(id) || []);
    } catch (error) {
      this.logger.error(
        `Failed to batch fetch contacts by student IDs: ${error.message}`,
      );
      throw new Error('Failed to batch fetch contacts by student IDs');
    }
  }
}
