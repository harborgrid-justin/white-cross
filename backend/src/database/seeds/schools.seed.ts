/**
 * School Seed Data Generator
 * Generates realistic school data for seeding
 */

export interface SchoolSeedData {
  name: string;
  code: string;
  districtId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  principal: string;
  totalEnrollment: number;
  isActive: boolean;
}

const SCHOOL_TYPES = ['Elementary', 'Middle', 'High', 'Charter', 'Magnet', 'Alternative'];
const FIRST_NAMES = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

/**
 * Generate realistic school data for a given district
 */
export function generateSchools(districtIds: string[], schoolsPerDistrict: number): SchoolSeedData[] {
  const schools: SchoolSeedData[] = [];
  let schoolCounter = 0;

  for (const districtId of districtIds) {
    for (let i = 0; i < schoolsPerDistrict; i++) {
      const schoolType = SCHOOL_TYPES[schoolCounter % SCHOOL_TYPES.length];
      const schoolNumber = (schoolCounter + 1).toString().padStart(4, '0');
      
      const cityNames = ['Springfield', 'Madison', 'Franklin', 'Lincoln', 'Washington', 'Jefferson'];
      const city = cityNames[schoolCounter % cityNames.length];
      
      const firstName = FIRST_NAMES[schoolCounter % FIRST_NAMES.length];
      const lastName = LAST_NAMES[schoolCounter % LAST_NAMES.length];
      
      const enrollmentBase = schoolType === 'Elementary' ? 400 : schoolType === 'Middle' ? 600 : 1200;
      
      schools.push({
        name: `${city} ${schoolType} School`,
        code: `SCH-${schoolNumber}`,
        districtId: districtId,
        address: `${200 + schoolCounter * 5} School Street`,
        city: city,
        state: 'NY', // Will vary based on district
        zipCode: `${10000 + schoolCounter * 50}`.substring(0, 5),
        phone: `555-${(200 + schoolCounter).toString().padStart(3, '0')}-2000`,
        email: `admin@${city.toLowerCase()}${schoolType.toLowerCase()}.edu`,
        principal: `${firstName} ${lastName}`,
        totalEnrollment: enrollmentBase + (schoolCounter * 50),
        isActive: true,
      });
      
      schoolCounter++;
    }
  }

  return schools;
}
