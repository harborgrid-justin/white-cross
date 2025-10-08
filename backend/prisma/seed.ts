import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================================================
// HELPER FUNCTIONS FOR REALISTIC DATA GENERATION
// ============================================================================

const firstNames = {
  male: ['Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander', 'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Levi', 'Sebastian', 'Mateo', 'Jack', 'Owen', 'Theodore', 'Aiden', 'Samuel', 'Joseph', 'John', 'David', 'Wyatt', 'Matthew', 'Luke', 'Asher', 'Carter', 'Julian', 'Grayson', 'Leo', 'Jayden', 'Gabriel', 'Isaac', 'Lincoln', 'Anthony', 'Hudson', 'Dylan', 'Ezra', 'Thomas', 'Charles', 'Christopher', 'Jaxon', 'Maverick', 'Josiah'],
  female: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Evelyn', 'Harper', 'Luna', 'Camila', 'Gianna', 'Elizabeth', 'Eleanor', 'Ella', 'Abigail', 'Sofia', 'Avery', 'Scarlett', 'Emily', 'Aria', 'Penelope', 'Chloe', 'Layla', 'Mila', 'Nora', 'Hazel', 'Madison', 'Ellie', 'Lily', 'Nova', 'Isla', 'Grace', 'Violet', 'Aurora', 'Riley', 'Zoey', 'Willow', 'Emilia', 'Stella', 'Zoe', 'Victoria', 'Hannah', 'Addison', 'Leah', 'Lucy', 'Eliana', 'Ivy', 'Everly']
};

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

const streetNames = ['Main Street', 'Oak Avenue', 'Maple Drive', 'Pine Street', 'Elm Avenue', 'Cedar Lane', 'Washington Street', 'Park Avenue', 'Lincoln Drive', 'Jefferson Street', 'Roosevelt Avenue', 'Madison Lane', 'Highland Drive', 'Sunset Boulevard', 'River Road', 'Lake Street', 'Forest Avenue', 'Hill Street', 'Valley Drive', 'Mountain View', 'Spring Street', 'Summer Lane', 'Autumn Drive', 'Winter Avenue'];

const grades = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];

const genders = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];

const allergens = ['Peanuts', 'Tree nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish', 'Sesame', 'Penicillin', 'Sulfa drugs', 'Bee stings', 'Latex', 'Pollen'];

const chronicConditions = ['Asthma', 'Type 1 Diabetes', 'ADHD', 'Epilepsy', 'Celiac Disease', 'Eczema', 'Anxiety Disorder', 'Migraines', 'Scoliosis'];

const random = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

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

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('🌱 Starting comprehensive database seeding...\n');

  // ============================================================================
  // SECTION 1: DISTRICT AND SCHOOL
  // ============================================================================
  console.log('📍 Creating District and School...');

  const district = await prisma.district.upsert({
    where: { code: 'UNIFIED_DISTRICT' },
    update: {},
    create: {
      name: 'Unified School District',
      code: 'UNIFIED_DISTRICT',
      address: '1000 Education Boulevard',
      city: 'Demo City',
      state: 'CA',
      zipCode: '90210',
      phone: '(555) 100-1000',
      email: 'district@unifiedschools.edu',
      website: 'https://unifiedschools.edu',
    },
  });

  const school = await prisma.school.upsert({
    where: { code: 'CENTRAL_HIGH' },
    update: { studentCount: 500 },
    create: {
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
      districtId: district.id,
    },
  });

  console.log(`   ✓ Created district: ${district.name}`);
  console.log(`   ✓ Created school: ${school.name}\n`);

  // ============================================================================
  // SECTION 2: USERS AND ROLES
  // ============================================================================
  console.log('👥 Creating Users and Roles...');

  const defaultPassword = await bcrypt.hash('admin123', 10);
  const testNursePassword = await bcrypt.hash('NursePassword123!', 10);
  const testAdminPassword = await bcrypt.hash('AdminPassword123!', 10);
  const testReadOnlyPassword = await bcrypt.hash('ReadOnlyPassword123!', 10);
  const testCounselorPassword = await bcrypt.hash('CounselorPassword123!', 10);

  // Create Admin Users
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@whitecross.health' },
    update: {},
    create: {
      email: 'admin@whitecross.health',
      password: defaultPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const districtAdmin = await prisma.user.upsert({
    where: { email: 'district.admin@unifiedschools.edu' },
    update: {},
    create: {
      email: 'district.admin@unifiedschools.edu',
      password: defaultPassword,
      firstName: 'Robert',
      lastName: 'Morrison',
      role: 'DISTRICT_ADMIN',
      isActive: true,
    },
  });

  const schoolAdmin = await prisma.user.upsert({
    where: { email: 'school.admin@centralhigh.edu' },
    update: {},
    create: {
      email: 'school.admin@centralhigh.edu',
      password: defaultPassword,
      firstName: 'Patricia',
      lastName: 'Henderson',
      role: 'SCHOOL_ADMIN',
      isActive: true,
    },
  });

  // Create Nurse Users
  const headNurse = await prisma.user.upsert({
    where: { email: 'nurse@whitecross.health' },
    update: {},
    create: {
      email: 'nurse@whitecross.health',
      password: defaultPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'NURSE',
      isActive: true,
    },
  });

  const nurse2 = await prisma.user.upsert({
    where: { email: 'nurse2@centralhigh.edu' },
    update: {},
    create: {
      email: 'nurse2@centralhigh.edu',
      password: defaultPassword,
      firstName: 'Maria',
      lastName: 'Rodriguez',
      role: 'NURSE',
      isActive: true,
    },
  });

  // Create Counselor
  const counselor = await prisma.user.upsert({
    where: { email: 'counselor@centralhigh.edu' },
    update: {},
    create: {
      email: 'counselor@centralhigh.edu',
      password: defaultPassword,
      firstName: 'James',
      lastName: 'Mitchell',
      role: 'COUNSELOR',
      isActive: true,
    },
  });

  // Create Viewer
  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@centralhigh.edu' },
    update: {},
    create: {
      email: 'viewer@centralhigh.edu',
      password: defaultPassword,
      firstName: 'Linda',
      lastName: 'Davis',
      role: 'VIEWER',
      isActive: true,
    },
  });

  // Create Test Users (for Cypress)
  const testAdmin = await prisma.user.upsert({
    where: { email: 'admin@school.edu' },
    update: {},
    create: {
      email: 'admin@school.edu',
      password: testAdminPassword,
      firstName: 'Test',
      lastName: 'Admin',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const testNurse = await prisma.user.upsert({
    where: { email: 'nurse@school.edu' },
    update: {},
    create: {
      email: 'nurse@school.edu',
      password: testNursePassword,
      firstName: 'Test',
      lastName: 'Nurse',
      role: 'NURSE',
      isActive: true,
    },
  });

  const testReadOnly = await prisma.user.upsert({
    where: { email: 'readonly@school.edu' },
    update: {},
    create: {
      email: 'readonly@school.edu',
      password: testReadOnlyPassword,
      firstName: 'Test',
      lastName: 'ReadOnly',
      role: 'VIEWER',
      isActive: true,
    },
  });

  const testCounselor = await prisma.user.upsert({
    where: { email: 'counselor@school.edu' },
    update: {},
    create: {
      email: 'counselor@school.edu',
      password: testCounselorPassword,
      firstName: 'Test',
      lastName: 'Counselor',
      role: 'COUNSELOR',
      isActive: true,
    },
  });

  const nurses = [headNurse, nurse2, testNurse];

  console.log(`   ✓ Created ${10} users across all roles\n`);

  // ============================================================================
  // SECTION 3: PERMISSIONS AND ROLE ASSIGNMENTS
  // ============================================================================
  console.log('🔐 Setting up Permissions and Roles...');

  const permissions = [
    { resource: 'students', action: 'read' },
    { resource: 'students', action: 'create' },
    { resource: 'students', action: 'update' },
    { resource: 'students', action: 'delete' },
    { resource: 'medications', action: 'read' },
    { resource: 'medications', action: 'create' },
    { resource: 'medications', action: 'update' },
    { resource: 'medications', action: 'delete' },
    { resource: 'health_records', action: 'read' },
    { resource: 'health_records', action: 'create' },
    { resource: 'health_records', action: 'update' },
    { resource: 'health_records', action: 'delete' },
    { resource: 'incidents', action: 'read' },
    { resource: 'incidents', action: 'create' },
    { resource: 'incidents', action: 'update' },
    { resource: 'incidents', action: 'delete' },
    { resource: 'reports', action: 'read' },
    { resource: 'reports', action: 'create' },
    { resource: 'administration', action: 'read' },
    { resource: 'administration', action: 'create' },
    { resource: 'administration', action: 'update' },
    { resource: 'administration', action: 'delete' },
  ];

  const createdPermissions = await Promise.all(
    permissions.map((perm) =>
      prisma.permission.upsert({
        where: { resource_action: { resource: perm.resource, action: perm.action } },
        update: {},
        create: {
          resource: perm.resource,
          action: perm.action,
          description: `${perm.action.charAt(0).toUpperCase() + perm.action.slice(1)} ${perm.resource}`,
        },
      })
    )
  );

  // Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: {
      name: 'Administrator',
      description: 'Full system access',
      isSystem: true,
    },
  });

  const nurseRole = await prisma.role.upsert({
    where: { name: 'School Nurse' },
    update: {},
    create: {
      name: 'School Nurse',
      description: 'Standard nurse permissions',
      isSystem: true,
    },
  });

  const readOnlyRole = await prisma.role.upsert({
    where: { name: 'Read Only' },
    update: {},
    create: {
      name: 'Read Only',
      description: 'View-only access to records',
      isSystem: true,
    },
  });

  const counselorRole = await prisma.role.upsert({
    where: { name: 'School Counselor' },
    update: {},
    create: {
      name: 'School Counselor',
      description: 'Counselor access to student records',
      isSystem: true,
    },
  });

  // Assign Permissions to Roles
  await Promise.all(
    createdPermissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id } },
        update: {},
        create: { roleId: adminRole.id, permissionId: permission.id },
      })
    )
  );

  const nursePermissions = createdPermissions.filter(
    (p) => !p.resource.includes('administration') && p.action !== 'delete'
  );
  await Promise.all(
    nursePermissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: nurseRole.id, permissionId: permission.id } },
        update: {},
        create: { roleId: nurseRole.id, permissionId: permission.id },
      })
    )
  );

  const readOnlyPermissions = createdPermissions.filter((p) => p.action === 'read');
  await Promise.all(
    readOnlyPermissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: readOnlyRole.id, permissionId: permission.id } },
        update: {},
        create: { roleId: readOnlyRole.id, permissionId: permission.id },
      })
    )
  );

  const counselorPermissions = createdPermissions.filter(
    (p) => (p.resource === 'students' || p.resource === 'health_records') && p.action !== 'delete'
  );
  await Promise.all(
    counselorPermissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: counselorRole.id, permissionId: permission.id } },
        update: {},
        create: { roleId: counselorRole.id, permissionId: permission.id },
      })
    )
  );

  // Assign Roles to Users
  const userRoleAssignments = [
    { userId: superAdmin.id, roleId: adminRole.id },
    { userId: districtAdmin.id, roleId: adminRole.id },
    { userId: schoolAdmin.id, roleId: adminRole.id },
    { userId: testAdmin.id, roleId: adminRole.id },
    { userId: headNurse.id, roleId: nurseRole.id },
    { userId: nurse2.id, roleId: nurseRole.id },
    { userId: testNurse.id, roleId: nurseRole.id },
    { userId: counselor.id, roleId: counselorRole.id },
    { userId: testCounselor.id, roleId: counselorRole.id },
    { userId: viewer.id, roleId: readOnlyRole.id },
    { userId: testReadOnly.id, roleId: readOnlyRole.id },
  ];

  await Promise.all(
    userRoleAssignments.map((assignment) =>
      prisma.userRoleAssignment.upsert({
        where: { userId_roleId: { userId: assignment.userId, roleId: assignment.roleId } },
        update: {},
        create: assignment,
      })
    )
  );

  console.log(`   ✓ Created ${createdPermissions.length} permissions`);
  console.log(`   ✓ Created 4 roles with appropriate permissions\n`);

  // ============================================================================
  // SECTION 4: MEDICATIONS
  // ============================================================================
  console.log('💊 Creating Medications and Inventory...');

  const medicationsData = [
    { name: 'Albuterol Inhaler', genericName: 'Albuterol Sulfate', dosageForm: 'Inhaler', strength: '90 mcg/dose', manufacturer: 'ProAir', ndc: '12345-678-90', isControlled: false },
    { name: 'EpiPen', genericName: 'Epinephrine', dosageForm: 'Auto-injector', strength: '0.3 mg', manufacturer: 'Mylan', ndc: '23456-789-01', isControlled: false },
    { name: 'Tylenol', genericName: 'Acetaminophen', dosageForm: 'Tablet', strength: '325 mg', manufacturer: 'Johnson & Johnson', ndc: '34567-890-12', isControlled: false },
    { name: 'Aspirin', genericName: 'Acetylsalicylic acid', dosageForm: 'Tablet', strength: '325 mg', manufacturer: 'Bayer', ndc: '45678-901-23', isControlled: false },
    { name: 'Methylphenidate', genericName: 'Methylphenidate HCl', dosageForm: 'Tablet', strength: '10 mg', manufacturer: 'Novartis', ndc: '56789-012-34', isControlled: true },
    { name: 'Adderall', genericName: 'Amphetamine/Dextroamphetamine', dosageForm: 'Tablet', strength: '10 mg', manufacturer: 'Teva', ndc: '67890-123-45', isControlled: true },
    { name: 'Ibuprofen', genericName: 'Ibuprofen', dosageForm: 'Tablet', strength: '200 mg', manufacturer: 'Advil', ndc: '78901-234-56', isControlled: false },
    { name: 'Benadryl', genericName: 'Diphenhydramine', dosageForm: 'Capsule', strength: '25 mg', manufacturer: 'Johnson & Johnson', ndc: '89012-345-67', isControlled: false },
    { name: 'Insulin', genericName: 'Insulin Human', dosageForm: 'Injection', strength: '100 units/mL', manufacturer: 'Novo Nordisk', ndc: '90123-456-78', isControlled: false },
    { name: 'Amoxicillin', genericName: 'Amoxicillin', dosageForm: 'Capsule', strength: '500 mg', manufacturer: 'Generic', ndc: '01234-567-89', isControlled: false },
    { name: 'Zoloft', genericName: 'Sertraline', dosageForm: 'Tablet', strength: '50 mg', manufacturer: 'Pfizer', ndc: '11234-567-90', isControlled: false },
    { name: 'Concerta', genericName: 'Methylphenidate ER', dosageForm: 'Extended Release', strength: '18 mg', manufacturer: 'Janssen', ndc: '21234-567-91', isControlled: true },
  ];

  const medications = await Promise.all(
    medicationsData.map((med) =>
      prisma.medication.upsert({
        where: { ndc: med.ndc },
        update: {},
        create: med,
      })
    )
  );

  // Create inventory for each medication
  await Promise.all(
    medications.map((medication) =>
      prisma.medicationInventory.create({
        data: {
          medicationId: medication.id,
          batchNumber: `BATCH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          quantity: randomInt(20, 100),
          reorderLevel: 10,
          costPerUnit: randomInt(5, 50),
          supplier: 'Medical Supply Co.',
        },
      })
    )
  );

  console.log(`   ✓ Created ${medications.length} medications with inventory\n`);

  // ============================================================================
  // SECTION 5: STUDENTS (500 students)
  // ============================================================================
  console.log('👨‍🎓 Creating 500 Students (this may take a moment)...');

  const students = [];
  const batchSize = 50;

  for (let batch = 0; batch < 10; batch++) {
    const batchStudents = [];

    for (let i = 0; i < batchSize; i++) {
      const studentIndex = batch * batchSize + i + 1;
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

      batchStudents.push({
        studentNumber: `STU${String(studentIndex).padStart(5, '0')}`,
        firstName,
        lastName,
        dateOfBirth,
        grade,
        gender: gender as any,
        medicalRecordNum: `MR${String(studentIndex).padStart(5, '0')}`,
        nurseId: random(nurses).id,
        enrollmentDate: randomDate(new Date(2020, 0, 1), new Date()),
      });
    }

    const createdBatch = await Promise.all(
      batchStudents.map((student) =>
        prisma.student.upsert({
          where: { studentNumber: student.studentNumber },
          update: {},
          create: student,
        })
      )
    );

    students.push(...createdBatch);
    console.log(`   ✓ Created batch ${batch + 1}/10 (${students.length} students so far)`);
  }

  console.log(`   ✓ Successfully created all ${students.length} students\n`);

  // ============================================================================
  // SECTION 6: EMERGENCY CONTACTS
  // ============================================================================
  console.log('📞 Creating Emergency Contacts...');

  let contactsCreated = 0;
  for (let i = 0; i < students.length; i += 50) {
    const batch = students.slice(i, i + 50);

    await Promise.all(
      batch.flatMap((student) => {
        const contacts = [];
        const parentLastName = student.lastName;

        // Primary contact (usually mother)
        contacts.push(
          prisma.emergencyContact.create({
            data: {
              firstName: random(firstNames.female),
              lastName: parentLastName,
              relationship: 'Mother',
              phoneNumber: generatePhoneNumber(),
              email: generateEmail(random(firstNames.female), parentLastName),
              address: generateAddress(),
              priority: 'PRIMARY',
              studentId: student.id,
            },
          })
        );

        // Secondary contact (usually father)
        contacts.push(
          prisma.emergencyContact.create({
            data: {
              firstName: random(firstNames.male),
              lastName: parentLastName,
              relationship: 'Father',
              phoneNumber: generatePhoneNumber(),
              email: generateEmail(random(firstNames.male), parentLastName),
              address: generateAddress(),
              priority: 'SECONDARY',
              studentId: student.id,
            },
          })
        );

        return contacts;
      })
    );

    contactsCreated += batch.length * 2;
    console.log(`   ✓ Created emergency contacts for ${contactsCreated / 2} students`);
  }

  console.log(`   ✓ Created ${contactsCreated} total emergency contacts\n`);

  // ============================================================================
  // SECTION 7: HEALTH RECORDS
  // ============================================================================
  console.log('🏥 Creating Health Records...');

  const healthRecordTypes = ['CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM'];
  let healthRecordsCreated = 0;

  for (let i = 0; i < students.length; i += 100) {
    const batch = students.slice(i, i + 100);

    await Promise.all(
      batch.flatMap((student) => {
        // Each student gets 1-3 health records
        const recordCount = randomInt(1, 3);
        return Array.from({ length: recordCount }, () =>
          prisma.healthRecord.create({
            data: {
              studentId: student.id,
              type: random(healthRecordTypes) as any,
              date: randomDate(student.enrollmentDate, new Date()),
              description: `Routine ${random(healthRecordTypes).toLowerCase()} visit`,
              notes: 'No abnormalities noted. Student in good health.',
              attachments: [],
            },
          })
        );
      })
    );

    healthRecordsCreated += batch.length * 2; // Average
    console.log(`   ✓ Created health records for ${i + batch.length} students`);
  }

  console.log(`   ✓ Created approximately ${healthRecordsCreated} health records\n`);

  // ============================================================================
  // SECTION 8: ALLERGIES AND CHRONIC CONDITIONS
  // ============================================================================
  console.log('⚠️  Creating Allergies and Chronic Conditions...');

  let allergiesCreated = 0;
  let conditionsCreated = 0;

  // About 20% of students have allergies
  const studentsWithAllergies = students.filter(() => Math.random() < 0.2);

  for (let i = 0; i < studentsWithAllergies.length; i += 50) {
    const batch = studentsWithAllergies.slice(i, i + 50);

    await Promise.all(
      batch.map((student) =>
        prisma.allergy.create({
          data: {
            studentId: student.id,
            allergen: random(allergens),
            severity: random(['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING']) as any,
            reaction: 'Allergic reaction symptoms',
            treatment: 'Standard allergy protocol',
            verified: true,
            verifiedBy: random(nurses).firstName + ' ' + random(nurses).lastName,
            verifiedAt: new Date(),
          },
        })
      )
    );

    allergiesCreated += batch.length;
  }

  // About 10% of students have chronic conditions
  const studentsWithConditions = students.filter(() => Math.random() < 0.1);

  for (let i = 0; i < studentsWithConditions.length; i += 50) {
    const batch = studentsWithConditions.slice(i, i + 50);

    await Promise.all(
      batch.map((student) =>
        prisma.chronicCondition.create({
          data: {
            studentId: student.id,
            condition: random(chronicConditions),
            diagnosedDate: randomDate(student.dateOfBirth, new Date()),
            status: 'ACTIVE',
            severity: random(['MILD', 'MODERATE', 'SEVERE']),
            notes: 'Condition is being monitored regularly',
            medications: [],
            restrictions: [],
            triggers: [],
          },
        })
      )
    );

    conditionsCreated += batch.length;
  }

  console.log(`   ✓ Created ${allergiesCreated} allergies`);
  console.log(`   ✓ Created ${conditionsCreated} chronic conditions\n`);

  // ============================================================================
  // SECTION 9: APPOINTMENTS
  // ============================================================================
  console.log('📅 Creating Appointments...');

  const appointmentTypes = ['ROUTINE_CHECKUP', 'MEDICATION_ADMINISTRATION', 'INJURY_ASSESSMENT', 'ILLNESS_EVALUATION', 'FOLLOW_UP'];
  let appointmentsCreated = 0;

  // Create appointments for random students
  const studentsForAppointments = students.filter(() => Math.random() < 0.15); // 15% get appointments

  for (let i = 0; i < studentsForAppointments.length; i += 50) {
    const batch = studentsForAppointments.slice(i, i + 50);

    await Promise.all(
      batch.map((student) => {
        const scheduledAt = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));
        const isPast = scheduledAt < new Date();

        return prisma.appointment.create({
          data: {
            studentId: student.id,
            nurseId: random(nurses).id,
            type: random(appointmentTypes) as any,
            scheduledAt,
            duration: 30,
            status: isPast ? (Math.random() < 0.9 ? 'COMPLETED' : 'NO_SHOW') : 'SCHEDULED',
            reason: `${random(appointmentTypes).replace(/_/g, ' ').toLowerCase()} appointment`,
            notes: isPast ? 'Appointment completed successfully' : undefined,
          },
        });
      })
    );

    appointmentsCreated += batch.length;
  }

  console.log(`   ✓ Created ${appointmentsCreated} appointments\n`);

  // ============================================================================
  // SECTION 10: INCIDENT REPORTS
  // ============================================================================
  console.log('📋 Creating Incident Reports...');

  const incidentTypes = ['INJURY', 'ILLNESS', 'BEHAVIORAL', 'ALLERGIC_REACTION', 'EMERGENCY'];
  const incidentSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  let incidentsCreated = 0;

  // About 5% of students have incident reports
  const studentsWithIncidents = students.filter(() => Math.random() < 0.05);

  for (let i = 0; i < studentsWithIncidents.length; i += 25) {
    const batch = studentsWithIncidents.slice(i, i + 25);

    await Promise.all(
      batch.map((student) => {
        const occurredAt = randomDate(student.enrollmentDate, new Date());

        return prisma.incidentReport.create({
          data: {
            studentId: student.id,
            reportedById: random(nurses).id,
            type: random(incidentTypes) as any,
            severity: random(incidentSeverities) as any,
            description: `Incident involving ${student.firstName} ${student.lastName}`,
            location: random(['Classroom', 'Gymnasium', 'Cafeteria', 'Playground', 'Hallway', 'Nurse Office']),
            witnesses: [`${random(firstNames.male)} ${random(lastNames)}`, `${random(firstNames.female)} ${random(lastNames)}`],
            actionsTaken: 'First aid administered, parents notified',
            parentNotified: true,
            parentNotificationMethod: random(['Phone', 'Email', 'In Person']),
            parentNotifiedAt: new Date(occurredAt.getTime() + 60 * 60 * 1000),
            parentNotifiedBy: random(nurses).firstName,
            followUpRequired: Math.random() < 0.3,
            occurredAt,
            attachments: [],
            evidencePhotos: [],
            evidenceVideos: [],
          },
        });
      })
    );

    incidentsCreated += batch.length;
  }

  console.log(`   ✓ Created ${incidentsCreated} incident reports\n`);

  // ============================================================================
  // SECTION 11: NURSE AVAILABILITY
  // ============================================================================
  console.log('⏰ Setting up Nurse Availability...');

  const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
  await Promise.all(
    nurses.flatMap((nurse) =>
      daysOfWeek.map((day) =>
        prisma.nurseAvailability.create({
          data: {
            nurseId: nurse.id,
            dayOfWeek: day,
            startTime: '08:00',
            endTime: '16:00',
            isRecurring: true,
            isAvailable: true,
          },
        })
      )
    )
  );

  console.log(`   ✓ Created availability schedules for ${nurses.length} nurses\n`);

  // ============================================================================
  // SECTION 12: SYSTEM CONFIGURATIONS
  // ============================================================================
  console.log('⚙️  Creating System Configurations...');

  const configs = [
    { key: 'app_name', value: 'White Cross', category: 'GENERAL', description: 'Application name', isPublic: true },
    { key: 'max_login_attempts', value: '5', category: 'SECURITY', description: 'Maximum login attempts before account lockout', isPublic: false },
    { key: 'session_timeout', value: '3600', category: 'SECURITY', description: 'Session timeout in seconds', isPublic: false },
    { key: 'password_expiry_days', value: '90', category: 'SECURITY', description: 'Days before password expires', isPublic: false },
    { key: 'email_notifications_enabled', value: 'true', category: 'NOTIFICATION', description: 'Enable email notifications', isPublic: false },
    { key: 'sms_notifications_enabled', value: 'true', category: 'NOTIFICATION', description: 'Enable SMS notifications', isPublic: false },
    { key: 'backup_frequency_hours', value: '24', category: 'BACKUP', description: 'Backup frequency in hours', isPublic: false },
    { key: 'max_file_upload_mb', value: '10', category: 'GENERAL', description: 'Maximum file upload size in MB', isPublic: true },
  ];

  await Promise.all(
    configs.map((config) =>
      prisma.systemConfiguration.upsert({
        where: { key: config.key },
        update: {},
        create: config as any,
      })
    )
  );

  console.log(`   ✓ Created ${configs.length} system configurations\n`);

  // ============================================================================
  // COMPLETION SUMMARY
  // ============================================================================
  console.log('✅ Database seeding completed successfully!\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📊 SEEDING SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n🏢 ORGANIZATION:');
  console.log(`   • District: ${district.name}`);
  console.log(`   • School: ${school.name} (${school.studentCount} students)`);

  console.log('\n👥 USERS (10 total):');
  console.log(`   • Admins: 4 (Super Admin, District Admin, School Admin, Test Admin)`);
  console.log(`   • Nurses: 3 (Head Nurse, Nurse 2, Test Nurse)`);
  console.log(`   • Counselors: 2 (Counselor, Test Counselor)`);
  console.log(`   • Viewers: 2 (Viewer, Test ReadOnly)`);

  console.log('\n👨‍🎓 STUDENTS:');
  console.log(`   • Total: ${students.length} students`);
  console.log(`   • Emergency Contacts: ${contactsCreated} (2 per student)`);
  console.log(`   • Health Records: ~${healthRecordsCreated}`);
  console.log(`   • Allergies: ${allergiesCreated}`);
  console.log(`   • Chronic Conditions: ${conditionsCreated}`);
  console.log(`   • Appointments: ${appointmentsCreated}`);
  console.log(`   • Incident Reports: ${incidentsCreated}`);

  console.log('\n💊 MEDICATIONS:');
  console.log(`   • Medications: ${medications.length}`);
  console.log(`   • Inventory Items: ${medications.length}`);

  console.log('\n🔐 SECURITY:');
  console.log(`   • Permissions: ${createdPermissions.length}`);
  console.log(`   • Roles: 4 (Administrator, School Nurse, School Counselor, Read Only)`);
  console.log(`   • Role Assignments: ${userRoleAssignments.length}`);

  console.log('\n⚙️  SYSTEM:');
  console.log(`   • Configurations: ${configs.length}`);
  console.log(`   • Nurse Availability Records: ${nurses.length * 5}`);

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🔐 LOGIN CREDENTIALS');
  console.log('═══════════════════════════════════════════════════════════════');

  console.log('\n🎯 PRODUCTION ACCOUNTS:');
  console.log('   Super Admin:');
  console.log('   └─ Email: admin@whitecross.health');
  console.log('   └─ Password: admin123');
  console.log('   └─ Role: ADMIN');

  console.log('\n   Head Nurse:');
  console.log('   └─ Email: nurse@whitecross.health');
  console.log('   └─ Password: admin123');
  console.log('   └─ Role: NURSE');

  console.log('\n   District Admin:');
  console.log('   └─ Email: district.admin@unifiedschools.edu');
  console.log('   └─ Password: admin123');
  console.log('   └─ Role: DISTRICT_ADMIN');

  console.log('\n   School Admin:');
  console.log('   └─ Email: school.admin@centralhigh.edu');
  console.log('   └─ Password: admin123');
  console.log('   └─ Role: SCHOOL_ADMIN');

  console.log('\n   Counselor:');
  console.log('   └─ Email: counselor@centralhigh.edu');
  console.log('   └─ Password: admin123');
  console.log('   └─ Role: COUNSELOR');

  console.log('\n   Viewer:');
  console.log('   └─ Email: viewer@centralhigh.edu');
  console.log('   └─ Password: admin123');
  console.log('   └─ Role: VIEWER');

  console.log('\n🧪 TEST ACCOUNTS (for Cypress E2E):');
  console.log('   Test Admin:');
  console.log('   └─ Email: admin@school.edu');
  console.log('   └─ Password: AdminPassword123!');

  console.log('\n   Test Nurse:');
  console.log('   └─ Email: nurse@school.edu');
  console.log('   └─ Password: NursePassword123!');

  console.log('\n   Test ReadOnly:');
  console.log('   └─ Email: readonly@school.edu');
  console.log('   └─ Password: ReadOnlyPassword123!');

  console.log('\n   Test Counselor:');
  console.log('   └─ Email: counselor@school.edu');
  console.log('   └─ Password: CounselorPassword123!');

  console.log('\n═══════════════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
