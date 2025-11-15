/**
 * Emergency Contacts Server Actions
 * Server-side actions for emergency contact management
 */

'use server';

import { revalidatePath } from 'next/cache';
import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api/server';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface EmergencyContact {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  priority: 'PRIMARY' | 'SECONDARY';
  canPickup: boolean;
  verificationStatus?: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmergencyNotificationData {
  subject: string;
  message: string;
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  channels?: Array<'SMS' | 'EMAIL' | 'VOICE'>;
}

export interface EmergencyNotificationResult {
  contactId: string;
  contactName: string;
  channel: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  timestamp: string;
  error?: string;
}

export interface ContactVerificationResponse {
  verified: boolean;
  method: 'sms' | 'email' | 'voice';
  timestamp: string;
  message?: string;
}

export interface EmergencyContactStatistics {
  totalContacts: number;
  verifiedContacts: number;
  primaryContacts: number;
  secondaryContacts: number;
  recentNotifications: number;
}

export interface CreateEmergencyContactData {
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  priority: 'PRIMARY' | 'SECONDARY';
  canPickup: boolean;
  notes?: string;
}

export interface UpdateEmergencyContactData {
  firstName?: string;
  lastName?: string;
  relationship?: string;
  phoneNumber?: string;
  email?: string;
  priority?: 'PRIMARY' | 'SECONDARY';
  canPickup?: boolean;
  notes?: string;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ==========================================
// EMERGENCY CONTACTS CRUD
// ==========================================

/**
 * Get emergency contacts for a student
 */
export async function getContactsByStudent(
  studentId: string
): Promise<ActionResult<{ contacts: EmergencyContact[] }>> {
  try {
    const contacts = await serverGet<EmergencyContact[]>(
      `/api/students/${studentId}/emergency-contacts`,
      undefined,
      { cache: 'no-store' }
    );

    return {
      success: true,
      data: { contacts: Array.isArray(contacts) ? contacts : [] }
    };
  } catch (error) {
    const err = error as Error;
    console.error(`Error fetching contacts for student ${studentId}:`, err);
    return {
      success: false,
      error: err.message || 'Failed to fetch emergency contacts',
      data: { contacts: [] }
    };
  }
}

/**
 * Create emergency contact
 */
export async function createEmergencyContact(
  data: CreateEmergencyContactData
): Promise<ActionResult<{ contact: EmergencyContact }>> {
  try {
    const contact = await serverPost<EmergencyContact>(
      '/api/emergency-contacts',
      data,
      { cache: 'no-store' }
    );

    revalidatePath(`/students/${data.studentId}`);
    revalidatePath('/students');

    return {
      success: true,
      data: { contact }
    };
  } catch (error) {
    const err = error as Error;
    console.error('Error creating emergency contact:', err);
    return {
      success: false,
      error: err.message || 'Failed to create emergency contact'
    };
  }
}

/**
 * Update emergency contact
 */
export async function updateEmergencyContact(
  id: string,
  data: UpdateEmergencyContactData
): Promise<ActionResult<{ contact: EmergencyContact }>> {
  try {
    const contact = await serverPut<EmergencyContact>(
      `/api/emergency-contacts/${id}`,
      data,
      { cache: 'no-store' }
    );

    revalidatePath('/students');
    if (contact.studentId) {
      revalidatePath(`/students/${contact.studentId}`);
    }

    return {
      success: true,
      data: { contact }
    };
  } catch (error) {
    const err = error as Error;
    console.error(`Error updating emergency contact ${id}:`, err);
    return {
      success: false,
      error: err.message || 'Failed to update emergency contact'
    };
  }
}

/**
 * Delete emergency contact
 */
export async function deleteEmergencyContact(
  id: string
): Promise<ActionResult<void>> {
  try {
    await serverDelete(
      `/api/emergency-contacts/${id}`,
      { cache: 'no-store' }
    );

    revalidatePath('/students');

    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error(`Error deleting emergency contact ${id}:`, err);
    return {
      success: false,
      error: err.message || 'Failed to delete emergency contact'
    };
  }
}

// ==========================================
// NOTIFICATIONS
// ==========================================

/**
 * Notify all emergency contacts for a student
 */
export async function notifyStudent(
  studentId: string,
  notification: EmergencyNotificationData
): Promise<ActionResult<{ results: EmergencyNotificationResult[] }>> {
  try {
    const results = await serverPost<EmergencyNotificationResult[]>(
      `/api/students/${studentId}/emergency-contacts/notify`,
      notification,
      { cache: 'no-store' }
    );

    return {
      success: true,
      data: { results: Array.isArray(results) ? results : [] }
    };
  } catch (error) {
    const err = error as Error;
    console.error(`Error notifying student ${studentId} contacts:`, err);
    return {
      success: false,
      error: err.message || 'Failed to send notifications',
      data: { results: [] }
    };
  }
}

/**
 * Notify specific emergency contact
 */
export async function notifyContact(
  contactId: string,
  notification: EmergencyNotificationData
): Promise<ActionResult<{ result: EmergencyNotificationResult }>> {
  try {
    const result = await serverPost<EmergencyNotificationResult>(
      `/api/emergency-contacts/${contactId}/notify`,
      notification,
      { cache: 'no-store' }
    );

    return {
      success: true,
      data: { result }
    };
  } catch (error) {
    const err = error as Error;
    console.error(`Error notifying contact ${contactId}:`, err);
    return {
      success: false,
      error: err.message || 'Failed to send notification'
    };
  }
}

// ==========================================
// VERIFICATION
// ==========================================

/**
 * Verify emergency contact
 */
export async function verifyContact(
  contactId: string,
  method: 'sms' | 'email' | 'voice'
): Promise<ActionResult<ContactVerificationResponse>> {
  try {
    const response = await serverPost<ContactVerificationResponse>(
      `/api/emergency-contacts/${contactId}/verify`,
      { method },
      { cache: 'no-store' }
    );

    revalidatePath('/students');

    return {
      success: true,
      data: response
    };
  } catch (error) {
    const err = error as Error;
    console.error(`Error verifying contact ${contactId}:`, err);
    return {
      success: false,
      error: err.message || 'Failed to verify contact'
    };
  }
}

// ==========================================
// STATISTICS
// ==========================================

/**
 * Get emergency contact statistics
 */
export async function getStatistics(): Promise<ActionResult<EmergencyContactStatistics>> {
  try {
    const statistics = await serverGet<EmergencyContactStatistics>(
      '/api/emergency-contacts/statistics',
      undefined,
      { cache: 'no-store' }
    );

    return {
      success: true,
      data: statistics
    };
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching emergency contact statistics:', err);
    return {
      success: false,
      error: err.message || 'Failed to fetch statistics',
      data: {
        totalContacts: 0,
        verifiedContacts: 0,
        primaryContacts: 0,
        secondaryContacts: 0,
        recentNotifications: 0
      }
    };
  }
}
