import { QueryInterface, QueryTypes } from 'sequelize';

/**
 * Seeder: Students (500 Students)
 *
 * Creates 500 de-identified student records distributed across all schools.
 * Students are generated with realistic demographics but NO real PHI.
 *
 * HIPAA Compliance: All data is synthetic/demo data only.
 * - Names are randomly generated from common name lists
 * - Dates of birth are calculated to match grade levels
 * - Medical record numbers are sequential test data
 *
 * Performance: Uses bulkInsert in batches of 50 for optimal performance.
 */

// Helper data for realistic generation
const firstNames = {
  male: [
    'Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas',
    'Henry', 'Alexander', 'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan',
    'Jackson', 'Levi', 'Sebastian', 'Mateo', 'Jack', 'Owen', 'Theodore', 'Aiden',
    'Samuel', 'Joseph', 'John', 'David', 'Wyatt', 'Matthew', 'Luke', 'Asher',
    'Carter', 'Julian', 'Grayson', 'Leo', 'Jayden', 'Gabriel', 'Isaac', 'Lincoln',
    'Anthony', 'Hudson', 'Dylan', 'Ezra', 'Thomas', 'Charles', 'Christopher',
    'Jaxon', 'Maverick', 'Josiah',
  ],
  female: [
    'Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava', 'Sophia', 'Isabella', 'Mia',
    'Evelyn', 'Harper', 'Luna', 'Camila', 'Gianna', 'Elizabeth', 'Eleanor', 'Ella',
    'Abigail', 'Sofia', 'Avery', 'Scarlett', 'Emily', 'Aria', 'Penelope', 'Chloe',
    'Layla', 'Mila', 'Nora', 'Hazel', 'Madison', 'Ellie', 'Lily', 'Nova', 'Isla',
    'Grace', 'Violet', 'Aurora', 'Riley', 'Zoey', 'Willow', 'Emilia', 'Stella',
    'Zoe', 'Victoria', 'Hannah', 'Addison', 'Leah', 'Lucy', 'Eliana', 'Ivy', 'Everly',
  ],
};

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts',
];

const grades = [
  'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
  '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade',
  '12th Grade',
];

const genders = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];

// Helper functions
const random = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date): Date =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const now = new Date();

    // Get nurses for assignment
    const [nurses] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE role = 'NURSE'`,
      { type: QueryTypes.SELECT }
    ) as [Array<{ id: number }>, unknown];

    if (nurses.length === 0) {
      throw new Error('No nurses found. Please run user seeder first.');
    }

    console.log('Creating 500 students in batches...');

    const batchSize = 50;
    const totalStudents = 500;
    const numberOfBatches = Math.ceil(totalStudents / batchSize);

    for (let batch = 0; batch < numberOfBatches; batch++) {
      const batchStudents = [];

      for (let i = 0; i < batchSize; i++) {
        const studentIndex = batch * batchSize + i + 1;

        if (studentIndex > totalStudents) break;

        const gender = random(genders);
        const isMale = gender === 'MALE';
        const firstName = isMale ? random(firstNames.male) : random(firstNames.female);
        const lastName = random(lastNames);

        // Age range 5-18 (kindergarten through 12th grade)
        const age = randomInt(5, 18);
        const birthYear = new Date().getFullYear() - age;
        const dateOfBirth = new Date(birthYear, randomInt(0, 11), randomInt(1, 28));

        // Determine grade based on age
        let grade;
        if (age <= 5) grade = grades[0];
        else if (age >= 18) grade = grades[12];
        else grade = grades[age - 5];

        const enrollmentDate = randomDate(new Date(2020, 0, 1), new Date());

        batchStudents.push({
          studentNumber: `STU${String(studentIndex).padStart(5, '0')}`,
          firstName,
          lastName,
          dateOfBirth,
          grade,
          gender,
          medicalRecordNum: `MR${String(studentIndex).padStart(5, '0')}`,
          nurseId: random(nurses).id,
          enrollmentDate,
          createdAt: now,
          updatedAt: now,
        });
      }

      await queryInterface.bulkInsert('Students', batchStudents, {});
      console.log(`  ✓ Batch ${batch + 1}/${numberOfBatches} (${(batch + 1) * batchSize} students)`);
    }

    console.log(`✓ Successfully seeded ${totalStudents} students`);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('Students', {}, {});
    console.log('✓ Removed all students');
  },
};
