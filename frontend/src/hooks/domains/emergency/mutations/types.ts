// Input interfaces for emergency mutations

export interface CreateEmergencyPlanInput {
  name: string;
  description: string;
  categoryId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  activationCriteria: string[];
  procedures: string[];
  contacts: string[];
  resources: string[];
}

export interface UpdateEmergencyPlanInput {
  id: string;
  name?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  activationCriteria?: string[];
}

export interface ActivatePlanInput {
  planId: string;
  incidentId: string;
  activatedBy: string;
  reason: string;
}

export interface CreateIncidentInput {
  title: string;
  description: string;
  typeId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  locationId: string;
  affectedAreas: string[];
  estimatedAffected: number;
}

export interface UpdateIncidentInput {
  id: string;
  title?: string;
  description?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: 'REPORTED' | 'INVESTIGATING' | 'RESPONDING' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';
  assignedToId?: string;
  incidentCommanderId?: string;
  actualAffected?: number;
}

export interface AddTimelineEntryInput {
  incidentId: string;
  event: string;
  description: string;
  status?: string;
  attachments?: File[];
}

export interface CreateContactInput {
  name: string;
  title: string;
  organization?: string;
  department?: string;
  contactType: 'INTERNAL' | 'EXTERNAL' | 'VENDOR' | 'AGENCY' | 'MEDIA';
  phone: string;
  email: string;
  specializations: string[];
}

export interface UpdateContactInput {
  id: string;
  name?: string;
  title?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
  specializations?: string[];
}

export interface CreateProcedureInput {
  name: string;
  description: string;
  category: string;
  steps: any[];
  requiredRoles: string[];
  estimatedDuration: number;
}

export interface UpdateProcedureInput {
  id: string;
  name?: string;
  description?: string;
  steps?: any[];
  requiredRoles?: string[];
  estimatedDuration?: number;
  isActive?: boolean;
}

export interface CreateResourceInput {
  name: string;
  typeId: string;
  category: string;
  locationId: string;
  quantity: number;
  unit: string;
  description?: string;
}

export interface UpdateResourceInput {
  id: string;
  name?: string;
  quantity?: number;
  availableQuantity?: number;
  status?: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'UNAVAILABLE';
  condition?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  locationId?: string;
}

export interface CreateTrainingInput {
  title: string;
  description: string;
  type: 'ORIENTATION' | 'DRILL' | 'TABLETOP' | 'FULL_SCALE' | 'CERTIFICATION';
  category: string;
  duration: number;
  requiredFor: string[];
  objectives: string[];
}

export interface UpdateTrainingInput {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  requiredFor?: string[];
  objectives?: string[];
  isActive?: boolean;
}
