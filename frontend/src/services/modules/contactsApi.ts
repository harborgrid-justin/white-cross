/**
 * Contacts API Service
 *
 * Provides comprehensive contact management for students including guardians,
 * emergency contacts, authorized pickups, and other relationships.
 *
 * Features:
 * - Contact CRUD operations
 * - Relationship-based filtering
 * - Contact search with autocomplete
 * - Contact statistics and analytics
 * - Verification and validation
 * - PHI-compliant contact management
 *
 * Security:
 * - Automatic audit logging for PHI access
 * - Role-based access control
 * - Contact information encryption (backend)
 * - Secure notification delivery
 *
 * @module services/modules/contactsApi
 */

import type { ApiClient } from '../core/ApiClient';
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
        `/api/v1/contacts${params ? `?${params}` : ''}`
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
        `/api/v1/contacts/${id}`
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
        `/api/v1/contacts/by-relation/${relationTo}${params}`
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
        `/api/v1/contacts/search?${params}`
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
        `/api/v1/contacts/stats${params}`
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
        '/api/v1/contacts',
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
        `/api/v1/contacts/${id}`,
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
      await this.client.delete(`/api/v1/contacts/${id}`);
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
        `/api/v1/contacts/${id}/verify`
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
        `/api/v1/contacts?studentId=${studentId}&canPickup=true`
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
      }>>('/api/v1/contacts/bulk-import', { contacts });
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
