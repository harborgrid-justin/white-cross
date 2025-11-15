#!/usr/bin/env ts-node

/**
 * Direct Database Insert Seeder
 * Bypasses model hooks and inserts students directly via SQL to avoid audit issues
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

// Import enums for emergency contacts
import { ContactPriority } from '../services/communication/contact/enums/contact-priority.enum';
import { VerificationStatus } from '../services/communication/contact/enums/verification-status.enum';
import { PreferredContactMethod } from '../services/communication/contact/enums/preferred-contact-method.enum';

// Configuration
const STUDENT_COUNT = 150;

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
  nurseIds: string[];
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
    dateOfBirth: dateOfBirth.toISOString().split('T')[0], // Format as YYYY-MM-DD
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
    nurseId: nurseId || null,
    createdBy: nurseId || null,
    updatedBy: nurseId || null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Get existing data
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
    limit: 50
  });

  // Get nurse IDs - use raw query to avoid model issues
  const nurseQuery = await context.sequelize.query(
    "SELECT id FROM users WHERE role = 'NURSE' OR role = 'ADMIN' LIMIT 10",
    { type: Sequelize.QueryTypes.SELECT }
  );
  
  context.nurseIds = (nurseQuery as any[]).map(row => row.id);

  console.log(`✅ Found ${context.districts.length} districts, ${context.schools.length} schools, ${context.nurseIds.length} nurses`);
}

/**
 * Create students using direct SQL insert to bypass model hooks
 */
async function insertStudentsDirectly(context: SeedingContext): Promise<number> {
  console.log(`Creating ${STUDENT_COUNT} students using direct SQL...`);

  if (context.schools.length === 0) {
    console.error('❌ No schools available. Cannot create students.');
    return 0;
  }

  const studentData = [];
  
  // Generate all student data first
  for (let i = 0; i < STUDENT_COUNT; i++) {
    const school = faker.helpers.arrayElement(context.schools);
    const district = context.districts.find(d => d.id === school.districtId) || context.districts[0];
    const nurseId = context.nurseIds.length > 0 ? faker.helpers.arrayElement(context.nurseIds) : null;
    
    studentData.push(generateStudentData(school, district, nurseId));
  }

  // Insert students in batches using raw SQL
  const batchSize = 25;
  let insertedCount = 0;

  for (let i = 0; i < studentData.length; i += batchSize) {
    const batch = studentData.slice(i, i + batchSize);
    
    try {
      // Build the SQL insert statement
      const values = batch.map(student => 
        `('${student.id}', '${student.studentNumber}', '${student.firstName}', '${student.lastName}', ` +
        `'${student.dateOfBirth}', '${student.grade}', '${student.gender}', '${student.medicalRecordNum}', ` +
        `${student.isActive}, '${student.enrollmentDate.toISOString()}', ${student.nurseId ? "'" + student.nurseId + "'" : 'NULL'}, ` +
        `'${student.schoolId}', '${student.districtId}', ${student.createdBy ? "'" + student.createdBy + "'" : 'NULL'}, ` +
        `${student.updatedBy ? "'" + student.updatedBy + "'" : 'NULL'}, '${student.createdAt.toISOString()}', '${student.updatedAt.toISOString()}')`
      ).join(', ');

      const insertQuery = `
        INSERT INTO students 
        (id, "studentNumber", "firstName", "lastName", "dateOfBirth", grade, gender, "medicalRecordNum", 
         "isActive", "enrollmentDate", "nurseId", "schoolId", "districtId", "createdBy", "updatedBy", 
         "createdAt", "updatedAt") 
        VALUES ${values}
        ON CONFLICT ("studentNumber") DO NOTHING
      `;

      await context.sequelize.query(insertQuery);
      insertedCount += batch.length;

      console.log(`  Progress: ${insertedCount}/${STUDENT_COUNT} students processed`);

    } catch (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message);
    }
  }

  // Also create some emergency contacts and health records
  await createRelatedData(context, insertedCount);

  console.log(`✅ Attempted to insert ${insertedCount} students`);
  return insertedCount;
}

/**
 * Create emergency contacts and health records using direct SQL
 */
async function createRelatedData(context: SeedingContext, studentCount: number): Promise<void> {
  console.log('Creating emergency contacts and health records...');

  try {
    // Get student IDs from the database
    const studentsQuery = await context.sequelize.query(
      "SELECT id FROM students ORDER BY \"createdAt\" DESC LIMIT 150",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const studentIds = (studentsQuery as any[]).map(row => row.id);
    
    if (studentIds.length === 0) {
      console.log('No students found to create related data for');
      return;
    }

    // Create emergency contacts (2 per student on average)
    const emergencyContacts = [];
    const relationships = ['Mother', 'Father', 'Guardian', 'Grandmother', 'Grandfather', 'Aunt', 'Uncle', 'Sibling'];
    
    studentIds.forEach(studentId => {
      const contactCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < contactCount; i++) {
        emergencyContacts.push({
          id: uuidv4(),
          studentId,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          relationship: relationships[i] || faker.helpers.arrayElement(relationships),
          phoneNumber: faker.phone.number().replace(/[^\d+]/g, ''), // Clean phone number
          email: faker.datatype.boolean(0.8) ? faker.internet.email() : null,
          address: faker.location.streetAddress().replace(/'/g, "''"), // Escape quotes
          priority: i === 0 ? ContactPriority.PRIMARY : i === 1 ? ContactPriority.SECONDARY : ContactPriority.EMERGENCY_ONLY,
          isActive: true,
          preferredContactMethod: faker.helpers.arrayElement([PreferredContactMethod.VOICE, PreferredContactMethod.EMAIL, PreferredContactMethod.SMS]),
          verificationStatus: faker.helpers.arrayElement([VerificationStatus.VERIFIED, VerificationStatus.PENDING]),
          lastVerifiedAt: new Date(),
          canPickupStudent: faker.datatype.boolean(0.8),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    // Insert emergency contacts in batches
    const contactBatchSize = 50;
    let insertedContacts = 0;
    
    for (let i = 0; i < emergencyContacts.length; i += contactBatchSize) {
      const batch = emergencyContacts.slice(i, i + contactBatchSize);
      
      try {
        const values = batch.map(contact => 
          `('${contact.id}', '${contact.studentId}', '${contact.firstName}', '${contact.lastName}', ` +
          `'${contact.relationship}', '${contact.phoneNumber}', ${contact.email ? "'" + contact.email + "'" : 'NULL'}, ` +
          `'${contact.address}', '${contact.priority}', ${contact.isActive}, '${contact.preferredContactMethod}', ` +
          `'${contact.verificationStatus}', '${contact.lastVerifiedAt.toISOString()}', ${contact.canPickupStudent}, ` +
          `'${contact.createdAt.toISOString()}', '${contact.updatedAt.toISOString()}')`
        ).join(', ');

        const insertQuery = `
          INSERT INTO emergency_contacts 
          (id, "studentId", "firstName", "lastName", relationship, "phoneNumber", email, address, 
           priority, "isActive", "preferredContactMethod", "verificationStatus", "lastVerifiedAt", 
           "canPickupStudent", "createdAt", "updatedAt") 
          VALUES ${values}
        `;

        await context.sequelize.query(insertQuery);
        insertedContacts += batch.length;
      } catch (error) {
        console.error(`❌ Error inserting emergency contacts batch:`, error.message);
      }
    }

    console.log(`✅ Inserted ${insertedContacts} emergency contacts`);

    // Create health records (2-3 per student)
    const healthRecords = [];
    
    studentIds.forEach(studentId => {
      const recordCount = faker.number.int({ min: 1, max: 4 });
      for (let i = 0; i < recordCount; i++) {
        healthRecords.push({
          id: uuidv4(),
          studentId,
          recordType: faker.helpers.arrayElement(HEALTH_RECORD_TYPES),
          title: faker.helpers.arrayElement([
            'Annual Physical Examination',
            'Sports Physical',
            'Vision Screening',
            'Hearing Test',
            'Vaccination Record',
            'Injury Report',
            'Illness Episode'
          ]),
          description: faker.lorem.paragraph().replace(/'/g, "''"), // Escape quotes
          recordDate: faker.date.recent({ days: 365 }),
          provider: faker.person.fullName(),
          followUpRequired: faker.datatype.boolean(0.3),
          followUpCompleted: false,
          attachments: '[]',
          metadata: '{}',
          isConfidential: faker.datatype.boolean(0.2),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    // Insert health records in batches
    let insertedRecords = 0;
    
    for (let i = 0; i < healthRecords.length; i += contactBatchSize) {
      const batch = healthRecords.slice(i, i + contactBatchSize);
      
      try {
        const values = batch.map(record => 
          `('${record.id}', '${record.studentId}', '${record.recordType}', '${record.title}', ` +
          `'${record.description}', '${record.recordDate.toISOString()}', '${record.provider}', ` +
          `${record.followUpRequired}, ${record.followUpCompleted}, '${record.attachments}', '${record.metadata}', ` +
          `${record.isConfidential}, '${record.createdAt.toISOString()}', '${record.updatedAt.toISOString()}')`
        ).join(', ');

        const insertQuery = `
          INSERT INTO health_records 
          (id, "studentId", "recordType", title, description, "recordDate", provider, 
           "followUpRequired", "followUpCompleted", attachments, metadata, "isConfidential", 
           "createdAt", "updatedAt") 
          VALUES ${values}
        `;

        await context.sequelize.query(insertQuery);
        insertedRecords += batch.length;
      } catch (error) {
        console.error(`❌ Error inserting health records batch:`, error.message);
      }
    }

    console.log(`✅ Inserted ${insertedRecords} health records`);

  } catch (error) {
    console.error('❌ Error creating related data:', error.message);
  }
}

/**
 * Main seeding function
 */
async function seedStudentsDirectly(): Promise<void> {
  console.log('🌱 Starting direct student data insertion...\n');

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
      nurseIds: []
    };

    // Get existing data
    await getExistingData(context);

    if (context.schools.length === 0) {
      console.error('❌ No schools found. Please run the school/district seeder first.');
      return;
    }

    // Insert students directly
    const insertedCount = await insertStudentsDirectly(context);

    // Check final counts
    const finalStudentCount = await context.sequelize.query(
      "SELECT COUNT(*) as count FROM students",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const finalContactCount = await context.sequelize.query(
      "SELECT COUNT(*) as count FROM emergency_contacts",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const finalRecordCount = await context.sequelize.query(
      "SELECT COUNT(*) as count FROM health_records",
      { type: Sequelize.QueryTypes.SELECT }
    );

    console.log('\n🎉 Direct student insertion completed!');
    console.log(`📊 Final Summary:`);
    console.log(`   Total Students: ${(finalStudentCount as any)[0].count}`);
    console.log(`   Total Emergency Contacts: ${(finalContactCount as any)[0].count}`);
    console.log(`   Total Health Records: ${(finalRecordCount as any)[0].count}`);

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
  seedStudentsDirectly()
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedStudentsDirectly };