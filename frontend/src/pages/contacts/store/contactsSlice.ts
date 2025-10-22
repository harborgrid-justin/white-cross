/**
 * WF-COMP-280 | contactsSlice.ts - Contacts Redux slice
 * Purpose: Contacts page Redux slice with emergency contacts API integration
 * Related: emergencyContactsApi.ts
 * Last Updated: 2025-10-21 | File Type: .ts
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { emergencyContactsApi, CreateEmergencyContactData, UpdateEmergencyContactData } from '../../../services/modules/emergencyContactsApi';
import {
  EmergencyContact,
  EmergencyNotificationData,
  EmergencyNotificationResult,
  ContactVerificationResponse,
  EmergencyContactStatistics,
} from '../../../types/student.types';

// Contacts API Service Adapter
export class ContactsApiService {
  // Emergency contacts
  async getContactsByStudent(studentId: string) {
    return emergencyContactsApi.getByStudent(studentId);
  }

  async createEmergencyContact(data: CreateEmergencyContactData) {
    return emergencyContactsApi.create(data);
  }

  async updateEmergencyContact(id: string, data: UpdateEmergencyContactData) {
    return emergencyContactsApi.update(id, data);
  }

  async deleteEmergencyContact(id: string) {
    return emergencyContactsApi.delete(id);
  }

  // Notifications
  async notifyStudent(studentId: string, notification: Omit<EmergencyNotificationData, 'studentId'>) {
    return emergencyContactsApi.notifyStudent(studentId, notification);
  }

  async notifyContact(contactId: string, notification: Omit<EmergencyNotificationData, 'studentId'>) {
    return emergencyContactsApi.notifyContact(contactId, notification);
  }

  // Verification
  async verifyContact(contactId: string, method: 'sms' | 'email' | 'voice') {
    return emergencyContactsApi.verify(contactId, method);
  }

  // Statistics
  async getStatistics() {
    return emergencyContactsApi.getStatistics();
  }
}

// Create contacts API service instance
export const contactsApiService = new ContactsApiService();

// State interface
export interface ContactsState {
  // Contacts
  contacts: EmergencyContact[];
  contactsLoading: boolean;
  contactsError: string | null;
  
  // Selected student contacts
  selectedStudentId: string | null;
  selectedStudentContacts: EmergencyContact[];
  
  // Notifications
  notificationResults: EmergencyNotificationResult[];
  notificationsLoading: boolean;
  notificationsError: string | null;
  
  // Verification
  verificationResponse: ContactVerificationResponse | null;
  verificationLoading: boolean;
  verificationError: string | null;
  
  // Statistics
  statistics: EmergencyContactStatistics | null;
  statisticsLoading: boolean;
  statisticsError: string | null;
}

// Initial state
const initialState: ContactsState = {
  contacts: [],
  contactsLoading: false,
  contactsError: null,
  
  selectedStudentId: null,
  selectedStudentContacts: [],
  
  notificationResults: [],
  notificationsLoading: false,
  notificationsError: null,
  
  verificationResponse: null,
  verificationLoading: false,
  verificationError: null,
  
  statistics: null,
  statisticsLoading: false,
  statisticsError: null,
};

// Async thunks
export const fetchContactsByStudent = createAsyncThunk(
  'contacts/fetchByStudent',
  async (studentId: string) => {
    const response = await contactsApiService.getContactsByStudent(studentId);
    return { studentId, contacts: response.contacts };
  }
);

export const createEmergencyContact = createAsyncThunk(
  'contacts/create',
  async (data: CreateEmergencyContactData) => {
    const response = await contactsApiService.createEmergencyContact(data);
    return response.contact;
  }
);

export const updateEmergencyContact = createAsyncThunk(
  'contacts/update',
  async ({ id, data }: { id: string; data: UpdateEmergencyContactData }) => {
    const response = await contactsApiService.updateEmergencyContact(id, data);
    return response.contact;
  }
);

export const deleteEmergencyContact = createAsyncThunk(
  'contacts/delete',
  async (id: string) => {
    await contactsApiService.deleteEmergencyContact(id);
    return id;
  }
);

export const notifyStudent = createAsyncThunk(
  'contacts/notifyStudent',
  async ({ studentId, notification }: { studentId: string; notification: Omit<EmergencyNotificationData, 'studentId'> }) => {
    const response = await contactsApiService.notifyStudent(studentId, notification);
    return response.results;
  }
);

export const notifyContact = createAsyncThunk(
  'contacts/notifyContact',
  async ({ contactId, notification }: { contactId: string; notification: Omit<EmergencyNotificationData, 'studentId'> }) => {
    const response = await contactsApiService.notifyContact(contactId, notification);
    return response.result;
  }
);

export const verifyContact = createAsyncThunk(
  'contacts/verify',
  async ({ contactId, method }: { contactId: string; method: 'sms' | 'email' | 'voice' }) => {
    const response = await contactsApiService.verifyContact(contactId, method);
    return response;
  }
);

export const fetchContactStatistics = createAsyncThunk(
  'contacts/fetchStatistics',
  async () => {
    const statistics = await contactsApiService.getStatistics();
    return statistics;
  }
);

// Slice
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    // Clear errors
    clearContactsError: (state) => {
      state.contactsError = null;
    },
    clearNotificationsError: (state) => {
      state.notificationsError = null;
    },
    clearVerificationError: (state) => {
      state.verificationError = null;
    },
    clearStatisticsError: (state) => {
      state.statisticsError = null;
    },
    
    // Set selected student
    setSelectedStudent: (state, action) => {
      state.selectedStudentId = action.payload;
    },
    
    // Clear verification response
    clearVerificationResponse: (state) => {
      state.verificationResponse = null;
    },
    
    // Clear notification results
    clearNotificationResults: (state) => {
      state.notificationResults = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch contacts by student
    builder
      .addCase(fetchContactsByStudent.pending, (state) => {
        state.contactsLoading = true;
        state.contactsError = null;
      })
      .addCase(fetchContactsByStudent.fulfilled, (state, action) => {
        state.contactsLoading = false;
        state.selectedStudentId = action.payload.studentId;
        state.selectedStudentContacts = action.payload.contacts;
        // Also update the main contacts array
        state.contacts = action.payload.contacts;
      })
      .addCase(fetchContactsByStudent.rejected, (state, action) => {
        state.contactsLoading = false;
        state.contactsError = action.error.message || 'Failed to fetch contacts';
      })

    // Create emergency contact
      .addCase(createEmergencyContact.pending, (state) => {
        state.contactsLoading = true;
        state.contactsError = null;
      })
      .addCase(createEmergencyContact.fulfilled, (state, action) => {
        state.contactsLoading = false;
        state.contacts.push(action.payload);
        if (state.selectedStudentId === action.payload.studentId) {
          state.selectedStudentContacts.push(action.payload);
        }
      })
      .addCase(createEmergencyContact.rejected, (state, action) => {
        state.contactsLoading = false;
        state.contactsError = action.error.message || 'Failed to create contact';
      })

    // Update emergency contact
      .addCase(updateEmergencyContact.pending, (state) => {
        state.contactsLoading = true;
        state.contactsError = null;
      })
      .addCase(updateEmergencyContact.fulfilled, (state, action) => {
        state.contactsLoading = false;
        const updatedContact = action.payload;
        
        // Update in main contacts array
        const contactIndex = state.contacts.findIndex(c => c.id === updatedContact.id);
        if (contactIndex !== -1) {
          state.contacts[contactIndex] = updatedContact;
        }
        
        // Update in selected student contacts
        const studentContactIndex = state.selectedStudentContacts.findIndex(c => c.id === updatedContact.id);
        if (studentContactIndex !== -1) {
          state.selectedStudentContacts[studentContactIndex] = updatedContact;
        }
      })
      .addCase(updateEmergencyContact.rejected, (state, action) => {
        state.contactsLoading = false;
        state.contactsError = action.error.message || 'Failed to update contact';
      })

    // Delete emergency contact
      .addCase(deleteEmergencyContact.pending, (state) => {
        state.contactsLoading = true;
        state.contactsError = null;
      })
      .addCase(deleteEmergencyContact.fulfilled, (state, action) => {
        state.contactsLoading = false;
        const deletedId = action.payload;
        
        // Remove from main contacts array
        state.contacts = state.contacts.filter(c => c.id !== deletedId);
        
        // Remove from selected student contacts
        state.selectedStudentContacts = state.selectedStudentContacts.filter(c => c.id !== deletedId);
      })
      .addCase(deleteEmergencyContact.rejected, (state, action) => {
        state.contactsLoading = false;
        state.contactsError = action.error.message || 'Failed to delete contact';
      })

    // Notify student
      .addCase(notifyStudent.pending, (state) => {
        state.notificationsLoading = true;
        state.notificationsError = null;
      })
      .addCase(notifyStudent.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        state.notificationResults = action.payload;
      })
      .addCase(notifyStudent.rejected, (state, action) => {
        state.notificationsLoading = false;
        state.notificationsError = action.error.message || 'Failed to send notifications';
      })

    // Notify contact
      .addCase(notifyContact.pending, (state) => {
        state.notificationsLoading = true;
        state.notificationsError = null;
      })
      .addCase(notifyContact.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        state.notificationResults = [action.payload];
      })
      .addCase(notifyContact.rejected, (state, action) => {
        state.notificationsLoading = false;
        state.notificationsError = action.error.message || 'Failed to send notification';
      })

    // Verify contact
      .addCase(verifyContact.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = null;
      })
      .addCase(verifyContact.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.verificationResponse = action.payload;
      })
      .addCase(verifyContact.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.error.message || 'Failed to verify contact';
      })

    // Fetch statistics
      .addCase(fetchContactStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.statisticsError = null;
      })
      .addCase(fetchContactStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchContactStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.statisticsError = action.error.message || 'Failed to fetch statistics';
      });
  },
});

// Selectors
export const selectContacts = (state: { contacts: ContactsState }) => state.contacts.contacts;
export const selectContactsLoading = (state: { contacts: ContactsState }) => state.contacts.contactsLoading;
export const selectContactsError = (state: { contacts: ContactsState }) => state.contacts.contactsError;

export const selectSelectedStudentId = (state: { contacts: ContactsState }) => state.contacts.selectedStudentId;
export const selectSelectedStudentContacts = (state: { contacts: ContactsState }) => state.contacts.selectedStudentContacts;

export const selectNotificationResults = (state: { contacts: ContactsState }) => state.contacts.notificationResults;
export const selectNotificationsLoading = (state: { contacts: ContactsState }) => state.contacts.notificationsLoading;
export const selectNotificationsError = (state: { contacts: ContactsState }) => state.contacts.notificationsError;

export const selectVerificationResponse = (state: { contacts: ContactsState }) => state.contacts.verificationResponse;
export const selectVerificationLoading = (state: { contacts: ContactsState }) => state.contacts.verificationLoading;
export const selectVerificationError = (state: { contacts: ContactsState }) => state.contacts.verificationError;

export const selectContactStatistics = (state: { contacts: ContactsState }) => state.contacts.statistics;
export const selectStatisticsLoading = (state: { contacts: ContactsState }) => state.contacts.statisticsLoading;
export const selectStatisticsError = (state: { contacts: ContactsState }) => state.contacts.statisticsError;

// Derived selectors
export const selectPrimaryContacts = (state: { contacts: ContactsState }) => {
  return state.contacts.selectedStudentContacts.filter(contact => contact.priority === 'PRIMARY');
};

export const selectSecondaryContacts = (state: { contacts: ContactsState }) => {
  return state.contacts.selectedStudentContacts.filter(contact => contact.priority === 'SECONDARY');
};

export const selectVerifiedContacts = (state: { contacts: ContactsState }) => {
  return state.contacts.selectedStudentContacts.filter(contact => contact.verificationStatus === 'VERIFIED');
};

export const selectUnverifiedContacts = (state: { contacts: ContactsState }) => {
  return state.contacts.selectedStudentContacts.filter(contact => contact.verificationStatus !== 'VERIFIED');
};

// Export actions and reducer
export const {
  clearContactsError,
  clearNotificationsError,
  clearVerificationError,
  clearStatisticsError,
  setSelectedStudent,
  clearVerificationResponse,
  clearNotificationResults,
} = contactsSlice.actions;

export default contactsSlice.reducer;
