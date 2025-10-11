import { QueryInterface } from 'sequelize';

/**
 * Seeder: Health Records, Allergies, and Chronic Conditions
 *
 * Creates health-related data:
 * - ~1000 health records (1-3 per student)
 * - ~100 allergies (20% of students)
 * - ~50 chronic conditions (10% of students)
 *
 * HIPAA Compliance: All data is de-identified and synthetic.
 * No real patient health information (PHI) is used.
 *
 * Performance: Processes in batches for memory efficiency.
 */

// Helper data
const healthRecordTypes = [
  'CHECKUP',
  'VACCINATION',
  'ILLNESS',
  'INJURY',
  'SCREENING',
  'PHYSICAL_EXAM',
];

const allergens = [
  'Peanuts',
  'Tree nuts',
  'Milk',
  'Eggs',
  'Wheat',
  'Soy',
  'Fish',
  'Shellfish',
  'Sesame',
  'Penicillin',
  'Sulfa drugs',
  'Bee stings',
  'Latex',
  'Pollen',
];

const chronicConditions = [
  'Asthma',
  'Type 1 Diabetes',
  'ADHD',
  'Epilepsy',
  'Celiac Disease',
  'Eczema',
  'Anxiety Disorder',
  'Migraines',
  'Scoliosis',
];

const allergySeverities = ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'];
const conditionSeverities = ['MILD', 'MODERATE', 'SEVERE'];

// Helper functions
const random = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date): Date =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const now = new Date();

    // Get all students with their enrollment dates
    const students = await queryInterface.sequelize.query(
      `SELECT id, "enrollmentDate", "dateOfBirth" FROM "Students" ORDER BY id`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    ) as Array<{ id: number; enrollmentDate: Date; dateOfBirth: Date }>;

    console.log('Creating health records...');

    // ========== HEALTH RECORDS ==========
    const batchSize = 100;
    let healthRecordCount = 0;

    for (let i = 0; i < students.length; i += batchSize) {
      const batch = students.slice(i, i + batchSize);
      const healthRecords = [];

      for (const student of batch) {
        const recordCount = randomInt(1, 3);

        for (let j = 0; j < recordCount; j++) {
          const recordType = random(healthRecordTypes);
          const recordDate = randomDate(
            new Date(student.enrollmentDate),
            new Date()
          );

          healthRecords.push({
            studentId: student.id,
            type: recordType,
            date: recordDate,
            description: `Routine ${recordType.toLowerCase().replace(/_/g, ' ')} visit`,
            notes: 'No abnormalities noted. Student in good health.',
            attachments: JSON.stringify([]),
            createdAt: now,
            updatedAt: now,
          });
        }
      }

      await queryInterface.bulkInsert('HealthRecords', healthRecords, {});
      healthRecordCount += healthRecords.length;
      console.log(`  ✓ Health records: ${healthRecordCount} created`);
    }

    console.log(`✓ Created ${healthRecordCount} health records`);

    // ========== ALLERGIES (20% of students) ==========
    console.log('Creating allergies...');

    const studentsWithAllergies = students.filter(() => Math.random() < 0.2);
    const allergies = [];

    // Get nurses for verification
    const nurses = await queryInterface.sequelize.query(
      `SELECT id, "firstName", "lastName" FROM "Users" WHERE role = 'NURSE' LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    ) as Array<{ id: number; firstName: string; lastName: string }>;

    const nurse = nurses[0];

    for (const student of studentsWithAllergies) {
      allergies.push({
        studentId: student.id,
        allergen: random(allergens),
        severity: random(allergySeverities),
        reaction: 'Allergic reaction symptoms',
        treatment: 'Standard allergy protocol',
        verified: true,
        verifiedBy: nurse ? `${nurse.firstName} ${nurse.lastName}` : 'School Nurse',
        verifiedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (allergies.length > 0) {
      await queryInterface.bulkInsert('Allergies', allergies, {});
    }

    console.log(`✓ Created ${allergies.length} allergies`);

    // ========== CHRONIC CONDITIONS (10% of students) ==========
    console.log('Creating chronic conditions...');

    const studentsWithConditions = students.filter(() => Math.random() < 0.1);
    const conditions = [];

    for (const student of studentsWithConditions) {
      const diagnosedDate = randomDate(
        new Date(student.dateOfBirth),
        new Date()
      );

      conditions.push({
        studentId: student.id,
        condition: random(chronicConditions),
        diagnosedDate,
        status: 'ACTIVE',
        severity: random(conditionSeverities),
        notes: 'Condition is being monitored regularly',
        medications: JSON.stringify([]),
        restrictions: JSON.stringify([]),
        triggers: JSON.stringify([]),
        createdAt: now,
        updatedAt: now,
      });
    }

    if (conditions.length > 0) {
      await queryInterface.bulkInsert('ChronicConditions', conditions, {});
    }

    console.log(`✓ Created ${conditions.length} chronic conditions`);
    console.log(
      `✓ Total health data: ${healthRecordCount} records, ${allergies.length} allergies, ${conditions.length} conditions`
    );
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('ChronicConditions', {}, {});
    await queryInterface.bulkDelete('Allergies', {}, {});
    await queryInterface.bulkDelete('HealthRecords', {}, {});
    console.log('✓ Removed all health records, allergies, and chronic conditions');
  },
};
