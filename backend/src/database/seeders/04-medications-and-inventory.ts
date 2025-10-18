/**
 * WC-GEN-118 | 04-medications-and-inventory.ts - General utility functions and operations
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
 * Seeder: Medications and Inventory
 *
 * Creates medication master data and inventory:
 * - 12 Medications (including controlled substances)
 * - Inventory records for each medication with batch numbers
 *
 * HIPAA Compliance: No PHI data. Generic medication catalog only.
 *
 * Note: Controlled substances (Schedule II) are flagged appropriately.
 */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const now = new Date();
    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const medications = [
      {
        name: 'Albuterol Inhaler',
        genericName: 'Albuterol Sulfate',
        dosageForm: 'Inhaler',
        strength: '90 mcg/dose',
        manufacturer: 'ProAir',
        ndc: '12345-678-90',
        isControlled: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'EpiPen',
        genericName: 'Epinephrine',
        dosageForm: 'Auto-injector',
        strength: '0.3 mg',
        manufacturer: 'Mylan',
        ndc: '23456-789-01',
        isControlled: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Tylenol',
        genericName: 'Acetaminophen',
        dosageForm: 'Tablet',
        strength: '325 mg',
        manufacturer: 'Johnson & Johnson',
        ndc: '34567-890-12',
        isControlled: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Aspirin',
        genericName: 'Acetylsalicylic acid',
        dosageForm: 'Tablet',
        strength: '325 mg',
        manufacturer: 'Bayer',
        ndc: '45678-901-23',
        isControlled: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Methylphenidate',
        genericName: 'Methylphenidate HCl',
        dosageForm: 'Tablet',
        strength: '10 mg',
        manufacturer: 'Novartis',
        ndc: '56789-012-34',
        isControlled: true, // Schedule II
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Adderall',
        genericName: 'Amphetamine/Dextroamphetamine',
        dosageForm: 'Tablet',
        strength: '10 mg',
        manufacturer: 'Teva',
        ndc: '67890-123-45',
        isControlled: true, // Schedule II
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        dosageForm: 'Tablet',
        strength: '200 mg',
        manufacturer: 'Advil',
        ndc: '78901-234-56',
        isControlled: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Benadryl',
        genericName: 'Diphenhydramine',
        dosageForm: 'Capsule',
        strength: '25 mg',
        manufacturer: 'Johnson & Johnson',
        ndc: '89012-345-67',
        isControlled: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Insulin',
        genericName: 'Insulin Human',
        dosageForm: 'Injection',
        strength: '100 units/mL',
        manufacturer: 'Novo Nordisk',
        ndc: '90123-456-78',
        isControlled: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        dosageForm: 'Capsule',
        strength: '500 mg',
        manufacturer: 'Generic',
        ndc: '01234-567-89',
        isControlled: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Zoloft',
        genericName: 'Sertraline',
        dosageForm: 'Tablet',
        strength: '50 mg',
        manufacturer: 'Pfizer',
        ndc: '11234-567-90',
        isControlled: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Concerta',
        genericName: 'Methylphenidate ER',
        dosageForm: 'Extended Release',
        strength: '18 mg',
        manufacturer: 'Janssen',
        ndc: '21234-567-91',
        isControlled: true, // Schedule II
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('Medications', medications, {});

    // Get inserted medications for inventory
    const [insertedMedications] = await queryInterface.sequelize.query(
      'SELECT id, name, ndc FROM "Medications"',
      { type: QueryTypes.SELECT }
    ) as [Array<{ id: number; name: string; ndc: string }>, unknown];

    // Generate random helper
    const randomInt = (min: number, max: number): number =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    // Create inventory for each medication
    const inventoryData = insertedMedications.map((med) => ({
      medicationId: med.id,
      batchNumber: `BATCH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      expirationDate: oneYearFromNow,
      quantity: randomInt(20, 100),
      reorderLevel: 10,
      costPerUnit: randomInt(5, 50),
      supplier: 'Medical Supply Co.',
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert('MedicationInventories', inventoryData, {});

    console.log(`✓ Seeded ${medications.length} medications with inventory records`);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('MedicationInventories', {}, {});
    await queryInterface.bulkDelete('Medications', {}, {});
    console.log('✓ Removed all medication inventories and medications');
  },
};
