#!/usr/bin/env ts-node

/**
 * Comprehensive Student Data Seeder
 *
 * This script creates 150 unique students with realistic data and populates
 * associated models including:
 * - Districts
 * - Schools
 * - Emergency Contacts
 * - Health Records
 * - Allergies
 * - Vaccinations
 * - Appointments
 * - Medications
 *
 * Usage: npm run seed:students:comprehensive
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
import { Allergy, AllergySeverity, AllergyType } from '../database/models/allergy.model';
import { Vaccination, VaccineType, SiteOfAdministration } from '../database/models/vaccination.model';
import { Appointment } from '../database/models/appointment.model';
import { Medication } from '../database/models/medication.model';
import { User } from '../database/models/user.model';

// Import enums for emergency contacts
import { ContactPriority } from '../services/communication/contact/enums/contact-priority.enum';
import { VerificationStatus } from '../services/communication/contact/enums/verification-status.enum';
import { PreferredContactMethod } from '../services/communication/contact/enums/preferred-contact-method.enum';

// Configuration
const STUDENT_COUNT = 150;
const DISTRICT_COUNT = 5;
const SCHOOLS_PER_DISTRICT = 3;
const MIN_EMERGENCY_CONTACTS = 1;
const MAX_EMERGENCY_CONTACTS = 3;

// Grade levels for realistic distribution
const GRADE_LEVELS = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

// Common allergies
const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree nuts',
  'Milk',
  'Eggs',
  'Fish',
  'Shellfish',
  'Wheat',
  'Soy',
  'Penicillin',
  'Latex',
  'Pollen',
  'Dust mites',
  'Bee stings',
  'Pet dander',
];

// Common vaccinations
const VACCINATIONS = [
  { name: 'MMR (Measles, Mumps, Rubella)', ageMonths: [12, 48] },
  { name: 'DTaP (Diphtheria, Tetanus, Pertussis)', ageMonths: [2, 4, 6, 18, 48] },
  { name: 'Polio (IPV)', ageMonths: [2, 4, 12, 48] },
  { name: 'Hepatitis B', ageMonths: [0, 2, 12] },
  { name: 'Hib (Haemophilus influenzae type b)', ageMonths: [2, 4, 6, 12] },
  { name: 'PCV (Pneumococcal)', ageMonths: [2, 4, 6, 12] },
  { name: 'Rotavirus', ageMonths: [2, 4, 6] },
  { name: 'Influenza', ageMonths: [6] }, // Annual
  { name: 'Varicella (Chickenpox)', ageMonths: [12, 48] },
  { name: 'Hepatitis A', ageMonths: [12, 18] },
  { name: 'Meningococcal', ageMonths: [132, 192] }, // 11 years, 16 years
  { name: 'HPV', ageMonths: [132] }, // 11 years
  { name: 'Tdap (Tetanus, Diphtheria, Pertussis booster)', ageMonths: [132] }, // 11 years
];

// Health record types
const HEALTH_RECORD_TYPES = [
  'Physical Exam',
  'Vision Screening',
  'Hearing Screening',
  'Dental Check',
  'Immunization',
  'Injury Report',
  'Illness Episode',
  'Medication Administration',
  'Emergency Care',
  'Sports Physical',
  'BMI Assessment',
  'Mental Health',
];

interface SeedingContext {
  sequelize: Sequelize;
  districts: District[];
  schools: School[];
  nurses: User[];
  createdStudents: Student[];
}

/**
 * Generate realistic student data
 */
function generateStudentData(school: School, district: District, nurseId?: string) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const dateOfBirth = faker.date.between({
    from: new Date(Date.now() - 22 * 365 * 24 * 60 * 60 * 1000), // 22 years ago
    to: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000), // 3 years ago
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
      to: new Date(),
    }),
    schoolId: school.id,
    districtId: district.id,
    nurseId,
    createdBy: nurseId,
    updatedBy: nurseId,
  };
}

/**
 * Generate emergency contacts for a student
 */
function generateEmergencyContacts(studentId: string, count: number = 2) {
  const contacts = [];
  const relationships = [
    'Mother',
    'Father',
    'Guardian',
    'Grandmother',
    'Grandfather',
    'Aunt',
    'Uncle',
    'Sibling',
  ];

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
      priority:
        i === 0
          ? ContactPriority.PRIMARY
          : i === 1
            ? ContactPriority.SECONDARY
            : ContactPriority.EMERGENCY_ONLY,
      isActive: true,
      preferredContactMethod: faker.helpers.arrayElement([
        PreferredContactMethod.VOICE,
        PreferredContactMethod.EMAIL,
        PreferredContactMethod.SMS,
      ]),
      verificationStatus: faker.helpers.arrayElement([
        VerificationStatus.VERIFIED,
        VerificationStatus.PENDING,
        VerificationStatus.FAILED,
      ]),
      lastVerifiedAt: faker.date.recent(),
      canPickupStudent: faker.datatype.boolean(0.8),
      notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
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
        'Emergency Care',
      ]),
      description: faker.lorem.paragraph(),
      recordDate: faker.date.recent({ days: 365 }),
      provider: faker.person.fullName(),
      providerNpi: faker.string.numeric(10),
      facility: faker.helpers.arrayElement([
        'School Health Office',
        'Pediatric Associates',
        "Children's Hospital",
        'Family Medicine Clinic',
        'Urgent Care Center',
      ]),
      diagnosis: faker.datatype.boolean(0.6) ? faker.lorem.words(3) : null,
      diagnosisCode: faker.datatype.boolean(0.6)
        ? `ICD-10: ${faker.string.alphanumeric(6).toUpperCase()}`
        : null,
      treatment: faker.datatype.boolean(0.7) ? faker.lorem.sentence() : null,
      followUpRequired: faker.datatype.boolean(0.3),
      followUpDate: faker.datatype.boolean(0.3) ? faker.date.future() : null,
      followUpCompleted: false,
      attachments: [],
      metadata: {},
      isConfidential: faker.datatype.boolean(0.2),
      notes: faker.datatype.boolean(0.5) ? faker.lorem.sentence() : null,
    });
  }

  return records;
}

/**
 * Generate allergies for a student
 */
function generateAllergies(studentId: string) {
  const allergies = [];
  const studentAllergies = faker.helpers.arrayElements(
    COMMON_ALLERGIES,
    faker.number.int({ min: 0, max: 3 }),
  );

  studentAllergies.forEach((allergen) => {
    allergies.push({
      id: uuidv4(),
      studentId,
      allergen,
      allergyType: faker.helpers.arrayElement(Object.values(AllergyType)),
      severity: faker.helpers.arrayElement(Object.values(AllergySeverity)),
      symptoms: faker.helpers.arrayElement([
        'Hives',
        'Swelling',
        'Difficulty breathing',
        'Nausea',
        'Vomiting',
        'Diarrhea',
        'Anaphylaxis',
        'Skin rash',
        'Runny nose',
        'Watery eyes',
      ]),
      reactions: null,
      treatment: faker.helpers.arrayElement([
        'Avoid exposure',
        'Antihistamine',
        'EpiPen',
        'Inhaler',
        'Emergency care',
      ]),
      emergencyProtocol: faker.datatype.boolean(0.3) ? 'Administer EpiPen and call 911' : null,
      diagnosedDate: faker.date.past(),
      verified: faker.datatype.boolean(0.8),
      active: true,
      notes: faker.datatype.boolean(0.4) ? faker.lorem.sentence() : null,
    });
  });

  return allergies;
}

/**
 * Generate vaccinations for a student based on age
 */
function generateVaccinations(studentId: string, dateOfBirth: Date) {
  const vaccinations = [];
  const ageInMonths = Math.floor((Date.now() - dateOfBirth.getTime()) / (30 * 24 * 60 * 60 * 1000));

  VACCINATIONS.forEach((vaccination) => {
    vaccination.ageMonths.forEach((requiredAgeMonths) => {
      if (ageInMonths >= requiredAgeMonths) {
        vaccinations.push({
          id: uuidv4(),
          studentId,
          vaccineName: vaccination.name,
          vaccineType: VaccineType.OTHER, // Default type, could be mapped better
          administeredDate: new Date(
            dateOfBirth.getTime() + requiredAgeMonths * 30 * 24 * 60 * 60 * 1000,
          ),
          dosage: faker.helpers.arrayElement(['0.5ml', '1.0ml', '0.25ml']),
          manufacturer: faker.helpers.arrayElement([
            'Pfizer',
            'Moderna',
            'Johnson & Johnson',
            'Merck',
            'GSK',
          ]),
          lotNumber: faker.string.alphanumeric(10).toUpperCase(),
          administeredBy: faker.person.fullName(),
          siteOfAdministration: faker.helpers.arrayElement([
            SiteOfAdministration.ARM_LEFT,
            SiteOfAdministration.ARM_RIGHT,
            SiteOfAdministration.THIGH_LEFT,
          ]),
          notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
          verified: true,
          active: true,
        });
      }
    });
  });

  return vaccinations;
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
      isActive: true,
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
        name: `${faker.location.cityName()} ${faker.helpers.arrayElement(['Elementary', 'Middle', 'High'])} School`,
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
        isActive: true,
      });
      schools.push(school);
    }
  }

  console.log(`✅ Created ${schools.length} schools`);
  return schools;
}

/**
 * Get existing nurses or create placeholder nurse users
 */
async function getNurses(): Promise<User[]> {
  console.log('Finding nurse users...');

  // Try to find existing nurse users
  let nurses = await User.findAll({
    where: {
      role: 'NURSE',
    },
    limit: 10,
  });

  // If no nurses found, look for any admin users as fallback
  if (nurses.length === 0) {
    nurses = await User.findAll({
      where: {
        role: 'ADMIN',
      },
      limit: 5,
    });
  }

  console.log(`✅ Found ${nurses.length} nurse/admin users`);
  return nurses;
}

/**
 * Create students with all related data
 */
async function createStudents(context: SeedingContext): Promise<Student[]> {
  console.log(`Creating ${STUDENT_COUNT} students with related data...`);
  const students = [];

  for (let i = 0; i < STUDENT_COUNT; i++) {
    const school = faker.helpers.arrayElement(context.schools);
    const district = context.districts.find((d) => d.id === school.districtId);
    const nurse = faker.helpers.arrayElement(context.nurses);

    try {
      // Create student
      const studentData = generateStudentData(school, district, nurse?.id);
      const student = await Student.create(studentData);
      students.push(student);

      // Create emergency contacts
      const emergencyContactCount = faker.number.int({
        min: MIN_EMERGENCY_CONTACTS,
        max: MAX_EMERGENCY_CONTACTS,
      });
      const emergencyContacts = generateEmergencyContacts(student.id, emergencyContactCount);
      await EmergencyContact.bulkCreate(emergencyContacts);

      // Create health records
      const healthRecordCount = faker.number.int({ min: 1, max: 5 });
      const healthRecords = generateHealthRecords(student.id, healthRecordCount);
      await HealthRecord.bulkCreate(healthRecords);

      // Create allergies (some students may have none)
      if (faker.datatype.boolean(0.4)) {
        // 40% of students have allergies
        const allergies = generateAllergies(student.id);
        if (allergies.length > 0) {
          await Allergy.bulkCreate(allergies);
        }
      }

      // Create vaccinations
      const vaccinations = generateVaccinations(student.id, new Date(student.dateOfBirth));
      if (vaccinations.length > 0) {
        await Vaccination.bulkCreate(vaccinations);
      }

      // Progress indicator
      if ((i + 1) % 25 === 0) {
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
async function seedComprehensiveStudents(): Promise<void> {
  console.log('🌱 Starting comprehensive student data seeding...\n');

  let app;
  try {
    // Initialize NestJS application
    app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn'],
    });

    // Get database connection
    const sequelize = app.get<Sequelize>(Sequelize);

    const context: SeedingContext = {
      sequelize,
      districts: [],
      schools: [],
      nurses: [],
      createdStudents: [],
    };

    // Set up transaction for data integrity
    const transaction = await sequelize.transaction();

    try {
      // Create base data
      context.districts = await createDistricts(context);
      context.schools = await createSchools(context);
      context.nurses = await getNurses();

      // Create students and related data
      context.createdStudents = await createStudents(context);

      // Commit transaction
      await transaction.commit();

      console.log('\n🎉 Comprehensive student seeding completed successfully!');
      console.log(`📊 Summary:`);
      console.log(`   Districts: ${context.districts.length}`);
      console.log(`   Schools: ${context.schools.length}`);
      console.log(`   Students: ${context.createdStudents.length}`);
      console.log(`   Estimated Emergency Contacts: ${context.createdStudents.length * 2}`);
      console.log(`   Estimated Health Records: ${context.createdStudents.length * 3}`);
      console.log(`   Estimated Vaccinations: ${context.createdStudents.length * 8}`);
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
  seedComprehensiveStudents()
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedComprehensiveStudents };
