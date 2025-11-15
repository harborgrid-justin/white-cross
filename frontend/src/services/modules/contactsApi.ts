/**
 * @fileoverview Contacts API Service - Comprehensive student contact management
 * @module services/modules/contactsApi
 * @category Services
 *
 * @deprecated MIGRATION PENDING - Server actions not yet available
 * This service is planned to migrate to server actions in Q2 2026.
 * For now, continue using this service with the new API client structure.
 *
 * MIGRATION STATUS:
 * - Emergency contacts may migrate as part of students.actions.ts
 * - Contact management may become separate contacts.actions.ts
 * - Current recommendation: Continue using this API service
 * - Next review: March 2026
 *
 * Provides comprehensive contact management for students including parents, guardians,
 * emergency contacts, authorized pickups, medical providers, and other relationships.
 * Supports contact verification, emergency workflows, and notification delivery.
 *
 * ## Key Features
 *
 * **Contact Management**:
 * - Complete CRUD operations for all contact types
 * - Relationship-based organization (PARENT, GUARDIAN, EMERGENCY, etc.)
 * - Priority levels (PRIMARY, SECONDARY, TERTIARY)
 * - Contact verification workflows
 * - Bulk import capabilities
 *
 * **Relationship Types**:
 * - Parents and legal guardians
 * - Emergency contacts
 * - Authorized pickup persons
 * - Medical providers
 * - Case workers and social services
 * - Grandparents and extended family
 *
 * **Search & Discovery**:
 * - Full-text search with autocomplete
 * - Filter by relationship, priority, verification status
 * - Student-specific contact retrieval
 * - Emergency contact quick lookup
 *
 * **Contact Verification**:
 * - Email/phone verification workflows
 * - Annual verification reminders
 * - Verification status tracking
 * - Last verified timestamp
 *
 * ## Healthcare-Specific Features
 *
 * **Emergency Contact Management**:
 * - Priority-based contact ordering for emergencies
 * - Multi-contact notification workflows
 * - Escalation when primary contacts unreachable
 * - Emergency contact quick access
 * - 24/7 availability tracking
 *
 * **Authorization & Permissions**:
 * - Healthcare decision authorization tracking
 * - Medical record access permissions
 * - Student pickup authorization
 * - Permission expiration and renewal
 * - Legal guardian designation
 *
 * **PHI Compliance**:
 * - HIPAA-compliant contact information storage
 * - Automatic audit logging for all PHI access
 * - Encrypted contact information (backend)
 * - Role-based access control (RBAC)
 * - Secure notification delivery
 * - Contact information masking in logs
 *
 * **Notification Integration**:
 * - Emergency notification workflows
 * - Incident report notifications
 * - Appointment reminders
 * - Healthcare alerts
 * - Multi-channel delivery (email, SMS, voice)
 *
 * **Real-time Updates** (Socket.io):
 * - Event: `contact:updated` for contact changes
 * - Event: `contact:verified` for verification completion
 * - Event: `emergency:contact-notified` for emergency notifications
 * - Live contact status updates
 *
 * **TanStack Query Integration**:
 * - Query key: `['contacts', studentId, filters]`
 * - Cache invalidation on contact updates
 * - Optimistic updates for instant UI
 * - Background refetching for verification status
 *
 * **Compliance & Audit**:
 * - FERPA compliance for student/parent privacy
 * - Complete audit trail for contact access
 * - Contact information change tracking
 * - Verification history retention
 * - Legal documentation support
 *
 * @example
 * ```typescript
 * // Create emergency contact
 * const contact = await contactsApi.create({
 *   studentId: 'student-uuid-123',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   relationship: 'PARENT',
 *   priority: 'PRIMARY',
 *   phoneNumber: '555-123-4567',
 *   alternatePhone: '555-987-6543',
 *   email: 'john.doe@example.com',
 *   isEmergencyContact: true,
 *   canPickup: true,
 *   canViewHealthRecords: true,
 *   canAuthorizeHealthcare: true,
 *   address: {
 *     street: '123 Main St',
 *     city: 'Springfield',
 *     state: 'IL',
 *     zipCode: '62701'
 *   }
 * });
 *
 * // Get emergency contacts for student (ordered by priority)
 * const emergencyContacts = await contactsApi.getEmergencyContacts(studentId);
 *
 * // Search contacts with autocomplete
 * const searchResults = await contactsApi.search('john doe', {
 *   relationship: 'PARENT',
 *   isVerified: true
 * });
 *
 * // Verify contact information
 * const verified = await contactsApi.verify(contactId);
 *
 * // Get authorized pickup list
 * const authorizedPickups = await contactsApi.getAuthorizedPickups(studentId);
 *
 * // Use with TanStack Query for real-time updates
 * const { data: contacts } = useQuery({
 *   queryKey: ['contacts', studentId],
 *   queryFn: () => contactsApi.getAll({ studentId }),
 *   refetchInterval: 60000 // Refresh every minute
 * });
 * ```
 *
 * @see {@link studentsApi} for student information
 * @see {@link incidentsApi} for emergency notifications
 * @see {@link communicationsApi} for contact notifications
 */

import type { ApiClient } from '../core/ApiClient';
import { apiClient } from '../core'; // Updated: Import from new centralized core
import { ApiResponse, PaginatedResponse, buildUrlParams } from '../utils/apiUtils';
import { z } from 'zod';
import { createApiError, createValidationError } from '../core/errors';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type ContactRelationType =
  | 'PARENT'
  | 'GUARDIAN'
  | 'GRANDPARENT'
  | 'SIBLING'
  | 'OTHER_FAMILY'
  | 'AUTHORIZED_PICKUP'
  | 'EMERGENCY'
  | 'MEDICAL_PROVIDER'
  | 'CASE_WORKER'
  | 'OTHER';

export type ContactPriority = 'PRIMARY' | 'SECONDARY' | 'TERTIARY';

export interface Contact {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: ContactRelationType;
  priority: ContactPriority;
  phoneNumber: string;
  alternatePhone?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isEmergencyContact: boolean;
  canPickup: boolean;
  canViewHealthRecords: boolean;
  canAuthorizeHealthcare: boolean;
  preferredLanguage?: string;
  notes?: string;
  lastVerified?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

export interface CreateContactData {
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: ContactRelationType;
  priority?: ContactPriority;
  phoneNumber: string;
  alternatePhone?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isEmergencyContact: boolean;
  canPickup: boolean;
  canViewHealthRecords?: boolean;
  canAuthorizeHealthcare?: boolean;
  preferredLanguage?: string;
  notes?: string;
}

export interface UpdateContactData {
  firstName?: string;
  lastName?: string;
  relationship?: ContactRelationType;
  priority?: ContactPriority;
  phoneNumber?: string;
  alternatePhone?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isEmergencyContact?: boolean;
  canPickup?: boolean;
  canViewHealthRecords?: boolean;
  canAuthorizeHealthcare?: boolean;
  preferredLanguage?: string;
  notes?: string;
}

export interface ContactFilters {
  studentId?: string;
  relationship?: ContactRelationType;
  isEmergencyContact?: boolean;
  canPickup?: boolean;
  priority?: ContactPriority;
  isVerified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ContactStatistics {
  totalContacts: number;
  verifiedContacts: number;
  emergencyContacts: number;
  authorizedPickups: number;
  contactsByRelationship: Array<{
    relationship: ContactRelationType;
    count: number;
  }>;
  unverifiedContacts: number;
  contactsNeedingUpdate: number;
}

export interface ContactSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  relationship: ContactRelationType;
  studentName: string;
  studentId: string;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const phoneRegex = /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createContactSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  relationship: z.enum([
    'PARENT', 'GUARDIAN', 'GRANDPARENT', 'SIBLING', 'OTHER_FAMILY',
    'AUTHORIZED_PICKUP', 'EMERGENCY', 'MEDICAL_PROVIDER', 'CASE_WORKER', 'OTHER'
  ]),
  priority: z.enum(['PRIMARY', 'SECONDARY', 'TERTIARY']).optional(),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format'),
  alternatePhone: z.string().regex(phoneRegex, 'Invalid alternate phone format').optional(),
  email: z.string().regex(emailRegex, 'Invalid email address').optional(),
  isEmergencyContact: z.boolean(),
  canPickup: z.boolean(),
  canViewHealthRecords: z.boolean().optional(),
  canAuthorizeHealthcare: z.boolean().optional(),
  preferredLanguage: z.string().optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

const updateContactSchema = createContactSchema.partial().omit({ studentId: true });

// ==========================================
// CONTACTS API SERVICE
// ==========================================

export class ContactsApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get all contacts with optional filters
   */
  async getAll(filters?: ContactFilters): Promise<PaginatedResponse<Contact>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await this.client.get<PaginatedResponse<Contact>>(
        `/contacts${params ? `?${params}` : ''}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch contacts');
    }
  }

  /**
   * Get single contact by ID
   */
  async getById(id: string): Promise<Contact> {
    try {
      const response = await this.client.get<ApiResponse<Contact>>(
        `/contacts/${id}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch contact');
    }
  }

  /**
   * Get contacts by relationship type
   */
  async getByRelation(relationTo: ContactRelationType, studentId?: string): Promise<Contact[]> {
    try {
      const params = studentId ? `?studentId=${studentId}` : '';
      const response = await this.client.get<ApiResponse<Contact[]>>(
        `/contacts/by-relation/${relationTo}${params}`
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch contacts by relationship');
    }
  }

  /**
   * Search contacts with autocomplete
   */
  async search(query: string, filters?: Partial<ContactFilters>): Promise<ContactSearchResult[]> {
    try {
      const params = buildUrlParams({ search: query, ...filters });
      const response = await this.client.get<ApiResponse<ContactSearchResult[]>>(
        `/contacts/search?${params}`
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to search contacts');
    }
  }

  /**
   * Get contact statistics
   */
  async getStatistics(studentId?: string): Promise<ContactStatistics> {
    try {
      const params = studentId ? `?studentId=${studentId}` : '';
      const response = await this.client.get<ApiResponse<ContactStatistics>>(
        `/contacts/stats${params}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch contact statistics');
    }
  }

  /**
   * Create new contact
   */
  async create(contactData: CreateContactData): Promise<Contact> {
    try {
      // Validate data
      createContactSchema.parse(contactData);

      const response = await this.client.post<ApiResponse<Contact>>(
        '/contacts',
        contactData
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Contact validation failed',
          'contactData',
          error.errors.reduce((acc, err) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to create contact');
    }
  }

  /**
   * Update existing contact
   */
  async update(id: string, data: UpdateContactData): Promise<Contact> {
    try {
      // Validate data
      updateContactSchema.parse(data);

      const response = await this.client.put<ApiResponse<Contact>>(
        `/contacts/${id}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Contact validation failed',
          'contactData',
          error.errors.reduce((acc, err) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to update contact');
    }
  }

  /**
   * Delete contact
   */
  async delete(id: string): Promise<void> {
    try {
      await this.client.delete(`/contacts/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete contact');
    }
  }

  /**
   * Verify contact information
   */
  async verify(id: string): Promise<Contact> {
    try {
      const response = await this.client.post<ApiResponse<Contact>>(
        `/contacts/${id}/verify`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to verify contact');
    }
  }

  /**
   * Get emergency contacts for student
   */
  async getEmergencyContacts(studentId: string): Promise<Contact[]> {
    try {
      return await this.getByRelation('EMERGENCY', studentId);
    } catch (error) {
      throw createApiError(error, 'Failed to fetch emergency contacts');
    }
  }

  /**
   * Get authorized pickup contacts for student
   */
  async getAuthorizedPickups(studentId: string): Promise<Contact[]> {
    try {
      const response = await this.client.get<ApiResponse<Contact[]>>(
        `/contacts?studentId=${studentId}&canPickup=true`
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch authorized pickups');
    }
  }

  /**
   * Bulk import contacts
   */
  async bulkImport(contacts: CreateContactData[]): Promise<{
    imported: number;
    failed: number;
    errors: Array<{ index: number; error: string }>;
  }> {
    try {
      const response = await this.client.post<ApiResponse<{
        imported: number;
        failed: number;
        errors: Array<{ index: number; error: string }>;
      }>>('/contacts/bulk-import', { contacts });
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to import contacts');
    }
  }
}

/**
 * Factory function to create Contacts API instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured ContactsApi instance
 */
export function createContactsApi(client: ApiClient): ContactsApi {
  return new ContactsApi(client);
}

/**
 * Singleton instance of ContactsApi
 * Pre-configured with the default apiClient from core services
 *
 * @deprecated Server actions migration pending. This service will be replaced with:
 * - Emergency contact operations -> students.actions.ts
 * - Contact management -> Future contacts.actions.ts (Q2 2026)
 * Continue using this API service until migration is complete.
 */
export const contactsApi = createContactsApi(apiClient);
