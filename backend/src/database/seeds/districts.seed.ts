/**
 * Districts Seed Data (Placeholder)
 * Districts seeding not yet implemented in new system
 */

export interface DistrictSeedData {
  id?: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const generateDistricts = async (): Promise<DistrictSeedData[]> => {
  console.log('generateDistricts: Placeholder - not implemented');
  return [];
};

export const seedDistricts = async (): Promise<void> => {
  console.log('seedDistricts: Placeholder - not implemented');
};