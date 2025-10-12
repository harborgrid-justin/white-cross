import { QueryInterface, QueryTypes } from 'sequelize';

/**
 * Seeder: Emergency Contacts
 *
 * Creates 2 emergency contacts per student (1000 total):
 * - PRIMARY contact (usually mother)
 * - SECONDARY contact (usually father)
 *
 * HIPAA Compliance: All data is synthetic/demo data.
 * Uses randomly generated names, phone numbers, emails, and addresses.
 *
 * Performance: Processes in batches of 100 students (200 contacts) at a time.
 */

// Helper data
const maleFirstNames = [
  'James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph',
  'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark',
  'Donald', 'Steven', 'Andrew', 'Paul', 'Joshua', 'Kenneth', 'Kevin', 'Brian',
  'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan',
];

const femaleFirstNames = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan',
  'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra',
  'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol', 'Amanda', 'Dorothy',
  'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia',
];

const streetNames = [
  'Main Street', 'Oak Avenue', 'Maple Drive', 'Pine Street', 'Elm Avenue',
  'Cedar Lane', 'Washington Street', 'Park Avenue', 'Lincoln Drive', 'Jefferson Street',
  'Roosevelt Avenue', 'Madison Lane', 'Highland Drive', 'Sunset Boulevard', 'River Road',
  'Lake Street', 'Forest Avenue', 'Hill Street', 'Valley Drive', 'Mountain View',
  'Spring Street', 'Summer Lane', 'Autumn Drive', 'Winter Avenue',
];

// Helper functions
const random = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generatePhoneNumber = (): string => {
  const area = randomInt(200, 999);
  const exchange = randomInt(200, 999);
  const number = randomInt(1000, 9999);
  return `(${area}) ${exchange}-${number}`;
};

const generateEmail = (firstName: string, lastName: string): string => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'email.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${random(domains)}`;
};

const generateAddress = (): string => {
  const number = randomInt(100, 9999);
  return `${number} ${random(streetNames)}, Demo City, CA ${randomInt(90001, 96162)}`;
};

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const now = new Date();

    // Get all students
    const [students] = await queryInterface.sequelize.query(
      `SELECT id, "lastName" FROM "Students" ORDER BY id`,
      { type: QueryTypes.SELECT }
    ) as [Array<{ id: number; lastName: string }>, unknown];

    console.log(`Creating emergency contacts for ${students.length} students...`);

    const batchSize = 100;
    const numberOfBatches = Math.ceil(students.length / batchSize);

    for (let batch = 0; batch < numberOfBatches; batch++) {
      const startIndex = batch * batchSize;
      const endIndex = Math.min(startIndex + batchSize, students.length);
      const batchStudents = students.slice(startIndex, endIndex);

      const contacts = [];

      for (const student of batchStudents) {
        const parentLastName = student.lastName;

        // Primary contact (mother)
        contacts.push({
          firstName: random(femaleFirstNames),
          lastName: parentLastName,
          relationship: 'Mother',
          phoneNumber: generatePhoneNumber(),
          email: generateEmail(random(femaleFirstNames), parentLastName),
          address: generateAddress(),
          priority: 'PRIMARY',
          studentId: student.id,
          createdAt: now,
          updatedAt: now,
        });

        // Secondary contact (father)
        contacts.push({
          firstName: random(maleFirstNames),
          lastName: parentLastName,
          relationship: 'Father',
          phoneNumber: generatePhoneNumber(),
          email: generateEmail(random(maleFirstNames), parentLastName),
          address: generateAddress(),
          priority: 'SECONDARY',
          studentId: student.id,
          createdAt: now,
          updatedAt: now,
        });
      }

      await queryInterface.bulkInsert('EmergencyContacts', contacts, {});
      console.log(`  ✓ Batch ${batch + 1}/${numberOfBatches} (${endIndex} students, ${contacts.length} contacts)`);
    }

    console.log(`✓ Successfully seeded ${students.length * 2} emergency contacts`);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('EmergencyContacts', {}, {});
    console.log('✓ Removed all emergency contacts');
  },
};
