import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateEmergencyPlansQueries,
  invalidateIncidentsQueries,
  invalidateContactsQueries,
  invalidateProceduresQueries,
  invalidateResourcesQueries,
  invalidateTrainingQueries,
  invalidateAllEmergencyQueries,
  EmergencyPlan,
  EmergencyIncident,
  EmergencyContact,
  EmergencyProcedure,
  EmergencyResource,
  EmergencyTraining,
  IncidentTimelineEntry,
} from '../config';

// Input interfaces for mutations
interface CreateEmergencyPlanInput {
  name: string;
  description: string;
  categoryId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  activationCriteria: string[];
  procedures: string[];
  contacts: string[];
  resources: string[];
}

interface UpdateEmergencyPlanInput {
  id: string;
  name?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  activationCriteria?: string[];
}

interface ActivatePlanInput {
  planId: string;
  incidentId: string;
  activatedBy: string;
  reason: string;
}

interface CreateIncidentInput {
  title: string;
  description: string;
  typeId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  locationId: string;
  affectedAreas: string[];
  estimatedAffected: number;
}

interface UpdateIncidentInput {
  id: string;
  title?: string;
  description?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: 'REPORTED' | 'INVESTIGATING' | 'RESPONDING' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';
  assignedToId?: string;
  incidentCommanderId?: string;
  actualAffected?: number;
}

interface AddTimelineEntryInput {
  incidentId: string;
  event: string;
  description: string;
  status?: string;
  attachments?: File[];
}

interface CreateContactInput {
  name: string;
  title: string;
  organization?: string;
  department?: string;
  contactType: 'INTERNAL' | 'EXTERNAL' | 'VENDOR' | 'AGENCY' | 'MEDIA';
  phone: string;
  email: string;
  specializations: string[];
}

interface UpdateContactInput {
  id: string;
  name?: string;
  title?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
  specializations?: string[];
}

interface CreateProcedureInput {
  name: string;
  description: string;
  category: string;
  steps: any[];
  requiredRoles: string[];
  estimatedDuration: number;
}

interface UpdateProcedureInput {
  id: string;
  name?: string;
  description?: string;
  steps?: any[];
  requiredRoles?: string[];
  estimatedDuration?: number;
  isActive?: boolean;
}

interface CreateResourceInput {
  name: string;
  typeId: string;
  category: string;
  locationId: string;
  quantity: number;
  unit: string;
  description?: string;
}

interface UpdateResourceInput {
  id: string;
  name?: string;
  quantity?: number;
  availableQuantity?: number;
  status?: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'UNAVAILABLE';
  condition?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  locationId?: string;
}

interface CreateTrainingInput {
  title: string;
  description: string;
  type: 'ORIENTATION' | 'DRILL' | 'TABLETOP' | 'FULL_SCALE' | 'CERTIFICATION';
  category: string;
  duration: number;
  requiredFor: string[];
  objectives: string[];
}

interface UpdateTrainingInput {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  requiredFor?: string[];
  objectives?: string[];
  isActive?: boolean;
}

// Mock API functions (replace with actual API calls)
const mockEmergencyMutationAPI = {
  // Emergency Plans
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

  // Emergency Incidents
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

  // Emergency Contacts
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

  // Emergency Procedures
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

  // Emergency Resources
  createResource: async (data: CreateResourceInput): Promise<EmergencyResource> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      id: 'new-resource-id',
      name: data.name,
      type: {
        id: data.typeId,
        name: 'Resource Type',
        category: data.category,
        description: 'Type description',
        standardSpecs: {}
      },
      category: data.category,
      description: data.description || '',
      location: {
        id: data.locationId,
        name: 'Resource Location',
        address: '123 Storage St'
      },
      quantity: data.quantity,
      availableQuantity: data.quantity,
      unit: data.unit,
      status: 'AVAILABLE' as const,
      condition: 'EXCELLENT' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  updateResource: async (data: UpdateResourceInput): Promise<EmergencyResource> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: data.id,
      name: data.name || 'Updated Resource',
      type: {
        id: 'type-id',
        name: 'Resource Type',
        category: 'EQUIPMENT',
        description: 'Type description',
        standardSpecs: {}
      },
      category: 'EQUIPMENT',
      description: 'Updated description',
      location: {
        id: data.locationId || 'location-id',
        name: 'Resource Location',
        address: '123 Storage St'
      },
      quantity: data.quantity || 10,
      availableQuantity: data.availableQuantity || 10,
      unit: 'units',
      status: data.status || 'AVAILABLE' as const,
      condition: data.condition || 'GOOD' as const,
      isActive: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  deleteResource: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  // Emergency Training
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

  // Bulk Operations
  bulkUpdateIncidents: async (incidentIds: string[], updates: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
  },

  bulkActivateResources: async (resourceIds: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },
};

// Emergency Plans Mutations
export const useCreateEmergencyPlan = (
  options?: UseMutationOptions<EmergencyPlan, Error, CreateEmergencyPlanInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.createEmergencyPlan,
    onSuccess: (newPlan) => {
      invalidateEmergencyPlansQueries(queryClient);
      toast.success(`Emergency plan "${newPlan.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create emergency plan: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateEmergencyPlan = (
  options?: UseMutationOptions<EmergencyPlan, Error, UpdateEmergencyPlanInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.updateEmergencyPlan,
    onSuccess: (updatedPlan) => {
      queryClient.setQueryData(
        EMERGENCY_QUERY_KEYS.emergencyPlanDetails(updatedPlan.id),
        updatedPlan
      );
      invalidateEmergencyPlansQueries(queryClient);
      toast.success('Emergency plan updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update emergency plan: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteEmergencyPlan = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.deleteEmergencyPlan,
    onSuccess: () => {
      invalidateEmergencyPlansQueries(queryClient);
      toast.success('Emergency plan deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete emergency plan: ${error.message}`);
    },
    ...options,
  });
};

export const useActivatePlan = (
  options?: UseMutationOptions<void, Error, ActivatePlanInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.activatePlan,
    onSuccess: (_, { planId }) => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.emergencyPlanDetails(planId) });
      invalidateAllEmergencyQueries(queryClient);
      toast.success('Emergency plan activated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to activate emergency plan: ${error.message}`);
    },
    ...options,
  });
};

// Emergency Incidents Mutations
export const useCreateIncident = (
  options?: UseMutationOptions<EmergencyIncident, Error, CreateIncidentInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.createIncident,
    onSuccess: (newIncident) => {
      invalidateIncidentsQueries(queryClient);
      invalidateAllEmergencyQueries(queryClient);
      toast.success(`Incident "${newIncident.title}" reported successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create incident: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateIncident = (
  options?: UseMutationOptions<EmergencyIncident, Error, UpdateIncidentInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.updateIncident,
    onSuccess: (updatedIncident) => {
      queryClient.setQueryData(
        EMERGENCY_QUERY_KEYS.incidentDetails(updatedIncident.id),
        updatedIncident
      );
      invalidateIncidentsQueries(queryClient);
      toast.success('Incident updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update incident: ${error.message}`);
    },
    ...options,
  });
};

export const useCloseIncident = (
  options?: UseMutationOptions<void, Error, { id: string; summary: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, summary }) => mockEmergencyMutationAPI.closeIncident(id, summary),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.incidentDetails(id) });
      invalidateIncidentsQueries(queryClient);
      toast.success('Incident closed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to close incident: ${error.message}`);
    },
    ...options,
  });
};

export const useAddTimelineEntry = (
  options?: UseMutationOptions<IncidentTimelineEntry, Error, AddTimelineEntryInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.addTimelineEntry,
    onSuccess: (_, { incidentId }) => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.incidentTimeline(incidentId) });
      queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.incidentDetails(incidentId) });
      toast.success('Timeline entry added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add timeline entry: ${error.message}`);
    },
    ...options,
  });
};

// Emergency Contacts Mutations
export const useCreateContact = (
  options?: UseMutationOptions<EmergencyContact, Error, CreateContactInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.createContact,
    onSuccess: (newContact) => {
      invalidateContactsQueries(queryClient);
      toast.success(`Contact "${newContact.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create contact: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateContact = (
  options?: UseMutationOptions<EmergencyContact, Error, UpdateContactInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.updateContact,
    onSuccess: (updatedContact) => {
      queryClient.setQueryData(
        EMERGENCY_QUERY_KEYS.contactDetails(updatedContact.id),
        updatedContact
      );
      invalidateContactsQueries(queryClient);
      toast.success('Contact updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update contact: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteContact = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.deleteContact,
    onSuccess: () => {
      invalidateContactsQueries(queryClient);
      toast.success('Contact deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
    ...options,
  });
};

// Emergency Procedures Mutations
export const useCreateProcedure = (
  options?: UseMutationOptions<EmergencyProcedure, Error, CreateProcedureInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.createProcedure,
    onSuccess: (newProcedure) => {
      invalidateProceduresQueries(queryClient);
      toast.success(`Procedure "${newProcedure.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create procedure: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateProcedure = (
  options?: UseMutationOptions<EmergencyProcedure, Error, UpdateProcedureInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.updateProcedure,
    onSuccess: (updatedProcedure) => {
      queryClient.setQueryData(
        EMERGENCY_QUERY_KEYS.procedureDetails(updatedProcedure.id),
        updatedProcedure
      );
      invalidateProceduresQueries(queryClient);
      toast.success('Procedure updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update procedure: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteProcedure = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.deleteProcedure,
    onSuccess: () => {
      invalidateProceduresQueries(queryClient);
      toast.success('Procedure deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete procedure: ${error.message}`);
    },
    ...options,
  });
};

// Emergency Resources Mutations
export const useCreateResource = (
  options?: UseMutationOptions<EmergencyResource, Error, CreateResourceInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.createResource,
    onSuccess: (newResource) => {
      invalidateResourcesQueries(queryClient);
      toast.success(`Resource "${newResource.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create resource: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateResource = (
  options?: UseMutationOptions<EmergencyResource, Error, UpdateResourceInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.updateResource,
    onSuccess: (updatedResource) => {
      queryClient.setQueryData(
        EMERGENCY_QUERY_KEYS.resourceDetails(updatedResource.id),
        updatedResource
      );
      invalidateResourcesQueries(queryClient);
      toast.success('Resource updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update resource: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteResource = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.deleteResource,
    onSuccess: () => {
      invalidateResourcesQueries(queryClient);
      toast.success('Resource deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete resource: ${error.message}`);
    },
    ...options,
  });
};

// Emergency Training Mutations
export const useCreateTraining = (
  options?: UseMutationOptions<EmergencyTraining, Error, CreateTrainingInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.createTraining,
    onSuccess: (newTraining) => {
      invalidateTrainingQueries(queryClient);
      toast.success(`Training "${newTraining.title}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create training: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateTraining = (
  options?: UseMutationOptions<EmergencyTraining, Error, UpdateTrainingInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.updateTraining,
    onSuccess: (updatedTraining) => {
      queryClient.setQueryData(
        EMERGENCY_QUERY_KEYS.trainingDetails(updatedTraining.id),
        updatedTraining
      );
      invalidateTrainingQueries(queryClient);
      toast.success('Training updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update training: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteTraining = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.deleteTraining,
    onSuccess: () => {
      invalidateTrainingQueries(queryClient);
      toast.success('Training deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete training: ${error.message}`);
    },
    ...options,
  });
};

// Bulk Operations
export const useBulkUpdateIncidents = (
  options?: UseMutationOptions<void, Error, { incidentIds: string[]; updates: any }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ incidentIds, updates }) => mockEmergencyMutationAPI.bulkUpdateIncidents(incidentIds, updates),
    onSuccess: (_, { incidentIds }) => {
      invalidateIncidentsQueries(queryClient);
      toast.success(`${incidentIds.length} incidents updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update incidents: ${error.message}`);
    },
    ...options,
  });
};

export const useBulkActivateResources = (
  options?: UseMutationOptions<void, Error, string[]>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.bulkActivateResources,
    onSuccess: (_, resourceIds) => {
      invalidateResourcesQueries(queryClient);
      toast.success(`${resourceIds.length} resources activated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to activate resources: ${error.message}`);
    },
    ...options,
  });
};

// Combined mutations object for easy import
export const emergencyMutations = {
  useCreateEmergencyPlan,
  useUpdateEmergencyPlan,
  useDeleteEmergencyPlan,
  useActivatePlan,
  useCreateIncident,
  useUpdateIncident,
  useCloseIncident,
  useAddTimelineEntry,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useCreateProcedure,
  useUpdateProcedure,
  useDeleteProcedure,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
  useCreateTraining,
  useUpdateTraining,
  useDeleteTraining,
  useBulkUpdateIncidents,
  useBulkActivateResources,
};
