/**
 * Incidents Seed Data (Placeholder)
 * Incidents seeding not yet implemented in new system
 */

export interface IncidentSeedData {
  id?: string;
  studentId: string;
  incidentType: string;
  description: string;
  severity: string;
  location?: string;
  incidentDate: Date;
  reporterId: string;
  status: string;
  followUpActions?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const generateIncidents = async (): Promise<IncidentSeedData[]> => {
  console.log('generateIncidents: Placeholder - not implemented');
  return [];
};

export const seedIncidents = async (): Promise<void> => {
  console.log('seedIncidents: Placeholder - not implemented');
};