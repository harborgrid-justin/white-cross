/**
 * Health Records Seed Data (Placeholder)
 * Health records seeding not yet implemented in new system
 */

export interface HealthRecordSeedData {
  id?: string;
  studentId: string;
  recordType: string;
  description?: string;
  notes?: string;
  recordDate: Date;
  providerId?: string;
  attachments?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const generateHealthRecords = async (): Promise<HealthRecordSeedData[]> => {
  console.log('generateHealthRecords: Placeholder - not implemented');
  return [];
};

export const seedHealthRecords = async (): Promise<void> => {
  console.log('seedHealthRecords: Placeholder - not implemented');
};