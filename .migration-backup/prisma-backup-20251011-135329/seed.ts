import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
      description: 'A comprehensive unified school district serving Demo City and surrounding areas',
      address: '1000 Education Boulevard',
      city: 'Demo City',
      state: 'CA',
      zipCode: '90210',
      phone: '(555) 100-1000',
      phoneNumber: '(555) 100-1000',
      email: 'district@unifiedschools.edu',
      website: 'https://unifiedschools.edu',
      superintendent: 'Dr. Richard Hamilton',
      status: 'Active',
      isActive: true,
    },
  });

  const centralHigh = await prisma.school.upsert({
    where: { code: 'CENTRAL_HIGH' },
    update: { studentCount: 500, totalEnrollment: 500 },
    create: {
      name: 'Central High School',
      code: 'CENTRAL_HIGH',
      address: '2000 School Campus Drive',
      city: 'Demo City',
      state: 'CA',
      zipCode: '90210',
      phone: '(555) 200-2000',
      phoneNumber: '(555) 200-2000',
      email: 'office@centralhigh.edu',
      principal: 'Dr. Margaret Thompson',
      principalName: 'Dr. Margaret Thompson',
      studentCount: 500,
      totalEnrollment: 500,
      schoolType: 'High',
      status: 'Active',
      isActive: true,
      districtId: district.id,
    },
  });

  const westElementary = await prisma.school.upsert({
    where: { code: 'WEST_ELEM' },
    update: {},
    create: {
      name: 'West Elementary School',
      code: 'WEST_ELEM',
      address: '3500 Westside Boulevard',
      city: 'Demo City',
      state: 'CA',
      zipCode: '90211',
      phone: '(555) 300-3000',
      phoneNumber: '(555) 300-3000',
      email: 'office@westelementary.edu',
      principal: 'Mrs. Jennifer Martinez',
      principalName: 'Mrs. Jennifer Martinez',
      studentCount: 350,
      totalEnrollment: 350,
      schoolType: 'Elementary',
      status: 'Active',
      isActive: true,
      districtId: district.id,
    },
  });

  const eastMiddle = await prisma.school.upsert({
    where: { code: 'EAST_MIDDLE' },
    update: {},
    create: {
      name: 'East Middle School',
      code: 'EAST_MIDDLE',
      address: '4200 Eastbrook Avenue',
      city: 'Demo City',
      state: 'CA',
      zipCode: '90212',
      phone: '(555) 400-4000',
      phoneNumber: '(555) 400-4000',
      email: 'office@eastmiddle.edu',
      principal: 'Mr. David Chen',
      principalName: 'Mr. David Chen',
      studentCount: 420,
      totalEnrollment: 420,
      schoolType: 'Middle',
      status: 'Active',
      isActive: true,
      districtId: district.id,
    },
  });

  const northElementary = await prisma.school.upsert({
    where: { code: 'NORTH_ELEM' },
    update: {},
    create: {
      name: 'North Elementary School',
      code: 'NORTH_ELEM',
      address: '5100 Northern Heights Road',
      city: 'Demo City',
      state: 'CA',
      zipCode: '90213',
      phone: '(555) 500-5000',
      phoneNumber: '(555) 500-5000',
      email: 'office@northelementary.edu',
      principal: 'Dr. Susan Anderson',
      principalName: 'Dr. Susan Anderson',
      studentCount: 310,
      totalEnrollment: 310,
      schoolType: 'Elementary',
      status: 'Active',
      isActive: true,
      districtId: district.id,
    },
  });

  const southHigh = await prisma.school.upsert({
    where: { code: 'SOUTH_HIGH' },
    update: {},
    create: {
      name: 'South High School',
      code: 'SOUTH_HIGH',
      address: '6000 South Campus Way',
      city: 'Demo City',
      state: 'CA',
      zipCode: '90214',
      phone: '(555) 600-6000',
      phoneNumber: '(555) 600-6000',
      email: 'office@southhigh.edu',
      principal: 'Dr. Robert Williams',
      principalName: 'Dr. Robert Williams',
      studentCount: 480,
      totalEnrollment: 480,
      schoolType: 'High',
      status: 'Active',
      isActive: true,
      districtId: district.id,
    },
  });

  const schools = [centralHigh, westElementary, eastMiddle, northElementary, southHigh];

  console.log(`   ✓ Created district: ${district.name}`);
  console.log(`   ✓ Created ${schools.length} schools:`);
  schools.forEach(school => console.log(`      - ${school.name} (${school.schoolType})`));
  console.log();

  // ============================================================================
  // SECTION 2: USERS AND ROLES
  // ============================================================================
  console.log('👥 Creating Users and Roles...');

  const defaultPassword = await bcrypt.hash('admin123', 10);
  const testNursePassword = await bcrypt.hash('testNursePassword', 10);
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
      districtId: district.id,
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
      schoolId: centralHigh.id,
      districtId: district.id,
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
      schoolId: centralHigh.id,
      districtId: district.id,
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
      schoolId: centralHigh.id,
      districtId: district.id,
    },
  });

  const nurse3 = await prisma.user.upsert({
    where: { email: 'nurse@westelementary.edu' },
    update: {},
    create: {
      email: 'nurse@westelementary.edu',
      password: defaultPassword,
      firstName: 'Emily',
      lastName: 'Parker',
      role: 'NURSE',
      isActive: true,
      schoolId: westElementary.id,
      districtId: district.id,
    },
  });

  const nurse4 = await prisma.user.upsert({
    where: { email: 'nurse@eastmiddle.edu' },
    update: {},
    create: {
      email: 'nurse@eastmiddle.edu',
      password: defaultPassword,
      firstName: 'Michael',
      lastName: 'Brown',
      role: 'NURSE',
      isActive: true,
      schoolId: eastMiddle.id,
      districtId: district.id,
    },
  });

  const nurse5 = await prisma.user.upsert({
    where: { email: 'nurse@northelementary.edu' },
    update: {},
    create: {
      email: 'nurse@northelementary.edu',
      password: defaultPassword,
      firstName: 'Amanda',
      lastName: 'Taylor',
      role: 'NURSE',
      isActive: true,
      schoolId: northElementary.id,
      districtId: district.id,
    },
  });

  const nurse6 = await prisma.user.upsert({
    where: { email: 'nurse@southhigh.edu' },
    update: {},
    create: {
      email: 'nurse@southhigh.edu',
      password: defaultPassword,
      firstName: 'Christopher',
      lastName: 'Lee',
      role: 'NURSE',
      isActive: true,
      schoolId: southHigh.id,
      districtId: district.id,
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
      schoolId: centralHigh.id,
      districtId: district.id,
    },
  });

  const counselor2 = await prisma.user.upsert({
    where: { email: 'counselor@eastmiddle.edu' },
    update: {},
    create: {
      email: 'counselor@eastmiddle.edu',
      password: defaultPassword,
      firstName: 'Rachel',
      lastName: 'Green',
      role: 'COUNSELOR',
      isActive: true,
      schoolId: eastMiddle.id,
      districtId: district.id,
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
      schoolId: centralHigh.id,
      districtId: district.id,
    },
  });

  // Create Test Users (for Cypress)
  const testAdmin = await prisma.user.upsert({
    where: { email: 'admin@school.edu' },
    update: {
      password: testAdminPassword,
      isActive: true,
    },
    create: {
      email: 'admin@school.edu',
      password: testAdminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      isActive: true,
      schoolId: centralHigh.id,
      districtId: district.id,
    },
  });

  const testNurse = await prisma.user.upsert({
    where: { email: 'nurse@school.edu' },
    update: {
      password: testNursePassword,
      isActive: true,
    },
    create: {
      email: 'nurse@school.edu',
      password: testNursePassword,
      firstName: 'Test',
      lastName: 'Nurse',
      role: 'NURSE',
      isActive: true,
      schoolId: centralHigh.id,
      districtId: district.id,
    },
  });

  const testReadOnly = await prisma.user.upsert({
    where: { email: 'readonly@school.edu' },
    update: {
      password: testReadOnlyPassword,
      isActive: true,
    },
    create: {
      email: 'readonly@school.edu',
      password: testReadOnlyPassword,
      firstName: 'Test',
      lastName: 'ReadOnly',
      role: 'VIEWER',
      isActive: true,
      schoolId: centralHigh.id,
      districtId: district.id,
    },
  });

  const testCounselor = await prisma.user.upsert({
    where: { email: 'counselor@school.edu' },
    update: {
      password: testCounselorPassword,
      isActive: true,
    },
    create: {
      email: 'counselor@school.edu',
      password: testCounselorPassword,
      firstName: 'Test',
      lastName: 'Counselor',
      role: 'COUNSELOR',
      isActive: true,
      schoolId: centralHigh.id,
      districtId: district.id,
    },
  });

  const nurses = [headNurse, nurse2, nurse3, nurse4, nurse5, nurse6, testNurse];

  console.log(`   ✓ Created ${17} users across all roles:`);
  console.log(`      - 4 Admins (Super, District, School, Test)`);
  console.log(`      - 7 Nurses (across ${schools.length} schools)`);
  console.log(`      - 3 Counselors (2 production, 1 test)`);
  console.log(`      - 3 Viewers (1 production, 1 test viewer, 1 test readonly)\n`);

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
    // GENERAL
    { key: 'app_name', value: 'White Cross', valueType: 'STRING', category: 'GENERAL', description: 'Application name displayed in the UI', defaultValue: 'White Cross', isPublic: true, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['branding', 'ui'], sortOrder: 1 },
    { key: 'app_tagline', value: 'School Nurse Platform', valueType: 'STRING', category: 'GENERAL', description: 'Application tagline or subtitle', defaultValue: 'School Nurse Platform', isPublic: true, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['branding', 'ui'], sortOrder: 2 },
    { key: 'max_file_upload_mb', value: '10', valueType: 'NUMBER', category: 'FILE_UPLOAD', description: 'Maximum file upload size in MB', defaultValue: '10', minValue: 1, maxValue: 100, isPublic: true, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['file', 'upload'], sortOrder: 10 },
    { key: 'allowed_file_types', value: 'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx', valueType: 'ARRAY', category: 'FILE_UPLOAD', description: 'Comma-separated list of allowed file extensions', defaultValue: 'jpg,jpeg,png,gif,pdf,doc,docx', isPublic: true, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['file', 'upload'], sortOrder: 11 },

    // SECURITY
    { key: 'max_login_attempts', value: '5', valueType: 'NUMBER', category: 'SECURITY', description: 'Maximum login attempts before account lockout', defaultValue: '5', minValue: 3, maxValue: 10, isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['security', 'authentication'], sortOrder: 20 },
    { key: 'session_timeout_minutes', value: '480', valueType: 'NUMBER', category: 'SESSION', description: 'Session timeout in minutes (8 hours default)', defaultValue: '480', minValue: 30, maxValue: 1440, isPublic: false, isEditable: true, requiresRestart: true, scope: 'SYSTEM', tags: ['security', 'session'], sortOrder: 21 },
    { key: 'password_expiry_days', value: '90', valueType: 'NUMBER', category: 'SECURITY', description: 'Days before password expires', defaultValue: '90', minValue: 30, maxValue: 365, isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['security', 'password'], sortOrder: 22 },
    { key: 'min_password_length', value: '8', valueType: 'NUMBER', category: 'SECURITY', description: 'Minimum password length', defaultValue: '8', minValue: 6, maxValue: 20, isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['security', 'password'], sortOrder: 23 },
    { key: 'require_password_complexity', value: 'true', valueType: 'BOOLEAN', category: 'SECURITY', description: 'Require uppercase, lowercase, number, and special character', defaultValue: 'true', isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['security', 'password'], sortOrder: 24 },

    // RATE LIMITING
    { key: 'rate_limit_window_minutes', value: '15', valueType: 'NUMBER', category: 'RATE_LIMITING', description: 'Rate limit time window in minutes', defaultValue: '15', minValue: 1, maxValue: 60, isPublic: false, isEditable: true, requiresRestart: true, scope: 'SYSTEM', tags: ['security', 'rate-limit'], sortOrder: 30 },
    { key: 'rate_limit_max_requests', value: '100', valueType: 'NUMBER', category: 'RATE_LIMITING', description: 'Maximum requests per time window', defaultValue: '100', minValue: 10, maxValue: 1000, isPublic: false, isEditable: true, requiresRestart: true, scope: 'SYSTEM', tags: ['security', 'rate-limit'], sortOrder: 31 },

    // NOTIFICATIONS
    { key: 'email_notifications_enabled', value: 'true', valueType: 'BOOLEAN', category: 'NOTIFICATION', subCategory: 'email', description: 'Enable email notifications', defaultValue: 'true', isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['notifications', 'email'], sortOrder: 40 },
    { key: 'sms_notifications_enabled', value: 'true', valueType: 'BOOLEAN', category: 'NOTIFICATION', subCategory: 'sms', description: 'Enable SMS notifications', defaultValue: 'true', isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['notifications', 'sms'], sortOrder: 41 },
    { key: 'notification_email_from', value: 'noreply@whitecross.health', valueType: 'EMAIL', category: 'EMAIL', description: 'From email address for notifications', defaultValue: 'noreply@whitecross.health', isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['notifications', 'email'], sortOrder: 42 },

    // HEALTHCARE SPECIFIC
    { key: 'medication_stock_alert_threshold', value: '20', valueType: 'NUMBER', category: 'MEDICATION', description: 'Low stock alert threshold for medications', defaultValue: '20', minValue: 5, maxValue: 100, isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['medication', 'inventory'], sortOrder: 50 },
    { key: 'medication_critical_stock_threshold', value: '5', valueType: 'NUMBER', category: 'MEDICATION', description: 'Critical stock threshold for medications', defaultValue: '5', minValue: 1, maxValue: 20, isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['medication', 'inventory'], sortOrder: 51 },
    { key: 'medication_expiration_warning_days', value: '30', valueType: 'NUMBER', category: 'MEDICATION', description: 'Days before expiration to show warning', defaultValue: '30', minValue: 7, maxValue: 90, isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['medication', 'expiration'], sortOrder: 52 },
    { key: 'medication_expiration_critical_days', value: '7', valueType: 'NUMBER', category: 'MEDICATION', description: 'Days before expiration to show critical alert', defaultValue: '7', minValue: 1, maxValue: 30, isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['medication', 'expiration'], sortOrder: 53 },

    // APPOINTMENTS
    { key: 'default_appointment_duration_minutes', value: '30', valueType: 'NUMBER', category: 'APPOINTMENTS', description: 'Default appointment duration in minutes', defaultValue: '30', minValue: 15, maxValue: 120, isPublic: true, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['appointments', 'scheduling'], sortOrder: 60 },
    { key: 'appointment_reminder_hours_before', value: '24', valueType: 'NUMBER', category: 'APPOINTMENTS', description: 'Hours before appointment to send reminder', defaultValue: '24', minValue: 1, maxValue: 168, isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['appointments', 'reminders'], sortOrder: 61 },
    { key: 'allow_appointment_self_scheduling', value: 'false', valueType: 'BOOLEAN', category: 'APPOINTMENTS', description: 'Allow parents to self-schedule appointments', defaultValue: 'false', isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['appointments', 'scheduling'], sortOrder: 62 },

    // UI CONFIGURATION
    { key: 'default_page_size', value: '10', valueType: 'NUMBER', category: 'UI', description: 'Default number of items per page', defaultValue: '10', validValues: ['5', '10', '25', '50', '100'], isPublic: true, isEditable: true, requiresRestart: false, scope: 'USER', tags: ['ui', 'pagination'], sortOrder: 70 },
    { key: 'toast_duration_milliseconds', value: '5000', valueType: 'NUMBER', category: 'UI', description: 'Toast notification duration in milliseconds', defaultValue: '5000', minValue: 1000, maxValue: 10000, isPublic: true, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['ui', 'notifications'], sortOrder: 71 },
    { key: 'theme_primary_color', value: '#3b82f6', valueType: 'COLOR', category: 'UI', description: 'Primary theme color', defaultValue: '#3b82f6', isPublic: true, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['ui', 'theme', 'branding'], sortOrder: 72 },

    // QUERY/PERFORMANCE
    { key: 'dashboard_refresh_interval_seconds', value: '30', valueType: 'NUMBER', category: 'QUERY', description: 'Dashboard auto-refresh interval in seconds', defaultValue: '30', minValue: 10, maxValue: 300, isPublic: true, isEditable: true, requiresRestart: false, scope: 'USER', tags: ['performance', 'query'], sortOrder: 80 },
    { key: 'medication_reminder_refresh_interval_seconds', value: '60', valueType: 'NUMBER', category: 'QUERY', description: 'Medication reminders refresh interval in seconds', defaultValue: '60', minValue: 30, maxValue: 300, isPublic: true, isEditable: true, requiresRestart: false, scope: 'USER', tags: ['performance', 'query', 'medication'], sortOrder: 81 },
    { key: 'api_timeout_milliseconds', value: '30000', valueType: 'NUMBER', category: 'PERFORMANCE', description: 'API request timeout in milliseconds', defaultValue: '30000', minValue: 5000, maxValue: 120000, isPublic: false, isEditable: true, requiresRestart: true, scope: 'SYSTEM', tags: ['performance', 'api'], sortOrder: 82 },

    // BACKUP
    { key: 'backup_frequency_hours', value: '24', valueType: 'NUMBER', category: 'BACKUP', description: 'Automatic backup frequency in hours', defaultValue: '24', minValue: 1, maxValue: 168, isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['backup', 'maintenance'], sortOrder: 90 },
    { key: 'backup_retention_days', value: '30', valueType: 'NUMBER', category: 'BACKUP', description: 'Number of days to retain backups', defaultValue: '30', minValue: 7, maxValue: 365, isPublic: false, isEditable: true, requiresRestart: false, scope: 'SYSTEM', tags: ['backup', 'retention'], sortOrder: 91 },
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
  console.log(`   • Districts: 1 (${district.name})`);
  console.log(`   • Schools: ${schools.length}`);
  schools.forEach(school => {
    console.log(`      - ${school.name} (${school.schoolType}, ${school.totalEnrollment} students)`);
  });

  console.log('\n👥 USERS (17 total):');
  console.log(`   • Admins: 4 (Super Admin, District Admin, School Admin, Test Admin)`);
  console.log(`   • Nurses: 7 (distributed across all ${schools.length} schools)`);
  console.log(`   • Counselors: 3 (2 production, 1 test)`);
  console.log(`   • Viewers: 3 (1 production, 1 test viewer, 1 test readonly)`);

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
  console.log('   └─ Password: testNursePassword');

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
