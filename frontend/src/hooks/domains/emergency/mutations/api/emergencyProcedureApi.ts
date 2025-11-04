import { EmergencyProcedure } from '../../config';
import {
  CreateProcedureInput,
  UpdateProcedureInput,
} from '../types';

// Emergency Procedures API
export const emergencyProcedureApi = {
  createProcedure: async (data: CreateProcedureInput): Promise<EmergencyProcedure> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: 'new-procedure-id',
      name: data.name,
      description: data.description,
      category: data.category,
      steps: data.steps,
      estimatedDuration: data.estimatedDuration,
      requiredRoles: data.requiredRoles,
      requiredResources: [],
      triggers: [],
      dependencies: [],
      checklist: [],
      documents: [],
      lastReviewed: new Date().toISOString(),
      reviewedBy: {
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
      version: '1.0',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  updateProcedure: async (data: UpdateProcedureInput): Promise<EmergencyProcedure> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      id: data.id,
      name: data.name || 'Updated Procedure',
      description: data.description || 'Updated description',
      category: 'EVACUATION',
      steps: data.steps || [],
      estimatedDuration: data.estimatedDuration || 30,
      requiredRoles: data.requiredRoles || [],
      requiredResources: [],
      triggers: [],
      dependencies: [],
      checklist: [],
      documents: [],
      lastReviewed: new Date().toISOString(),
      reviewedBy: {
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
      version: '1.1',
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  deleteProcedure: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
  },
};
