import { EmergencyContact } from '../../config';
import {
  CreateContactInput,
  UpdateContactInput,
} from '../types';

// Emergency Contacts API
export const emergencyContactApi = {
  createContact: async (data: CreateContactInput): Promise<EmergencyContact> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      id: 'new-contact-id',
      name: data.name,
      title: data.title,
      organization: data.organization,
      department: data.department,
      contactType: data.contactType,
      priority: 1,
      isOn24x7: false,
      isPrimary: false,
      phone: data.phone,
      email: data.email,
      specializations: data.specializations,
      availability: {
        weekdays: { start: '09:00', end: '17:00' },
        weekends: { start: '09:00', end: '17:00' },
        holidays: { available: false },
        timezone: 'America/New_York'
      },
      isActive: true,
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com',
        title: 'Emergency Coordinator',
        role: 'COORDINATOR',
        isEmergencyContact: true,
        specializations: [],
        certifications: [],
        availability: {
          weekdays: { start: '09:00', end: '17:00' },
          weekends: { start: '09:00', end: '17:00' },
          holidays: { available: true },
          timezone: 'America/New_York'
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  updateContact: async (data: UpdateContactInput): Promise<EmergencyContact> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: data.id,
      name: data.name || 'Updated Contact',
      title: data.title || 'Updated Title',
      contactType: 'INTERNAL' as const,
      priority: 1,
      isOn24x7: false,
      isPrimary: false,
      phone: data.phone || '555-0123',
      email: data.email || 'contact@example.com',
      specializations: data.specializations || [],
      availability: {
        weekdays: { start: '09:00', end: '17:00' },
        weekends: { start: '09:00', end: '17:00' },
        holidays: { available: false },
        timezone: 'America/New_York'
      },
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdBy: {
        id: 'creator-user',
        name: 'Creator User',
        email: 'creator@example.com',
        title: 'Emergency Coordinator',
        role: 'COORDINATOR',
        isEmergencyContact: true,
        specializations: [],
        certifications: [],
        availability: {
          weekdays: { start: '09:00', end: '17:00' },
          weekends: { start: '09:00', end: '17:00' },
          holidays: { available: true },
          timezone: 'America/New_York'
        }
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  deleteContact: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },
};
