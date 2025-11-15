#!/usr/bin/env ts-node

/**
 * Robust Database Insert Seeder with Proper SQL Escaping
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

// Valid health record types from the enum
const VALID_HEALTH_RECORD_TYPES = [
  'general',
  'allergy',
  'medication',
  'vaccination',
  'injury',
  'illness',
  'screening',
  'assessment',
  'emergency_care',
  'mental_health',
  'dental',
  'vision',
  'hearing'
];

interface SeedingContext {
  sequelize: Sequelize;
  districts: District[];
  schools: School[];
  nurseIds: string[];
}

/**
 * Escape single quotes for SQL
 */
function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

/**
 * Generate realistic student data with proper escaping
 */
function generateStudentData(school: School, district: District, nurseId?: string) {
  const firstName = escapeSql(faker.person.firstName());
  const lastName = escapeSql(faker.person.lastName());
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
  
  // Get districts and schools
  context.districts = await District.findAll({ where: { isActive: true } });
  context.schools = await School.findAll({ where: { isActive: true } });
  
  // Get nurse IDs (users with role 'NURSE')
  const nurses = await context.sequelize.query(`
    SELECT id FROM users WHERE role = 'NURSE' LIMIT 10
  `, { type: Sequelize.QueryTypes.SELECT }) as any[];
  
  context.nurseIds = nurses.map(n => n.id);

  console.log(`✅ Found ${context.districts.length} districts, ${context.schools.length} schools, ${context.nurseIds.length} nurses`);
  
  if (context.districts.length === 0 || context.schools.length === 0) {
    throw new Error('No districts or schools found. Please seed districts and schools first.');
  }
}

/**
 * Create students using parameterized queries to avoid SQL injection
 */
async function createStudents(context: SeedingContext): Promise<number> {
  console.log(`Creating ${STUDENT_COUNT} students using parameterized SQL...`);
  
  const batchSize = 25;
  let insertedCount = 0;
  
  for (let i = 0; i < STUDENT_COUNT; i += batchSize) {
    try {
      const batch = [];
      
      for (let j = i; j < Math.min(i + batchSize, STUDENT_COUNT); j++) {
        const randomSchool = faker.helpers.arrayElement(context.schools);
        const randomDistrict = context.districts.find(d => d.id === randomSchool.districtId) || faker.helpers.arrayElement(context.districts);
        const randomNurse = context.nurseIds.length > 0 ? faker.helpers.arrayElement(context.nurseIds) : null;
        
        batch.push(generateStudentData(randomSchool, randomDistrict, randomNurse));
      }

      // Use parameterized query to avoid SQL injection
      const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
      const values = [];
      
      batch.forEach(student => {
        values.push(
          student.id,
          student.studentNumber,
          student.firstName,
          student.lastName,
          student.dateOfBirth,
          student.grade,
          student.gender,
          student.medicalRecordNum,
          student.isActive,
          student.enrollmentDate.toISOString(),
          student.nurseId,
          student.schoolId,
          student.districtId,
          student.createdBy,
          student.updatedBy,
          student.createdAt.toISOString(),
          student.updatedAt.toISOString()
        );
      });

      const insertQuery = `
        INSERT INTO students 
        (id, "studentNumber", "firstName", "lastName", "dateOfBirth", grade, gender, "medicalRecordNum", 
         "isActive", "enrollmentDate", "nurseId", "schoolId", "districtId", "createdBy", "updatedBy", 
         "createdAt", "updatedAt") 
        VALUES ${placeholders}
        ON CONFLICT ("studentNumber") DO NOTHING
      `;

      await context.sequelize.query(insertQuery, {
        replacements: values,
        type: Sequelize.QueryTypes.INSERT
      });
      
      insertedCount += batch.length;
      console.log(`  Progress: ${insertedCount}/${STUDENT_COUNT} students processed`);

    } catch (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message);
    }
  }

  // Create related data
  await createRelatedData(context, insertedCount);

  console.log(`✅ Attempted to insert ${insertedCount} students`);
  return insertedCount;
}

/**
 * Create emergency contacts and health records using parameterized SQL
 */
async function createRelatedData(context: SeedingContext, studentCount: number): Promise<void> {
  console.log('Creating emergency contacts and health records...');

  // Get all student IDs that were successfully inserted
  const studentIds = await context.sequelize.query(`
    SELECT id FROM students ORDER BY "createdAt" DESC LIMIT ${studentCount}
  `, { type: Sequelize.QueryTypes.SELECT }) as any[];

  // Create emergency contacts (1-3 per student)
  let emergencyContactCount = 0;
  const ecBatchSize = 25;
  
  for (let i = 0; i < studentIds.length; i += ecBatchSize) {
    try {
      const batch = studentIds.slice(i, i + ecBatchSize);
      const contactData = [];
      const values = [];
      
      for (const student of batch) {
        const numContacts = faker.number.int({ min: 1, max: 3 });
        
        for (let j = 0; j < numContacts; j++) {
          const firstName = escapeSql(faker.person.firstName());
          const lastName = escapeSql(faker.person.lastName());
          
          contactData.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
          values.push(
            uuidv4(),
            student.id,
            firstName,
            lastName,
            faker.helpers.arrayElement(['parent', 'guardian', 'relative', 'emergency']),
            faker.phone.number('###-###-####'),
            faker.internet.email(firstName.replace(/'/g, ''), lastName.replace(/'/g, '')),
            faker.helpers.arrayElement(Object.values(ContactPriority)),
            faker.helpers.arrayElement(Object.values(PreferredContactMethod)),
            faker.helpers.arrayElement(Object.values(VerificationStatus)),
            faker.datatype.boolean(0.9), // 90% can pick up
            faker.datatype.boolean(0.8), // 80% can authorize
            new Date().toISOString(),
            new Date().toISOString(),
            true // isActive
          );
          emergencyContactCount++;
        }
      }
      
      if (contactData.length > 0) {
        const insertQuery = `
          INSERT INTO emergency_contacts 
          (id, "studentId", "firstName", "lastName", relationship, "phoneNumber", email, priority, 
           "preferredContactMethod", "verificationStatus", "canPickupStudent", "canAuthorizeEmergencyTreatment", 
           "createdAt", "updatedAt", "isActive") 
          VALUES ${contactData.join(', ')}
        `;

        await context.sequelize.query(insertQuery, {
          replacements: values,
          type: Sequelize.QueryTypes.INSERT
        });
      }

    } catch (error) {
      console.error(`❌ Error inserting emergency contacts batch:`, error.message);
    }
  }

  console.log(`✅ Inserted ${emergencyContactCount} emergency contacts`);

  // Create health records (0-5 per student)
  let healthRecordCount = 0;
  const hrBatchSize = 20;
  
  for (let i = 0; i < studentIds.length; i += hrBatchSize) {
    try {
      const batch = studentIds.slice(i, i + hrBatchSize);
      const recordData = [];
      const values = [];
      
      for (const student of batch) {
        const numRecords = faker.number.int({ min: 0, max: 5 });
        
        for (let j = 0; j < numRecords; j++) {
          const recordType = faker.helpers.arrayElement(VALID_HEALTH_RECORD_TYPES);
          const description = escapeSql(faker.lorem.sentence());
          
          recordData.push('(?, ?, ?, ?, ?, ?, ?, ?, ?)');
          values.push(
            uuidv4(),
            student.id,
            recordType,
            faker.date.between({ 
              from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), 
              to: new Date() 
            }).toISOString().split('T')[0], // recordDate
            description,
            context.nurseIds.length > 0 ? faker.helpers.arrayElement(context.nurseIds) : null, // providerId
            faker.datatype.boolean(0.1) ? 'confidential' : 'standard', // confidentialityLevel
            new Date().toISOString(),
            new Date().toISOString()
          );
          healthRecordCount++;
        }
      }
      
      if (recordData.length > 0) {
        const insertQuery = `
          INSERT INTO health_records 
          (id, "studentId", "recordType", "recordDate", description, "providerId", 
           "confidentialityLevel", "createdAt", "updatedAt") 
          VALUES ${recordData.join(', ')}
        `;

        await context.sequelize.query(insertQuery, {
          replacements: values,
          type: Sequelize.QueryTypes.INSERT
        });
      }

    } catch (error) {
      console.error(`❌ Error inserting health records batch:`, error.message);
    }
  }

  console.log(`✅ Inserted ${healthRecordCount} health records`);
}

/**
 * Main seeding function
 */
async function seedStudentsDirectly(): Promise<void> {
  console.log('🌱 Starting robust student data insertion...\n');

  const app = await NestFactory.create(AppModule, { logger: false });
  const sequelize = app.get(Sequelize);
  
  const context: SeedingContext = {
    sequelize,
    districts: [],
    schools: [],
    nurseIds: []
  };

  try {
    await getExistingData(context);
    const studentCount = await createStudents(context);
    
    console.log('\n🎉 Robust student insertion completed!');
    console.log('📊 Final Summary:');
    console.log(`   Total Students: ${studentCount}`);
    
    // Get final counts
    const [studentsResult] = await sequelize.query('SELECT COUNT(*) as count FROM students');
    const [contactsResult] = await sequelize.query('SELECT COUNT(*) as count FROM emergency_contacts');
    const [recordsResult] = await sequelize.query('SELECT COUNT(*) as count FROM health_records');
    
    console.log(`   Final Database Counts:`);
    console.log(`   Students: ${(studentsResult as any)[0].count}`);
    console.log(`   Emergency Contacts: ${(contactsResult as any)[0].count}`);
    console.log(`   Health Records: ${(recordsResult as any)[0].count}`);

  } catch (error) {
    console.error('\n❌ Seeding process failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// Run the seeder
if (require.main === module) {
  seedStudentsDirectly()
    .then(() => {
      console.log('\n✅ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedStudentsDirectly };