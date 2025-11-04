/**
 * WF-COMP-129 | useEmergencyContacts.types.ts - Type definitions
 * Purpose: Type definitions for emergency contacts
 * Upstream: None | Dependencies: None
 * Downstream: useEmergencyContacts hooks | Called by: React component tree
 * Related: useEmergencyContacts, emergencyContactsApi
 * Exports: interfaces, types | Key Features: Type safety
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Type definitions extracted from useEmergencyContacts
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface EmergencyContact {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  priority: 'PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY';
  isActive: boolean;
  verified?: boolean;
  verifiedAt?: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

export interface CreateEmergencyContactRequest {
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  priority: string;
}

export interface UpdateEmergencyContactRequest {
  firstName?: string;
  lastName?: string;
  relationship?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  priority?: string;
  isActive?: boolean;
}

export interface NotificationRequest {
  message: string;
  type: 'emergency' | 'health' | 'medication' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
}

export interface EmergencyContactStatistics {
  totalContacts: number;
  studentsWithoutContacts: number;
  byPriority: Record<string, number>;
}

export interface VerificationMethod {
  method: 'sms' | 'email' | 'voice';
}
