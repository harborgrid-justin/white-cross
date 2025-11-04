import { EmergencyIncident, IncidentTimelineEntry } from '../../config';
import {
  CreateIncidentInput,
  UpdateIncidentInput,
  AddTimelineEntryInput,
} from '../types';

// Emergency Incidents API
export const emergencyIncidentApi = {
  createIncident: async (data: CreateIncidentInput): Promise<EmergencyIncident> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      id: 'new-incident-id',
      title: data.title,
      description: data.description,
      type: {
        id: data.typeId,
        name: 'Emergency Type',
        description: 'Type description',
        category: 'MEDICAL',
        severity: 'HIGH',
        responseTime: 15,
        escalationRules: []
      },
      severity: data.severity,
      status: 'REPORTED' as const,
      location: {
        id: data.locationId,
        name: 'Emergency Location',
        address: '123 Main St',
        coordinates: { latitude: 40.7128, longitude: -74.0060 }
      },
      reportedBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com',
        title: 'Reporter',
        role: 'STAFF',
        isEmergencyContact: false,
        specializations: [],
        certifications: [],
        availability: {
          weekdays: { start: '09:00', end: '17:00' },
          weekends: { start: '09:00', end: '17:00' },
          holidays: { available: false },
          timezone: 'America/New_York'
        }
      },
      affectedAreas: data.affectedAreas,
      estimatedAffected: data.estimatedAffected,
      responseTeam: [],
      relatedPlans: [],
      timeline: [],
      resources: [],
      communications: [],
      lessons: [],
      reportedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  updateIncident: async (data: UpdateIncidentInput): Promise<EmergencyIncident> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      id: data.id,
      title: data.title || 'Updated Incident',
      description: data.description || 'Updated description',
      type: {
        id: 'type-id',
        name: 'Emergency Type',
        description: 'Type description',
        category: 'MEDICAL',
        severity: 'HIGH',
        responseTime: 15,
        escalationRules: []
      },
      severity: data.severity || 'MEDIUM' as const,
      status: data.status || 'INVESTIGATING' as const,
      location: {
        id: 'location-id',
        name: 'Emergency Location',
        address: '123 Main St'
      },
      reportedBy: {
        id: 'reporter-id',
        name: 'Reporter',
        email: 'reporter@example.com',
        title: 'Reporter',
        role: 'STAFF',
        isEmergencyContact: false,
        specializations: [],
        certifications: [],
        availability: {
          weekdays: { start: '09:00', end: '17:00' },
          weekends: { start: '09:00', end: '17:00' },
          holidays: { available: false },
          timezone: 'America/New_York'
        }
      },
      affectedAreas: [],
      estimatedAffected: 0,
      actualAffected: data.actualAffected,
      responseTeam: [],
      relatedPlans: [],
      timeline: [],
      resources: [],
      communications: [],
      lessons: [],
      reportedAt: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  closeIncident: async (id: string, summary: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
  },

  addTimelineEntry: async (data: AddTimelineEntryInput): Promise<IncidentTimelineEntry> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: 'new-timeline-entry',
      timestamp: new Date().toISOString(),
      event: data.event,
      description: data.description,
      user: {
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
      status: data.status,
      attachments: data.attachments?.map(f => f.name) || []
    };
  },
};
