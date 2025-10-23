/**
 * LOC: CONTACT-SVC-001
 * WC-SVC-CON-001 | Contact Service Main
 * 
 * Purpose: Contact management service for CRM-style contact handling
 * Upstream: Contact model, Permission system
 * Downstream: Contact routes, GraphQL resolvers
 * Related: Student service, User service, Activity service
 * Exports: ContactService class
 * Last Updated: 2025-10-23 | File Type: .ts
 * Critical Path: Route → ContactService → Database → Response
 * LLM Context: HIPAA-compliant contact management inspired by TwentyHQ CRM
 */

import { Op, WhereOptions } from 'sequelize';
import { Contact, ContactType, ContactAttributes } from '../../database/models/core/Contact';
import { ErrorFactory } from '../../shared/errors';

/**
 * Contact filter options
 */
export interface ContactFilters {
  type?: ContactType | ContactType[];
  isActive?: boolean;
  relationTo?: string;
  search?: string; // Search by name or email
}

/**
 * Contact pagination options
 */
export interface ContactPaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Contact Service
 * Handles CRUD operations and business logic for contacts
 */
export class ContactService {
  /**
   * Get all contacts with pagination and filters
   */
  static async getContacts(
    filters: ContactFilters = {},
    pagination: ContactPaginationOptions = {}
  ) {
    const { page = 1, limit = 20, orderBy = 'lastName', orderDirection = 'ASC' } = pagination;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: WhereOptions<ContactAttributes> = {};

    if (filters.type) {
      where.type = Array.isArray(filters.type) ? { [Op.in]: filters.type } : filters.type;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.relationTo) {
      where.relationTo = filters.relationTo;
    }

    if (filters.search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${filters.search}%` } },
        { lastName: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } },
        { organization: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    const { rows: contacts, count: total } = await Contact.findAndCountAll({
      where,
      limit,
      offset,
      order: [[orderBy, orderDirection]],
    });

    return {
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get contact by ID
   */
  static async getContactById(id: string) {
    const contact = await Contact.findByPk(id);

    if (!contact) {
      throw ErrorFactory.notFound('Contact', id);
    }

    return contact;
  }

  /**
   * Create new contact
   */
  static async createContact(data: Partial<ContactAttributes>, createdBy?: string) {
    // Validate required fields
    if (!data.firstName || !data.lastName) {
      throw ErrorFactory.invalidInput('First name and last name are required');
    }

    if (!data.type) {
      throw ErrorFactory.invalidInput('Contact type is required');
    }

    // Validate contact type
    if (!Object.values(ContactType).includes(data.type)) {
      throw ErrorFactory.invalidInput(`Invalid contact type: ${data.type}`);
    }

    // Check for duplicate email if provided
    if (data.email) {
      const existingContact = await Contact.findOne({
        where: {
          email: data.email,
          type: data.type,
          isActive: true,
        },
      });

      if (existingContact) {
        throw ErrorFactory.duplicateEntry(
          'Contact',
          'email',
          `A ${data.type} contact with this email already exists`
        );
      }
    }

    const contact = await Contact.create({
      ...data,
      createdBy,
      isActive: data.isActive !== undefined ? data.isActive : true,
    } as ContactAttributes);

    return contact;
  }

  /**
   * Update contact
   */
  static async updateContact(
    id: string,
    data: Partial<ContactAttributes>,
    updatedBy?: string
  ) {
    const contact = await this.getContactById(id);

    // Validate contact type if being updated
    if (data.type && !Object.values(ContactType).includes(data.type)) {
      throw ErrorFactory.invalidInput(`Invalid contact type: ${data.type}`);
    }

    // Check for duplicate email if being updated
    if (data.email && data.email !== contact.email) {
      const existingContact = await Contact.findOne({
        where: {
          email: data.email,
          type: data.type || contact.type,
          isActive: true,
          id: { [Op.ne]: id },
        },
      });

      if (existingContact) {
        throw ErrorFactory.duplicateEntry(
          'Contact',
          'email',
          'Another contact with this email already exists'
        );
      }
    }

    await contact.update({
      ...data,
      updatedBy,
    });

    return contact;
  }

  /**
   * Delete contact (soft delete)
   */
  static async deleteContact(id: string) {
    const contact = await this.getContactById(id);
    await contact.destroy(); // Soft delete via paranoid
    return { success: true, message: 'Contact deleted successfully' };
  }

  /**
   * Deactivate contact
   */
  static async deactivateContact(id: string, updatedBy?: string) {
    const contact = await this.getContactById(id);
    await contact.update({ isActive: false, updatedBy });
    return contact;
  }

  /**
   * Reactivate contact
   */
  static async reactivateContact(id: string, updatedBy?: string) {
    const contact = await this.getContactById(id);
    await contact.update({ isActive: true, updatedBy });
    return contact;
  }

  /**
   * Get contacts by relation (e.g., all guardians for a student)
   */
  static async getContactsByRelation(relationTo: string, type?: ContactType) {
    const where: WhereOptions<ContactAttributes> = {
      relationTo,
      isActive: true,
    };

    if (type) {
      where.type = type;
    }

    const contacts = await Contact.findAll({
      where,
      order: [['lastName', 'ASC']],
    });

    return contacts;
  }

  /**
   * Search contacts
   */
  static async searchContacts(query: string, limit: number = 10) {
    const contacts = await Contact.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
          { organization: { [Op.iLike]: `%${query}%` } },
        ],
        isActive: true,
      },
      limit,
      order: [['lastName', 'ASC']],
    });

    return contacts;
  }

  /**
   * Get contact statistics
   */
  static async getContactStats() {
    const total = await Contact.count({ where: { isActive: true } });
    const byType = await Contact.findAll({
      attributes: [
        'type',
        [Contact.sequelize!.fn('COUNT', Contact.sequelize!.col('id')), 'count'],
      ],
      where: { isActive: true },
      group: ['type'],
      raw: true,
    });

    return {
      total,
      byType: byType.reduce((acc: any, item: any) => {
        acc[item.type] = parseInt(item.count, 10);
        return acc;
      }, {}),
    };
  }
}

export default ContactService;
