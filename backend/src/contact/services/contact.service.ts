/**
 * Contact Service
 * @description Service for managing general contacts (guardians, staff, vendors, providers)
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { Contact } from '../entities';
import { CreateContactDto, UpdateContactDto, ContactQueryDto } from '../dto';
import { ContactType } from '../enums';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>
  ) {}

  /**
   * Get all contacts with pagination and filters
   */
  async getContacts(query: ContactQueryDto) {
    const { page = 1, limit = 20, orderBy = 'lastName', orderDirection = 'ASC' } = query;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (query.type) {
      where.type = Array.isArray(query.type) ? In(query.type) : query.type;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.relationTo) {
      where.relationTo = query.relationTo;
    }

    // Handle search across multiple fields
    let searchWhere = undefined;
    if (query.search) {
      searchWhere = [
        { ...where, firstName: ILike(`%${query.search}%`) },
        { ...where, lastName: ILike(`%${query.search}%`) },
        { ...where, email: ILike(`%${query.search}%`) },
        { ...where, organization: ILike(`%${query.search}%`) }
      ];
    }

    const [contacts, total] = await this.contactRepository.findAndCount({
      where: searchWhere || where,
      skip: offset,
      take: limit,
      order: { [orderBy]: orderDirection }
    });

    this.logger.log(`Retrieved ${contacts.length} contacts (page ${page}, total ${total})`);

    return {
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get contact by ID
   */
  async getContactById(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

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
      const existingContact = await this.contactRepository.findOne({
        where: {
          email: dto.email,
          type: dto.type,
          isActive: true
        }
      });

      if (existingContact) {
        throw new ConflictException(
          `A ${dto.type} contact with this email already exists`
        );
      }
    }

    const contact = this.contactRepository.create({
      ...dto,
      isActive: dto.isActive !== undefined ? dto.isActive : true
    });

    const savedContact = await this.contactRepository.save(contact);
    this.logger.log(`Created contact ${savedContact.id} (${savedContact.fullName})`);

    return savedContact;
  }

  /**
   * Update contact
   */
  async updateContact(id: string, dto: UpdateContactDto): Promise<Contact> {
    const contact = await this.getContactById(id);

    // Check for duplicate email if being updated
    if (dto.email && dto.email !== contact.email) {
      const existingContact = await this.contactRepository.findOne({
        where: {
          email: dto.email,
          type: dto.type || contact.type,
          isActive: true
        }
      });

      if (existingContact && existingContact.id !== id) {
        throw new ConflictException('Another contact with this email already exists');
      }
    }

    Object.assign(contact, dto);
    const updatedContact = await this.contactRepository.save(contact);

    this.logger.log(`Updated contact ${updatedContact.id}`);
    return updatedContact;
  }

  /**
   * Delete contact (soft delete)
   */
  async deleteContact(id: string): Promise<{ success: boolean; message: string }> {
    const contact = await this.getContactById(id);
    await this.contactRepository.softRemove(contact);

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

    const updated = await this.contactRepository.save(contact);
    this.logger.log(`Deactivated contact ${id}`);

    return updated;
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

    const updated = await this.contactRepository.save(contact);
    this.logger.log(`Reactivated contact ${id}`);

    return updated;
  }

  /**
   * Get contacts by relation (e.g., all guardians for a student)
   */
  async getContactsByRelation(relationTo: string, type?: ContactType): Promise<Contact[]> {
    const where: any = {
      relationTo,
      isActive: true
    };

    if (type) {
      where.type = type;
    }

    const contacts = await this.contactRepository.find({
      where,
      order: { lastName: 'ASC' }
    });

    this.logger.log(`Retrieved ${contacts.length} contacts for relation ${relationTo}`);
    return contacts;
  }

  /**
   * Search contacts
   */
  async searchContacts(query: string, limit: number = 10): Promise<Contact[]> {
    const contacts = await this.contactRepository.find({
      where: [
        { firstName: ILike(`%${query}%`), isActive: true },
        { lastName: ILike(`%${query}%`), isActive: true },
        { email: ILike(`%${query}%`), isActive: true },
        { organization: ILike(`%${query}%`), isActive: true }
      ],
      take: limit,
      order: { lastName: 'ASC' }
    });

    this.logger.log(`Search for "${query}" returned ${contacts.length} results`);
    return contacts;
  }

  /**
   * Get contact statistics
   */
  async getContactStats(): Promise<{ total: number; byType: Record<string, number> }> {
    const total = await this.contactRepository.count({ where: { isActive: true } });

    // Get count by type
    const byTypeResults = await this.contactRepository
      .createQueryBuilder('contact')
      .select('contact.type', 'type')
      .addSelect('COUNT(contact.id)', 'count')
      .where('contact.isActive = :isActive', { isActive: true })
      .groupBy('contact.type')
      .getRawMany();

    const byType: Record<string, number> = {};
    byTypeResults.forEach((result) => {
      byType[result.type] = parseInt(result.count, 10);
    });

    this.logger.log(`Contact statistics: ${total} total, ${Object.keys(byType).length} types`);

    return { total, byType };
  }
}
