#!/usr/bin/env ts-node

/**
 * Student Only Seeder
 * Creates 150 unique students using existing districts and schools
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
import { EmergencyContact } from '../database/models/emergency-contact.model';
import { HealthRecord } from '../database/models/health-record.model';
import { User } from '../database/models/user.model';

// Import enums for emergency contacts
import { ContactPriority } from '../services/communication/contact/enums/contact-priority.enum';
import { VerificationStatus } from '../services/communication/contact/enums/verification-status.enum';
import { PreferredContactMethod } from '../services/communication/contact/enums/preferred-contact-method.enum';

// Configuration
const STUDENT_COUNT = 150;
const MIN_EMERGENCY_CONTACTS = 1;
const MAX_EMERGENCY_CONTACTS = 3;

// Grade levels for realistic distribution
const GRADE_LEVELS = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

// Health record types
const HEALTH_RECORD_TYPES = [
  'Physical Exam', 'Vision Screening', 'Hearing Screening', 'Dental Check',
  'Immunization', 'Injury Report', 'Illness Episode', 'Medication Administration',
  'Emergency Care', 'Sports Physical', 'BMI Assessment', 'Mental Health'
];

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
 * Generate emergency contacts for a student
 */
function generateEmergencyContacts(studentId: string, count: number = 2) {
  const contacts = [];
  const relationships = ['Mother', 'Father', 'Guardian', 'Grandmother', 'Grandfather', 'Aunt', 'Uncle', 'Sibling'];

  for (let i = 0; i < count; i++) {
    contacts.push({
      id: uuidv4(),
      studentId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      relationship: relationships[i] || faker.helpers.arrayElement(relationships),
      phoneNumber: faker.phone.number(),
      email: faker.datatype.boolean(0.8) ? faker.internet.email() : null,
      address: faker.location.streetAddress(),
      priority: i === 0 ? ContactPriority.PRIMARY : i === 1 ? ContactPriority.SECONDARY : ContactPriority.EMERGENCY_ONLY,
      isActive: true,
      preferredContactMethod: faker.helpers.arrayElement([PreferredContactMethod.VOICE, PreferredContactMethod.EMAIL, PreferredContactMethod.SMS]),
      verificationStatus: faker.helpers.arrayElement([VerificationStatus.VERIFIED, VerificationStatus.PENDING, VerificationStatus.FAILED]),
      lastVerifiedAt: faker.date.recent(),
      canPickupStudent: faker.datatype.boolean(0.8),
      notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null
    });
  }

  return contacts;
}

/**
 * Generate health records for a student
 */
function generateHealthRecords(studentId: string, count: number = 3) {
  const records = [];

  for (let i = 0; i < count; i++) {
    records.push({
      id: uuidv4(),
      studentId,
      recordType: faker.helpers.arrayElement(HEALTH_RECORD_TYPES),
      title: faker.helpers.arrayElement([
        'Annual Physical Examination',
        'Sports Physical',
        'Vision Screening',
        'Hearing Test',
        'Vaccination Record',
        'Injury Report - Playground',
        'Illness Episode - Flu',
        'Medication Administration',
        'Emergency Care'
      ]),
      description: faker.lorem.paragraph(),
      recordDate: faker.date.recent({ days: 365 }),
      provider: faker.person.fullName(),
      providerNpi: faker.string.numeric(10),
      facility: faker.helpers.arrayElement([
        'School Health Office',
        'Pediatric Associates',
        'Children\'s Hospital',
        'Family Medicine Clinic',
        'Urgent Care Center'
      ]),
      diagnosis: faker.datatype.boolean(0.6) ? faker.lorem.words(3) : null,
      diagnosisCode: faker.datatype.boolean(0.6) ? `ICD-10: ${faker.string.alphanumeric(6).toUpperCase()}` : null,
      treatment: faker.datatype.boolean(0.7) ? faker.lorem.sentence() : null,
      followUpRequired: faker.datatype.boolean(0.3),
      followUpDate: faker.datatype.boolean(0.3) ? faker.date.future() : null,
      followUpCompleted: false,
      attachments: [],
      metadata: {},
      isConfidential: faker.datatype.boolean(0.2),
      notes: faker.datatype.boolean(0.5) ? faker.lorem.sentence() : null
    });
  }

  return records;
}

/**
 * Get existing districts and schools
 */
async function getExistingData(context: SeedingContext): Promise<void> {
  console.log('Finding existing districts and schools...');
  
  // Get existing districts
  context.districts = await District.findAll({
    where: { isActive: true },
    limit: 20
  });

  // Get existing schools
  context.schools = await School.findAll({
    where: { isActive: true },
    limit: 50,
    include: [{
      model: District,
      as: 'district'
    }]
  });

  // Get nurses
  let nurses = await User.findAll({
    where: { role: 'NURSE' },
    limit: 10
  });

  // If no nurses found, look for admin users as fallback
  if (nurses.length === 0) {
    nurses = await User.findAll({
      where: { role: 'ADMIN' },
      limit: 5
    });
  }

  context.nurses = nurses;

  console.log(`✅ Found ${context.districts.length} districts, ${context.schools.length} schools, ${context.nurses.length} nurses`);
}

/**
 * Create districts if none exist
 */
async function ensureDistricts(context: SeedingContext): Promise<void> {
  if (context.districts.length === 0) {
    console.log('No districts found, creating 3 districts...');
    
    for (let i = 1; i <= 3; i++) {
      try {
        const district = await District.create({
          id: uuidv4(),
          name: `${faker.location.city()} School District ${i}`,
          code: `SED${Date.now()}${String(i).padStart(2, '0')}`, // Unique timestamp-based code
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state({ abbreviated: true }),
          zipCode: faker.location.zipCode(),
          phone: faker.phone.number(),
          email: faker.internet.email(),
          isActive: true
        });
        context.districts.push(district);
      } catch (error) {
        console.log(`Warning: Could not create district ${i}, continuing...`);
      }
    }
  }
}

/**
 * Create schools if needed
 */
async function ensureSchools(context: SeedingContext): Promise<void> {
  if (context.schools.length === 0 && context.districts.length > 0) {
    console.log('No schools found, creating 3 schools...');
    
    for (let i = 1; i <= 3; i++) {
      try {
        const district = faker.helpers.arrayElement(context.districts);
        const school = await School.create({
          id: uuidv4(),
          name: `${faker.location.city()} ${faker.helpers.arrayElement(['Elementary', 'Middle', 'High'])} School`,
          code: `SCH${Date.now()}${String(i).padStart(2, '0')}`, // Unique timestamp-based code
          districtId: district.id,
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state({ abbreviated: true }),
          zipCode: faker.location.zipCode(),
          phone: faker.phone.number(),
          email: faker.internet.email(),
          principal: faker.person.fullName(),
          totalEnrollment: faker.number.int({ min: 200, max: 1200 }),
          isActive: true
        });
        context.schools.push(school);
      } catch (error) {
        console.log(`Warning: Could not create school ${i}, continuing...`);
      }
    }
  }
}

/**
 * Create students with related data
 */
async function createStudents(context: SeedingContext): Promise<Student[]> {
  console.log(`Creating ${STUDENT_COUNT} students with related data...`);
  const students = [];

  if (context.schools.length === 0) {
    console.error('❌ No schools available. Cannot create students.');
    return students;
  }

  for (let i = 0; i < STUDENT_COUNT; i++) {
    const school = faker.helpers.arrayElement(context.schools);
    const district = context.districts.find(d => d.id === school.districtId) || context.districts[0];
    const nurse = context.nurses.length > 0 ? faker.helpers.arrayElement(context.nurses) : null;

    try {
      // Create student
      const studentData = generateStudentData(school, district, nurse?.id);
      const student = await Student.create(studentData);
      students.push(student);

      // Create emergency contacts
      const emergencyContactCount = faker.number.int({ 
        min: MIN_EMERGENCY_CONTACTS, 
        max: MAX_EMERGENCY_CONTACTS 
      });
      const emergencyContacts = generateEmergencyContacts(student.id, emergencyContactCount);
      await EmergencyContact.bulkCreate(emergencyContacts);

      // Create health records
      const healthRecordCount = faker.number.int({ min: 1, max: 4 });
      const healthRecords = generateHealthRecords(student.id, healthRecordCount);
      await HealthRecord.bulkCreate(healthRecords);

      // Progress indicator
      if ((i + 1) % 30 === 0) {
        console.log(`  Progress: ${i + 1}/${STUDENT_COUNT} students created`);
      }

    } catch (error) {
      console.error(`❌ Error creating student ${i + 1}:`, error.message);
      // Continue with next student
    }
  }

  console.log(`✅ Created ${students.length} students with related data`);
  return students;
}

/**
 * Main seeding function
 */
async function seedStudentsOnly(): Promise<void> {
  console.log('🌱 Starting student-only data seeding...\n');

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

    // Get existing data
    await getExistingData(context);

    // Ensure we have districts and schools
    await ensureDistricts(context);
    await ensureSchools(context);

    // Set up transaction for data integrity
    const transaction = await sequelize.transaction();

    try {
      // Create students and related data
      const createdStudents = await createStudents(context);

      // Commit transaction
      await transaction.commit();

      console.log('\n🎉 Student seeding completed successfully!');
      console.log(`📊 Summary:`);
      console.log(`   Available Districts: ${context.districts.length}`);
      console.log(`   Available Schools: ${context.schools.length}`);
      console.log(`   Available Nurses: ${context.nurses.length}`);
      console.log(`   Students Created: ${createdStudents.length}`);
      console.log(`   Estimated Emergency Contacts: ${createdStudents.length * 2}`);
      console.log(`   Estimated Health Records: ${createdStudents.length * 3}`);

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
  seedStudentsOnly()
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedStudentsOnly };