import { EmergencyPlan } from '../../config';
import {
  CreateEmergencyPlanInput,
  UpdateEmergencyPlanInput,
  ActivatePlanInput,
} from '../types';

// Emergency Plans API
export const emergencyPlanApi = {
  createEmergencyPlan: async (data: CreateEmergencyPlanInput): Promise<EmergencyPlan> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: 'new-plan-id',
      name: data.name,
      description: data.description,
      category: {
        id: data.categoryId,
        name: 'Emergency Category',
        description: 'Category description',
        color: '#ff6b6b',
        icon: 'alert-triangle',
        isActive: true
      },
      priority: data.priority,
      status: 'DRAFT' as const,
      version: '1.0',
      effectiveDate: new Date().toISOString(),
      reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      procedures: [],
      contacts: [],
      resources: [],
      activationCriteria: data.activationCriteria,
      escalationMatrix: [],
      communicationPlan: [],
      recoveryPlan: [],
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
      updatedAt: new Date().toISOString(),
      activationCount: 0
    };
  },

  updateEmergencyPlan: async (data: UpdateEmergencyPlanInput): Promise<EmergencyPlan> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: data.id,
      name: data.name || 'Updated Plan',
      description: data.description || 'Updated description',
      category: {
        id: 'category-id',
        name: 'Emergency Category',
        description: 'Category description',
        color: '#ff6b6b',
        icon: 'alert-triangle',
        isActive: true
      },
      priority: data.priority || 'MEDIUM' as const,
      status: data.status || 'DRAFT' as const,
      version: '1.1',
      effectiveDate: new Date().toISOString(),
      reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      procedures: [],
      contacts: [],
      resources: [],
      activationCriteria: data.activationCriteria || [],
      escalationMatrix: [],
      communicationPlan: [],
      recoveryPlan: [],
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
      updatedBy: {
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
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      activationCount: 0
    };
  },

  deleteEmergencyPlan: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  activatePlan: async (data: ActivatePlanInput): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  deactivatePlan: async (planId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
  },
};
