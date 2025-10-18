/**
 * WC-GEN-115 | 01-districts-and-schools.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { QueryInterface, QueryTypes } from 'sequelize';

/**
 * Seeder: Districts and Schools
 *
 * Creates foundational organization data:
 * - 1 Unified School District
 * - 5 Schools (2 High Schools, 2 Elementary, 1 Middle School)
 *
 * This seeder must run first as other entities depend on districts and schools.
 *
 * HIPAA Compliance: No PHI data in this seeder.
 */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const now = new Date();

    // Create District
    await queryInterface.bulkInsert(
      'Districts',
      [
        {
          name: 'Unified School District',
          code: 'UNIFIED_DISTRICT',
          description: 'A comprehensive unified school district serving Demo City and surrounding areas',
          address: '1000 Education Boulevard',
          city: 'Demo City',
          state: 'CA',
          zipCode: '90210',
          phone: '(555) 100-1000',
          phoneNumber: '(555) 100-1000',
          email: 'district@unifiedschools.edu',
          website: 'https://unifiedschools.edu',
          superintendent: 'Dr. Richard Hamilton',
          status: 'Active',
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ]
    );

    // Get the district ID for foreign key relationships
    const districtId = 1;

    // Create Schools
    await queryInterface.bulkInsert(
      'Schools',
      [
        {
          name: 'Central High School',
          code: 'CENTRAL_HIGH',
          address: '2000 School Campus Drive',
          city: 'Demo City',
          state: 'CA',
          zipCode: '90210',
          phone: '(555) 200-2000',
          phoneNumber: '(555) 200-2000',
          email: 'office@centralhigh.edu',
          principal: 'Dr. Margaret Thompson',
          principalName: 'Dr. Margaret Thompson',
          studentCount: 500,
          totalEnrollment: 500,
          schoolType: 'High',
          status: 'Active',
          isActive: true,
          districtId: districtId,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'West Elementary School',
          code: 'WEST_ELEM',
          address: '3500 Westside Boulevard',
          city: 'Demo City',
          state: 'CA',
          zipCode: '90211',
          phone: '(555) 300-3000',
          phoneNumber: '(555) 300-3000',
          email: 'office@westelementary.edu',
          principal: 'Mrs. Jennifer Martinez',
          principalName: 'Mrs. Jennifer Martinez',
          studentCount: 350,
          totalEnrollment: 350,
          schoolType: 'Elementary',
          status: 'Active',
          isActive: true,
          districtId: districtId,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'East Middle School',
          code: 'EAST_MIDDLE',
          address: '4200 Eastbrook Avenue',
          city: 'Demo City',
          state: 'CA',
          zipCode: '90212',
          phone: '(555) 400-4000',
          phoneNumber: '(555) 400-4000',
          email: 'office@eastmiddle.edu',
          principal: 'Mr. David Chen',
          principalName: 'Mr. David Chen',
          studentCount: 420,
          totalEnrollment: 420,
          schoolType: 'Middle',
          status: 'Active',
          isActive: true,
          districtId: districtId,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'North Elementary School',
          code: 'NORTH_ELEM',
          address: '5100 Northern Heights Road',
          city: 'Demo City',
          state: 'CA',
          zipCode: '90213',
          phone: '(555) 500-5000',
          phoneNumber: '(555) 500-5000',
          email: 'office@northelementary.edu',
          principal: 'Dr. Susan Anderson',
          principalName: 'Dr. Susan Anderson',
          studentCount: 310,
          totalEnrollment: 310,
          schoolType: 'Elementary',
          status: 'Active',
          isActive: true,
          districtId: districtId,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'South High School',
          code: 'SOUTH_HIGH',
          address: '6000 South Campus Way',
          city: 'Demo City',
          state: 'CA',
          zipCode: '90214',
          phone: '(555) 600-6000',
          phoneNumber: '(555) 600-6000',
          email: 'office@southhigh.edu',
          principal: 'Dr. Robert Williams',
          principalName: 'Dr. Robert Williams',
          studentCount: 480,
          totalEnrollment: 480,
          schoolType: 'High',
          status: 'Active',
          isActive: true,
          districtId: districtId,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );

    console.log('✓ Seeded 1 district and 5 schools');
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('Schools', {}, {});
    await queryInterface.bulkDelete('Districts', {}, {});
    console.log('✓ Removed all schools and districts');
  },
};
