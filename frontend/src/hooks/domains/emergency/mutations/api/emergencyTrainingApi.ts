import { EmergencyTraining } from '../../config';
import {
  CreateTrainingInput,
  UpdateTrainingInput,
} from '../types';

// Emergency Training API
export const emergencyTrainingApi = {
  createTraining: async (data: CreateTrainingInput): Promise<EmergencyTraining> => {
    await new Promise(resolve => setTimeout(resolve, 900));
    return {
      id: 'new-training-id',
      title: data.title,
      description: data.description,
      type: data.type,
      category: data.category,
      duration: data.duration,
      frequency: { type: 'ONE_TIME' as const },
      requiredFor: data.requiredFor,
      prerequisites: [],
      objectives: data.objectives,
      curriculum: [],
      materials: [],
      assessments: [],
      certificationRequired: false,
      isActive: true,
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com',
        title: 'Training Coordinator',
        role: 'TRAINER',
        isEmergencyContact: false,
        specializations: ['TRAINING'],
        certifications: [],
        availability: {
          weekdays: { start: '09:00', end: '17:00' },
          weekends: { start: '09:00', end: '17:00' },
          holidays: { available: false },
          timezone: 'America/New_York'
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  updateTraining: async (data: UpdateTrainingInput): Promise<EmergencyTraining> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      id: data.id,
      title: data.title || 'Updated Training',
      description: data.description || 'Updated description',
      type: 'DRILL' as const,
      category: 'FIRE_SAFETY',
      duration: data.duration || 120,
      frequency: { type: 'RECURRING' as const, interval: 'QUARTERLY' as const },
      requiredFor: data.requiredFor || [],
      prerequisites: [],
      objectives: data.objectives || [],
      curriculum: [],
      materials: [],
      assessments: [],
      certificationRequired: false,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdBy: {
        id: 'creator-user',
        name: 'Creator User',
        email: 'creator@example.com',
        title: 'Training Coordinator',
        role: 'TRAINER',
        isEmergencyContact: false,
        specializations: ['TRAINING'],
        certifications: [],
        availability: {
          weekdays: { start: '09:00', end: '17:00' },
          weekends: { start: '09:00', end: '17:00' },
          holidays: { available: false },
          timezone: 'America/New_York'
        }
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  deleteTraining: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
  },
};
