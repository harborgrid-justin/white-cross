/**
 * @fileoverview Contact Management Routes (v1)
 *
 * RESTful API endpoints for CRM-style contact management in the White Cross
 * Healthcare Platform. Supports emergency contacts, healthcare providers,
 * school staff, and external stakeholders with comprehensive relationship tracking.
 *
 * **Inspired by**: TwentyHQ CRM contact API patterns
 *
 * **Route Categories (9 routes):**
 * - Contact CRUD: Create, Read, Update, Deactivate (5 routes)
 * - Search & Filter: Search and relation-based queries (2 routes)
 * - Lifecycle: Activate/Deactivate contacts (soft delete) (2 routes)
 * - Analytics: Contact statistics by type (1 route)
 *
 * **Contact Types:**
 * - EMERGENCY: Primary and secondary emergency contacts for students
 * - GUARDIAN: Legal guardians and parents
 * - PROVIDER: External healthcare providers (doctors, specialists)
 * - STAFF: School staff (teachers, administrators, counselors)
 * - VENDOR: External service vendors
 * - OTHER: Miscellaneous contacts
 *
 * **Security Features:**
 * - All routes require JWT authentication
 * - Fine-grained permissions via requirePermission middleware
 * - Soft delete pattern (audit trail preservation)
 * - User tracking for all mutations (createdBy, updatedBy, deletedBy)
 *
 * **Data Management:**
 * - Pagination with configurable limit (max 100 per page)
 * - Multi-field sorting (orderBy + orderDirection)
 * - Advanced filtering (type, active status, relation, search)
 * - Full-text search across name, email, and organization
 *
 * **PHI Considerations:**
 * While contacts themselves may not contain PHI, relationships to students
 * and health data require HIPAA compliance. All operations are audit-logged.
 *
 * @module routes/v1/core/contacts/contacts.routes
 * @requires @hapi/hapi
 * @requires joi
 * @requires ../../../../services/contact
 * @requires ../../../../database/models/core/Contact
 * @requires ../../../../shared/permissions/middleware
 * @requires ../../../../shared/permissions
 * @see {@link module:services/contact} for business logic
 * @see {@link module:database/models/core/Contact} for Contact model
 * @see {@link https://twenty.com/} TwentyHQ CRM inspiration
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // List all emergency contacts with pagination
 * GET /api/v1/contacts?type=EMERGENCY&page=1&limit=20&orderBy=lastName
 * Authorization: Bearer <token>
 *
 * // Create new emergency contact
 * POST /api/v1/contacts
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "type": "EMERGENCY",
 *   "phone": "555-0100",
 *   "email": "john.doe@example.com",
 *   "relationTo": "student-uuid",
 *   "relationshipType": "Parent"
 * }
 *
 * // Search contacts by name
 * GET /api/v1/contacts/search?query=john&limit=10
 *
 * // Get all contacts for a specific student
 * GET /api/v1/contacts/by-relation/{studentId}?type=EMERGENCY
 * ```
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import ContactService from '../../../../services/contact';
import { ContactType } from '../../../../database/models/core/Contact';
import { requirePermission } from '../../../../shared/permissions/middleware';
import { Resource, Action } from '../../../../shared/permissions';

/**
 * Contact management route collection.
 *
 * Complete set of 9 RESTful endpoints for CRM-style contact management.
 * Implements pagination, search, filtering, and soft delete patterns
 * inspired by modern CRM systems like TwentyHQ.
 *
 * **Route Breakdown:**
 * - GET /contacts: List with pagination, filtering, sorting
 * - GET /contacts/{id}: Get single contact by ID
 * - POST /contacts: Create new contact
 * - PUT /contacts/{id}: Update existing contact
 * - POST /contacts/{id}/deactivate: Soft delete (preserves audit trail)
 * - POST /contacts/{id}/activate: Restore deactivated contact
 * - GET /contacts/search: Full-text search
 * - GET /contacts/by-relation/{relationTo}: Get contacts for student/user
 * - GET /contacts/stats: Contact statistics by type
 *
 * **Permissions:**
 * All routes use fine-grained permission checks:
 * - List/Read: Contact:List and Contact:Read permissions
 * - Create: Contact:Create permission
 * - Update: Contact:Update permission
 * - Delete: Contact:Delete permission (for deactivation)
 *
 * **Soft Delete Pattern:**
 * Contacts are never hard-deleted. Deactivation sets:
 * - isActive = false
 * - deletedAt = current timestamp
 * - deletedBy = current user ID
 *
 * This preserves audit trail and allows restoration via activation.
 *
 * @const {ServerRoute[]}
 */
export const contactRoutes: ServerRoute[] = [
  // Get all contacts
  {
    method: 'GET',
    path: '/api/v1/contacts',
    options: {
      auth: 'jwt',
      pre: [
        requirePermission({
          resource: Resource.Contact,
          action: Action.List,
        }),
      ],
      tags: ['api', 'contacts'],
      description: 'Get all contacts with pagination and filters',
      notes: 'Returns paginated list of contacts. Supports filtering by type, status, relation, and search.',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          orderBy: Joi.string().default('lastName'),
          orderDirection: Joi.string().valid('ASC', 'DESC').default('ASC'),
          type: Joi.string().valid(...Object.values(ContactType)),
          isActive: Joi.boolean(),
          relationTo: Joi.string().uuid(),
          search: Joi.string(),
        }),
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Successfully retrieved contacts' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Permission denied' },
          },
        },
      },
    },
    handler: async (request, h) => {
      const { page, limit, orderBy, orderDirection, type, isActive, relationTo, search } =
        request.query as any;

      const filters: any = {};
      if (type) filters.type = type;
      if (isActive !== undefined) filters.isActive = isActive;
      if (relationTo) filters.relationTo = relationTo;
      if (search) filters.search = search;

      const result = await ContactService.getContacts(filters, {
        page,
        limit,
        orderBy,
        orderDirection,
      });

      return h.response(result).code(200);
    },
  },

  // Get contact by ID
  {
    method: 'GET',
    path: '/api/v1/contacts/{id}',
    options: {
      auth: 'jwt',
      pre: [
        requirePermission({
          resource: Resource.Contact,
          action: Action.Read,
        }),
      ],
      tags: ['api', 'contacts'],
      description: 'Get contact by ID',
      notes: 'Returns detailed information about a specific contact',
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Successfully retrieved contact' },
            '404': { description: 'Contact not found' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Permission denied' },
          },
        },
      },
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const contact = await ContactService.getContactById(id);
      return h.response(contact).code(200);
    },
  },

  // Create contact
  {
    method: 'POST',
    path: '/api/v1/contacts',
    options: {
      auth: 'jwt',
      pre: [
        requirePermission({
          resource: Resource.Contact,
          action: Action.Create,
        }),
      ],
      tags: ['api', 'contacts'],
      description: 'Create new contact',
      notes: 'Creates a new contact record. Requires firstName, lastName, and type.',
      validate: {
        payload: Joi.object({
          firstName: Joi.string().min(1).max(100).required(),
          lastName: Joi.string().min(1).max(100).required(),
          email: Joi.string().email(),
          phone: Joi.string().max(20),
          type: Joi.string()
            .valid(...Object.values(ContactType))
            .required(),
          organization: Joi.string().max(200),
          title: Joi.string().max(100),
          address: Joi.string().max(255),
          city: Joi.string().max(100),
          state: Joi.string().max(50),
          zip: Joi.string().max(20),
          relationTo: Joi.string().uuid(),
          relationshipType: Joi.string().max(50),
          customFields: Joi.object(),
          isActive: Joi.boolean(),
          notes: Joi.string(),
        }),
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Contact created successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Permission denied' },
          },
        },
      },
    },
    handler: async (request, h) => {
      const user = request.auth.credentials as any;
      const contact = await ContactService.createContact(request.payload as any, user?.id);
      return h.response(contact).code(201);
    },
  },

  // Update contact
  {
    method: 'PUT',
    path: '/api/v1/contacts/{id}',
    options: {
      auth: 'jwt',
      pre: [
        requirePermission({
          resource: Resource.Contact,
          action: Action.Update,
        }),
      ],
      tags: ['api', 'contacts'],
      description: 'Update contact',
      notes: 'Updates an existing contact record',
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        payload: Joi.object({
          firstName: Joi.string().min(1).max(100),
          lastName: Joi.string().min(1).max(100),
          email: Joi.string().email(),
          phone: Joi.string().max(20),
          type: Joi.string().valid(...Object.values(ContactType)),
          organization: Joi.string().max(200),
          title: Joi.string().max(100),
          address: Joi.string().max(255),
          city: Joi.string().max(100),
          state: Joi.string().max(50),
          zip: Joi.string().max(20),
          relationTo: Joi.string().uuid(),
          relationshipType: Joi.string().max(50),
          customFields: Joi.object(),
          isActive: Joi.boolean(),
          notes: Joi.string(),
        }),
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Contact updated successfully' },
            '400': { description: 'Invalid input data' },
            '404': { description: 'Contact not found' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Permission denied' },
          },
        },
      },
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const user = request.auth.credentials as any;
      const contact = await ContactService.updateContact(id, request.payload as any, user?.id);
      return h.response(contact).code(200);
    },
  },

  // Deactivate contact (soft delete)
  {
    method: 'POST',
    path: '/api/v1/contacts/{id}/deactivate',
    options: {
      auth: 'jwt',
      pre: [
        requirePermission({
          resource: Resource.Contact,
          action: Action.Delete,
        }),
      ],
      tags: ['api', 'contacts'],
      description: 'Deactivate contact (soft delete)',
      notes: 'Soft deletes a contact record by setting isActive = false and deletedAt timestamp. Maintains audit trail.',
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '204': { description: 'Contact deactivated successfully (no content)' },
            '404': { description: 'Contact not found' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Permission denied' },
            '500': { description: 'Internal server error' },
          },
        },
      },
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const user = request.auth.credentials as any;
      await ContactService.deactivateContact(id, user?.id);
      return h.response().code(204);
    },
  },

  // Activate contact (restore from soft delete)
  {
    method: 'POST',
    path: '/api/v1/contacts/{id}/activate',
    options: {
      auth: 'jwt',
      pre: [
        requirePermission({
          resource: Resource.Contact,
          action: Action.Update,
        }),
      ],
      tags: ['api', 'contacts'],
      description: 'Activate contact (restore from soft delete)',
      notes: 'Reactivates a previously deactivated contact by setting isActive = true and clearing deletedAt/deletedBy.',
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '204': { description: 'Contact activated successfully (no content)' },
            '404': { description: 'Contact not found' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Permission denied' },
            '500': { description: 'Internal server error' },
          },
        },
      },
    },
    handler: async (request, h) => {
      const { id } = request.params;
      await ContactService.activateContact(id);
      return h.response().code(204);
    },
  },

  // Search contacts
  {
    method: 'GET',
    path: '/api/v1/contacts/search',
    options: {
      auth: 'jwt',
      pre: [
        requirePermission({
          resource: Resource.Contact,
          action: Action.List,
        }),
      ],
      tags: ['api', 'contacts'],
      description: 'Search contacts',
      notes: 'Search contacts by name, email, or organization',
      validate: {
        query: Joi.object({
          query: Joi.string().required(),
          limit: Joi.number().integer().min(1).max(100).default(10),
        }),
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Successfully searched contacts' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Permission denied' },
          },
        },
      },
    },
    handler: async (request, h) => {
      const { query, limit } = request.query as any;
      const contacts = await ContactService.searchContacts(query, limit);
      return h.response(contacts).code(200);
    },
  },

  // Get contacts by relation
  {
    method: 'GET',
    path: '/api/v1/contacts/by-relation/{relationTo}',
    options: {
      auth: 'jwt',
      pre: [
        requirePermission({
          resource: Resource.Contact,
          action: Action.List,
        }),
      ],
      tags: ['api', 'contacts'],
      description: 'Get contacts by relation',
      notes: 'Get all contacts related to a specific student or user',
      validate: {
        params: Joi.object({
          relationTo: Joi.string().uuid().required(),
        }),
        query: Joi.object({
          type: Joi.string().valid(...Object.values(ContactType)),
        }),
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Successfully retrieved related contacts' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Permission denied' },
          },
        },
      },
    },
    handler: async (request, h) => {
      const { relationTo } = request.params;
      const { type } = request.query as any;
      const contacts = await ContactService.getContactsByRelation(relationTo, type);
      return h.response(contacts).code(200);
    },
  },

  // Get contact statistics
  {
    method: 'GET',
    path: '/api/v1/contacts/stats',
    options: {
      auth: 'jwt',
      pre: [
        requirePermission({
          resource: Resource.Contact,
          action: Action.List,
        }),
      ],
      tags: ['api', 'contacts'],
      description: 'Get contact statistics',
      notes: 'Returns statistics about contacts by type',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Successfully retrieved statistics' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Permission denied' },
          },
        },
      },
    },
    handler: async (request, h) => {
      const stats = await ContactService.getContactStats();
      return h.response(stats).code(200);
    },
  },
];

export default contactRoutes;
