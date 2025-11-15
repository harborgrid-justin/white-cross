#!/usr/bin/env ts-node

/**
 * Simple Student Data Seeder
 * Test version to create basic students with minimal related data
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize-typescript';
import { faker } from '@faker-js/faker';

// Models
import { District } from '../database/models/district.model';
import { School } from '../database/models/school.model';
import { Student, Gender } from '../database/models/student.model';
import { User } from '../database/models/user.model';

// Configuration
const STUDENT_COUNT = 150;
const DISTRICT_COUNT = 5;
const SCHOOLS_PER_DISTRICT = 3;

// Grade levels for realistic distribution
const GRADE_LEVELS = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

interface SeedingContext {
  sequelize: Sequelize;
  districts: District[];
  schools: School[];
  nurses: User[];
}

/**
 * Generate realistic student data
 */
function generateStudentData(school: School, district: District, nurseId?: string) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const dateOfBirth = faker.date.between({ 
    from: new Date(Date.now() - 22 * 365 * 24 * 60 * 60 * 1000), // 22 years ago
    to: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000)    // 3 years ago
  });

  // Generate age-appropriate grade
  const age = Math.floor((Date.now() - dateOfBirth.getTime()) / (365 * 24 * 60 * 60 * 1000));
  let grade: string;
  if (age <= 5) grade = 'K';
  else if (age >= 6 && age <= 18) grade = String(age - 5);
  else grade = '12'; // Older students in grade 12

  // Ensure grade is within our defined levels
  if (!GRADE_LEVELS.includes(grade)) {
    grade = faker.helpers.arrayElement(GRADE_LEVELS);
  }

  return {
    id: uuidv4(),
    studentNumber: `STU${faker.number.int({ min: 100000, max: 999999 })}`,
    firstName,
    lastName,
    dateOfBirth,
    grade,
    gender: faker.helpers.arrayElement(Object.values(Gender)),
    medicalRecordNum: `MRN-${faker.string.alphanumeric(8).toUpperCase()}`,
    isActive: faker.datatype.boolean(0.95), // 95% active
    enrollmentDate: faker.date.between({ 
      from: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), 
      to: new Date() 
    }),
    schoolId: school.id,
    districtId: district.id,
    nurseId,
    createdBy: nurseId,
    updatedBy: nurseId
  };
}

/**
 * Create districts
 */
async function createDistricts(context: SeedingContext): Promise<District[]> {
  console.log('Creating districts...');
  const districts = [];

  for (let i = 1; i <= DISTRICT_COUNT; i++) {
    const district = await District.create({
      id: uuidv4(),
      name: `${faker.location.city()} School District ${i}`,
      code: `SD${String(i).padStart(3, '0')}`,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.stateAbbr(),
      zipCode: faker.location.zipCode(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      isActive: true
    });
    districts.push(district);
  }

  console.log(`✅ Created ${districts.length} districts`);
  return districts;
}

/**
 * Create schools
 */
async function createSchools(context: SeedingContext): Promise<School[]> {
  console.log('Creating schools...');
  const schools = [];

  for (const district of context.districts) {
    for (let i = 1; i <= SCHOOLS_PER_DISTRICT; i++) {
      const school = await School.create({
        id: uuidv4(),
        name: `${faker.location.city()} ${faker.helpers.arrayElement(['Elementary', 'Middle', 'High'])} School`,
        code: `SCH${district.code}${String(i).padStart(2, '0')}`,
        districtId: district.id,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.stateAbbr(),
        zipCode: faker.location.zipCode(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        principal: faker.person.fullName(),
        totalEnrollment: faker.number.int({ min: 200, max: 1200 }),
        isActive: true
      });
      schools.push(school);
    }
  }

  console.log(`✅ Created ${schools.length} schools`);
  return schools;
}

/**
 * Get existing nurses or find any admin users
 */
async function getNurses(): Promise<User[]> {
  console.log('Finding nurse users...');
  
  // Try to find existing nurse users
  let nurses = await User.findAll({
    where: {
      role: 'NURSE'
    },
    limit: 10
  });

  // If no nurses found, look for any admin users as fallback
  if (nurses.length === 0) {
    nurses = await User.findAll({
      where: {
        role: 'ADMIN'
      },
      limit: 5
    });
  }

  console.log(`✅ Found ${nurses.length} nurse/admin users`);
  return nurses;
}

/**
 * Create students
 */
async function createStudents(context: SeedingContext): Promise<Student[]> {
  console.log(`Creating ${STUDENT_COUNT} students...`);
  const students = [];

  for (let i = 0; i < STUDENT_COUNT; i++) {
    const school = faker.helpers.arrayElement(context.schools);
    const district = context.districts.find(d => d.id === school.districtId)!;
    const nurse = faker.helpers.arrayElement(context.nurses);

    try {
      // Create student
      const studentData = generateStudentData(school, district, nurse?.id);
      const student = await Student.create(studentData);
      students.push(student);

      // Progress indicator
      if ((i + 1) % 25 === 0) {
        console.log(`  Progress: ${i + 1}/${STUDENT_COUNT} students created`);
      }

    } catch (error) {
      console.error(`❌ Error creating student ${i + 1}:`, error.message);
      // Continue with next student
    }
  }

  console.log(`✅ Created ${students.length} students`);
  return students;
}

/**
 * Main seeding function
 */
async function seedSimpleStudents(): Promise<void> {
  console.log('🌱 Starting simple student data seeding...\n');

  let app;
  try {
    // Initialize NestJS application
    app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn']
    });

    // Get database connection
    const sequelize = app.get<Sequelize>(Sequelize);
    
    const context: SeedingContext = {
      sequelize,
      districts: [],
      schools: [],
      nurses: []
    };

    // Set up transaction for data integrity
    const transaction = await sequelize.transaction();

    try {
      // Create base data
      context.districts = await createDistricts(context);
      context.schools = await createSchools(context);
      context.nurses = await getNurses();

      // Create students
      const createdStudents = await createStudents(context);

      // Commit transaction
      await transaction.commit();

      console.log('\n🎉 Simple student seeding completed successfully!');
      console.log(`📊 Summary:`);
      console.log(`   Districts: ${context.districts.length}`);
      console.log(`   Schools: ${context.schools.length}`);
      console.log(`   Students: ${createdStudents.length}`);

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedSimpleStudents()
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedSimpleStudents };