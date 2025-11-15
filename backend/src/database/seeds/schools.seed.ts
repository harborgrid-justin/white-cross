/**
 * Schools Seed Data (Placeholder) 
 * Schools seeding not yet implemented in new system
 */

export interface SchoolSeedData {
  id?: string;
  name: string;
  code?: string;
  districtId: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  principalName?: string;
  principalEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const generateSchools = async (): Promise<SchoolSeedData[]> => {
  console.log('generateSchools: Placeholder - not implemented');
  return [];
};

export const seedSchools = async (): Promise<void> => {
  console.log('seedSchools: Placeholder - not implemented');
};