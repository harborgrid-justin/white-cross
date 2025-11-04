import { EmergencyResource } from '../../config';
import {
  CreateResourceInput,
  UpdateResourceInput,
} from '../types';

// Emergency Resources API
export const emergencyResourceApi = {
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
};
