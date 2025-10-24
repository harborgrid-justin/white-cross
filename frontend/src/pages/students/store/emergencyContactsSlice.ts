/**
 * Emergency Contacts Slice
 * 
 * Redux slice for managing emergency contacts using the slice factory.
 * Handles CRUD operations for student emergency contact management.
 */

import { createEntitySlice, EntityApiService } from '../../../stores/sliceFactory';
import { EmergencyContact, CreateEmergencyContactData, UpdateEmergencyContactData } from '../../../types/student.types';
import { emergencyContactsApi } from '../../../services/api';

// Emergency contact filters
interface EmergencyContactFilters {
  studentId?: string;
  priority?: string;
  isActive?: boolean;
  verificationStatus?: string;
  page?: number;
  limit?: number;
}

// Create API service adapter for emergency contacts
const emergencyContactsApiService: EntityApiService<EmergencyContact, CreateEmergencyContactData, UpdateEmergencyContactData> = {
  async getAll(params?: EmergencyContactFilters) {
    const response = await emergencyContactsApi.getAll(params);
    return {
      data: response.data?.contacts || [],
      total: response.data?.pagination?.total,
      pagination: response.data?.pagination,
    };
  },

  async getById(id: string) {
    const response = await emergencyContactsApi.getById(id);
    return { data: response.data };
  },

  async create(data: CreateEmergencyContactData) {
    const response = await emergencyContactsApi.create(data);
    return { data: response.data };
  },

  async update(id: string, data: UpdateEmergencyContactData) {
    const response = await emergencyContactsApi.update(id, data);
    return { data: response.data };
  },

  async delete(id: string) {
    await emergencyContactsApi.delete(id);
    return { success: true };
  },
};

// Create the emergency contacts slice using the entity factory
const emergencyContactsSliceFactory = createEntitySlice<EmergencyContact, CreateEmergencyContactData, UpdateEmergencyContactData>(
  'emergencyContacts',
  emergencyContactsApiService,
  {
    enableBulkOperations: false,
  }
);

// Export the slice and its components
export const emergencyContactsSlice = emergencyContactsSliceFactory.slice;
export const emergencyContactsReducer = emergencyContactsSlice.reducer;
export const emergencyContactsActions = emergencyContactsSliceFactory.actions;
export const emergencyContactsSelectors = emergencyContactsSliceFactory.adapter.getSelectors((state: any) => state.emergencyContacts);
export const emergencyContactsThunks = emergencyContactsSliceFactory.thunks;

// Export custom selectors
export const selectContactsByStudent = (state: any, studentId: string): EmergencyContact[] => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.filter(contact => contact.studentId === studentId);
};

export const selectActiveContacts = (state: any): EmergencyContact[] => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.filter(contact => contact.isActive);
};

export const selectActiveContactsByStudent = (state: any, studentId: string): EmergencyContact[] => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.filter(contact => 
    contact.studentId === studentId && contact.isActive
  );
};

export const selectPrimaryContacts = (state: any): EmergencyContact[] => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.filter(contact => 
    contact.priority === 'PRIMARY' && contact.isActive
  );
};

export const selectPrimaryContactByStudent = (state: any, studentId: string): EmergencyContact | undefined => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.find(contact => 
    contact.studentId === studentId && 
    contact.priority === 'PRIMARY' && 
    contact.isActive
  );
};

export const selectUnverifiedContacts = (state: any): EmergencyContact[] => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.filter(contact => 
    contact.verificationStatus === 'UNVERIFIED' || 
    contact.verificationStatus === 'FAILED'
  );
};

export const selectContactsByRelationship = (state: any, relationship: string): EmergencyContact[] => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.filter(contact => contact.relationship === relationship);
};
