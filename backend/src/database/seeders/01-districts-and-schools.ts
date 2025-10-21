/**
 * LOC: 88F20C704B
 * WC-GEN-115 | 01-districts-and-schools.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

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
import { v4 as uuidv4 } from 'uuid';

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

    // Generate district ID
    const districtId = uuidv4();

    // Create District
    await queryInterface.bulkInsert(
      'districts',
      [
        {
          id: districtId,
          name: 'Unified School District',
          code: 'UNIFIED_DISTRICT',
          address: '1000 Education Boulevard',
          city: 'Demo City',
          state: 'CA',
          zipCode: '90210',
          phone: '(555) 100-1000',
          email: 'district@unifiedschools.edu',
          website: 'https://unifiedschools.edu',
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ]
    );

    // Create Schools
    await queryInterface.bulkInsert(
      'schools',
      [
        {
          id: uuidv4(),
          name: 'Central High School',
          code: 'CENTRAL_HIGH',
          address: '2000 School Campus Drive',
          city: 'Demo City',
          state: 'CA',
          zipCode: '90210',
          phone: '(555) 200-2000',
          email: 'office@centralhigh.edu',
          principal: 'Dr. Margaret Thompson',
          studentCount: 500,
          isActive: true,
          districtId: districtId,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: uuidv4(),
          name: 'West Elementary School',
          code: 'WEST_ELEM',
          address: '3500 Westside Boulevard',
          city: 'Demo City',
          state: 'CA',
          zipCode: '90211',
          phone: '(555) 300-3000',
          email: 'office@westelementary.edu',
          principal: 'Mrs. Jennifer Martinez',
          studentCount: 350,
          isActive: true,
          districtId: districtId,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: uuidv4(),
          name: 'East Middle School',
          code: 'EAST_MIDDLE',
          address: '4200 Eastbrook Avenue',
          city: 'Demo City',
          state: 'CA',
          zipCode: '90212',
          phone: '(555) 400-4000',
          email: 'office@eastmiddle.edu',
          principal: 'Mr. David Chen',
          studentCount: 420,
          isActive: true,
          districtId: districtId,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: uuidv4(),
          name: 'North Elementary School',
          code: 'NORTH_ELEM',
          address: '5100 Northern Heights Road',
          city: 'Demo City',
          state: 'CA',
          zipCode: '90213',
          phone: '(555) 500-5000',
          email: 'office@northelementary.edu',
          principal: 'Dr. Susan Anderson',
          studentCount: 310,
          isActive: true,
          districtId: districtId,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: uuidv4(),
          name: 'South High School',
          code: 'SOUTH_HIGH',
          address: '6000 South Campus Way',
          city: 'Demo City',
          state: 'CA',
          zipCode: '90214',
          phone: '(555) 600-6000',
          email: 'office@southhigh.edu',
          principal: 'Dr. Robert Williams',
          studentCount: 480,
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
    await queryInterface.bulkDelete('schools', {}, {});
    await queryInterface.bulkDelete('districts', {}, {});
    console.log('✓ Removed all schools and districts');
  },
};
