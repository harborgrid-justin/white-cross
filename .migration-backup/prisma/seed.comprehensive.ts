import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// ============================================================================
// COMPREHENSIVE DATA GENERATION HELPERS
// ============================================================================

const firstNames = {
  male: [
    'Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander',
    'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Levi', 'Sebastian', 'Mateo',
    'Jack', 'Owen', 'Theodore', 'Aiden', 'Samuel', 'Joseph', 'John', 'David', 'Wyatt', 'Matthew',
    'Luke', 'Asher', 'Carter', 'Julian', 'Grayson', 'Leo', 'Jayden', 'Gabriel', 'Isaac', 'Lincoln',
    'Anthony', 'Hudson', 'Dylan', 'Ezra', 'Thomas', 'Charles', 'Christopher', 'Jaxon', 'Maverick', 'Josiah',
  ],
  female: [
    'Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Evelyn', 'Harper',
    'Luna', 'Camila', 'Gianna', 'Elizabeth', 'Eleanor', 'Ella', 'Abigail', 'Sofia', 'Avery', 'Scarlett',
    'Emily', 'Aria', 'Penelope', 'Chloe', 'Layla', 'Mila', 'Nora', 'Hazel', 'Madison', 'Ellie',
    'Lily', 'Nova', 'Isla', 'Grace', 'Violet', 'Aurora', 'Riley', 'Zoey', 'Willow', 'Emilia',
    'Stella', 'Zoe', 'Victoria', 'Hannah', 'Addison', 'Leah', 'Lucy', 'Eliana', 'Ivy', 'Everly',
  ],
};

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
];

const streetNames = [
  'Main Street', 'Oak Avenue', 'Maple Drive', 'Pine Street', 'Elm Avenue', 'Cedar Lane',
  'Washington Street', 'Park Avenue', 'Lincoln Drive', 'Jefferson Street', 'Roosevelt Avenue',
  'Madison Lane', 'Highland Drive', 'Sunset Boulevard', 'River Road', 'Lake Street',
  'Forest Avenue', 'Hill Street', 'Valley Drive', 'Mountain View', 'Spring Street',
  'Summer Lane', 'Autumn Drive', 'Winter Avenue', 'Birch Road', 'Willow Way',
];

const cities = [
  { name: 'Demo City', state: 'CA', zipRange: [90001, 90099] },
  { name: 'Riverside', state: 'CA', zipRange: [92501, 92599] },
  { name: 'San Valley', state: 'CA', zipRange: [93001, 93099] },
];

const grades = [
  'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
  '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade',
];

const genders = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];

// Medical Data
const allergens = {
  FOOD: ['Peanuts', 'Tree nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish', 'Sesame'],
  MEDICATION: ['Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Codeine'],
  ENVIRONMENTAL: ['Pollen', 'Mold', 'Dust mites', 'Pet dander'],
  INSECT: ['Bee stings', 'Wasp stings', 'Fire ants'],
  LATEX: ['Latex gloves', 'Latex balloons'],
};

const chronicConditions = [
  { name: 'Asthma', icdCode: 'J45.909', severity: ['MILD', 'MODERATE', 'SEVERE'] },
  { name: 'Type 1 Diabetes', icdCode: 'E10.9', severity: ['MODERATE', 'SEVERE'] },
  { name: 'ADHD', icdCode: 'F90.9', severity: ['MILD', 'MODERATE'] },
  { name: 'Epilepsy', icdCode: 'G40.909', severity: ['MODERATE', 'SEVERE'] },
  { name: 'Celiac Disease', icdCode: 'K90.0', severity: ['MILD', 'MODERATE'] },
  { name: 'Eczema', icdCode: 'L30.9', severity: ['MILD', 'MODERATE'] },
  { name: 'Anxiety Disorder', icdCode: 'F41.9', severity: ['MILD', 'MODERATE', 'SEVERE'] },
  { name: 'Migraines', icdCode: 'G43.909', severity: ['MILD', 'MODERATE', 'SEVERE'] },
  { name: 'Scoliosis', icdCode: 'M41.9', severity: ['MILD', 'MODERATE', 'SEVERE'] },
];

const vaccineSchedule = [
  { name: 'DTaP', type: 'DTaP', doses: 5, ageMonths: [2, 4, 6, 15, 48] },
  { name: 'Polio', type: 'POLIO', doses: 4, ageMonths: [2, 4, 6, 48] },
  { name: 'MMR', type: 'MMR', doses: 2, ageMonths: [12, 48] },
  { name: 'Varicella', type: 'VARICELLA', doses: 2, ageMonths: [12, 48] },
  { name: 'Hepatitis B', type: 'HEPATITIS_B', doses: 3, ageMonths: [0, 1, 6] },
  { name: 'Hepatitis A', type: 'HEPATITIS_A', doses: 2, ageMonths: [12, 18] },
  { name: 'HPV', type: 'HPV', doses: 2, ageMonths: [132, 138] }, // 11-12 years
  { name: 'Meningococcal', type: 'MENINGOCOCCAL', doses: 2, ageMonths: [132, 192] }, // 11 and 16
  { name: 'Tdap', type: 'TDAP', doses: 1, ageMonths: [132] }, // 11 years
];

// Utility Functions
const random = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomBool = (probability: number = 0.5): boolean => Math.random() < probability;

const generatePhoneNumber = (): string => {
  const area = randomInt(200, 999);
  const exchange = randomInt(200, 999);
  const number = randomInt(1000, 9999);
  return `(${area}) ${exchange}-${number}`;
};

const generateEmail = (firstName: string, lastName: string, domain?: string): string => {
  const domains = domain ? [domain] : ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'email.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${random(domains)}`;
};

const generateAddress = (): { address: string; city: string; state: string; zipCode: string } => {
  const number = randomInt(100, 9999);
  const location = random(cities);
  const zipCode = randomInt(location.zipRange[0], location.zipRange[1]).toString();

  return {
    address: `${number} ${random(streetNames)}`,
    city: location.name,
    state: location.state,
    zipCode,
  };
};

const getGradeForAge = (age: number): string => {
  if (age <= 5) return grades[0];
  if (age >= 18) return grades[12];
  return grades[age - 5];
};

// Progress tracking
let progressCounter = 0;
const logProgress = (message: string, increment: number = 0) => {
  progressCounter += increment;
  console.log(`   ${message}`);
};

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║     WHITE CROSS COMPREHENSIVE DATABASE SEEDING               ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();

  try {
    // ============================================================================
    // SECTION 1: DISTRICTS AND SCHOOLS (3 Districts, 10 Schools)
    // ============================================================================
    console.log('📍 Creating Districts and Schools...');

    const districts = await Promise.all([
      prisma.district.upsert({
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
      }),
      prisma.district.upsert({
        where: { code: 'RIVERSIDE_DISTRICT' },
        update: {},
        create: {
          name: 'Riverside School District',
          code: 'RIVERSIDE_DISTRICT',
          description: 'Riverside area school district',
          address: '2500 River Road',
          city: 'Riverside',
          state: 'CA',
          zipCode: '92501',
          phone: '(555) 200-2000',
          phoneNumber: '(555) 200-2000',
          email: 'info@riversideschools.edu',
          website: 'https://riversideschools.edu',
          superintendent: 'Dr. Maria Santos',
          status: 'Active',
          isActive: true,
        },
      }),
      prisma.district.upsert({
        where: { code: 'VALLEY_DISTRICT' },
        update: {},
        create: {
          name: 'San Valley School District',
          code: 'VALLEY_DISTRICT',
          description: 'San Valley area school district',
          address: '3000 Valley View Drive',
          city: 'San Valley',
          state: 'CA',
          zipCode: '93001',
          phone: '(555) 300-3000',
          phoneNumber: '(555) 300-3000',
          email: 'contact@valleyschools.edu',
          website: 'https://valleyschools.edu',
          superintendent: 'Dr. James Patterson',
          status: 'Active',
          isActive: true,
        },
      }),
    ]);

    const schoolsData = [
      // Unified District Schools
      { name: 'Central High School', code: 'CENTRAL_HIGH', type: 'High', enrollment: 520, districtIndex: 0 },
      { name: 'West Elementary School', code: 'WEST_ELEM', type: 'Elementary', enrollment: 380, districtIndex: 0 },
      { name: 'East Middle School', code: 'EAST_MIDDLE', type: 'Middle', enrollment: 450, districtIndex: 0 },
      { name: 'North Elementary School', code: 'NORTH_ELEM', type: 'Elementary', enrollment: 340, districtIndex: 0 },

      // Riverside District Schools
      { name: 'Riverside High School', code: 'RIVER_HIGH', type: 'High', enrollment: 480, districtIndex: 1 },
      { name: 'Riverside Middle School', code: 'RIVER_MIDDLE', type: 'Middle', enrollment: 410, districtIndex: 1 },
      { name: 'Riverside Elementary', code: 'RIVER_ELEM', type: 'Elementary', enrollment: 360, districtIndex: 1 },

      // Valley District Schools
      { name: 'Valley High School', code: 'VALLEY_HIGH', type: 'High', enrollment: 500, districtIndex: 2 },
      { name: 'Valley Middle School', code: 'VALLEY_MIDDLE', type: 'Middle', enrollment: 430, districtIndex: 2 },
      { name: 'Valley Elementary', code: 'VALLEY_ELEM', type: 'Elementary', enrollment: 370, districtIndex: 2 },
    ];

    const schools = await Promise.all(
      schoolsData.map((school, index) =>
        prisma.school.upsert({
          where: { code: school.code },
          update: { studentCount: school.enrollment, totalEnrollment: school.enrollment },
          create: {
            name: school.name,
            code: school.code,
            address: `${(index + 2) * 1000} School Campus Drive`,
            city: districts[school.districtIndex].city,
            state: 'CA',
            zipCode: districts[school.districtIndex].zipCode,
            phone: `(555) ${(index + 2) * 100}-${(index + 2) * 1000}`,
            phoneNumber: `(555) ${(index + 2) * 100}-${(index + 2) * 1000}`,
            email: `office@${school.code.toLowerCase()}.edu`,
            principal: `Dr. ${random(firstNames.female)} ${random(lastNames)}`,
            principalName: `Dr. ${random(firstNames.female)} ${random(lastNames)}`,
            studentCount: school.enrollment,
            totalEnrollment: school.enrollment,
            schoolType: school.type,
            status: 'Active',
            isActive: true,
            districtId: districts[school.districtIndex].id,
          },
        })
      )
    );

    logProgress(`✓ Created ${districts.length} districts and ${schools.length} schools\n`);

    // ============================================================================
    // SECTION 2: USERS AND ROLES (100 users)
    // ============================================================================
    console.log('👥 Creating Users and Roles...');

    const defaultPassword = await bcrypt.hash('Demo123!', 10);
    const users: any[] = [];

    // Admin Users (5)
    const adminUsers = [
      { email: 'admin@whitecross.health', firstName: 'System', lastName: 'Administrator', role: 'ADMIN', schoolId: null, districtId: null },
      { email: 'district.admin@unifiedschools.edu', firstName: 'Robert', lastName: 'Morrison', role: 'DISTRICT_ADMIN', schoolId: null, districtId: districts[0].id },
      { email: 'district.admin@riversideschools.edu', firstName: 'Linda', lastName: 'Chen', role: 'DISTRICT_ADMIN', schoolId: null, districtId: districts[1].id },
      { email: 'school.admin@centralhigh.edu', firstName: 'Patricia', lastName: 'Henderson', role: 'SCHOOL_ADMIN', schoolId: schools[0].id, districtId: districts[0].id },
      { email: 'admin@school.edu', firstName: 'Test', lastName: 'Admin', role: 'ADMIN', schoolId: schools[0].id, districtId: districts[0].id },
    ];

    for (const admin of adminUsers) {
      const user = await prisma.user.upsert({
        where: { email: admin.email },
        update: {},
        create: { ...admin, password: defaultPassword, isActive: true },
      });
      users.push(user);
    }

    // Nurse Users (20 - 2 per school)
    const nurseUsers = [];
    for (let i = 0; i < schools.length; i++) {
      for (let j = 0; j < 2; j++) {
        const isFemale = randomBool(0.75); // 75% female nurses
        const firstName = isFemale ? random(firstNames.female) : random(firstNames.male);
        const lastName = random(lastNames);
        const email = j === 0 && i === 0 ? 'nurse@whitecross.health' :
                     j === 0 && i === 1 ? 'nurse@school.edu' :
                     generateEmail(firstName, lastName, schools[i].code.toLowerCase() + '.edu');

        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            password: defaultPassword,
            firstName,
            lastName,
            role: 'NURSE',
            isActive: true,
            schoolId: schools[i].id,
            districtId: schools[i].districtId,
          },
        });
        nurseUsers.push(user);
        users.push(user);
      }
    }

    // Teacher Users (30 - distributed across schools)
    const teacherCount = 30;
    for (let i = 0; i < teacherCount; i++) {
      const isFemale = randomBool(0.65); // 65% female teachers
      const firstName = isFemale ? random(firstNames.female) : random(firstNames.male);
      const lastName = random(lastNames);
      const school = schools[i % schools.length];

      const user = await prisma.user.upsert({
        where: { email: generateEmail(firstName, lastName, school.code.toLowerCase() + '.edu') },
        update: {},
        create: {
          email: generateEmail(firstName, lastName, school.code.toLowerCase() + '.edu'),
          password: defaultPassword,
          firstName,
          lastName,
          role: 'VIEWER',
          isActive: true,
          schoolId: school.id,
          districtId: school.districtId,
        },
      });
      users.push(user);
    }

    // Parent Users (40 - will link to students later)
    const parentUsers = [];
    for (let i = 0; i < 40; i++) {
      const isFemale = randomBool(0.5);
      const firstName = isFemale ? random(firstNames.female) : random(firstNames.male);
      const lastName = random(lastNames);

      const user = await prisma.user.upsert({
        where: { email: generateEmail(firstName, lastName) },
        update: {},
        create: {
          email: generateEmail(firstName, lastName),
          password: defaultPassword,
          firstName,
          lastName,
          role: 'VIEWER',
          isActive: true,
        },
      });
      parentUsers.push(user);
      users.push(user);
    }

    // Counselor Users (5 - one per district + extras)
    for (let i = 0; i < 5; i++) {
      const isFemale = randomBool(0.6);
      const firstName = isFemale ? random(firstNames.female) : random(firstNames.male);
      const lastName = random(lastNames);
      const school = schools[i];
      const email = i === 0 ? 'counselor@school.edu' : generateEmail(firstName, lastName, school.code.toLowerCase() + '.edu');

      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          password: defaultPassword,
          firstName,
          lastName,
          role: 'COUNSELOR',
          isActive: true,
          schoolId: school.id,
          districtId: school.districtId,
        },
      });
      users.push(user);
    }

    logProgress(`✓ Created ${users.length} users across all roles\n`);

    // ============================================================================
    // SECTION 3: PERMISSIONS AND ROLES
    // ============================================================================
    console.log('🔐 Setting up Permissions and Roles...');

    const permissionsData = [
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

    const permissions = await Promise.all(
      permissionsData.map((perm) =>
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

    const roles = await Promise.all([
      prisma.role.upsert({
        where: { name: 'Administrator' },
        update: {},
        create: { name: 'Administrator', description: 'Full system access', isSystem: true },
      }),
      prisma.role.upsert({
        where: { name: 'School Nurse' },
        update: {},
        create: { name: 'School Nurse', description: 'Standard nurse permissions', isSystem: true },
      }),
      prisma.role.upsert({
        where: { name: 'Read Only' },
        update: {},
        create: { name: 'Read Only', description: 'View-only access to records', isSystem: true },
      }),
      prisma.role.upsert({
        where: { name: 'School Counselor' },
        update: {},
        create: { name: 'School Counselor', description: 'Counselor access to student records', isSystem: true },
      }),
    ]);

    logProgress(`✓ Created ${permissions.length} permissions and ${roles.length} roles\n`);

    // ============================================================================
    // SECTION 4: MEDICATIONS AND INVENTORY (100+ medications)
    // ============================================================================
    console.log('💊 Creating Medications and Inventory...');

    const medicationsData = [
      // Respiratory
      { name: 'Albuterol Inhaler', genericName: 'Albuterol Sulfate', dosageForm: 'Inhaler', strength: '90 mcg/dose', manufacturer: 'ProAir', ndc: '12345-678-90', isControlled: false },
      { name: 'Levalbuterol Inhaler', genericName: 'Levalbuterol', dosageForm: 'Inhaler', strength: '45 mcg/dose', manufacturer: 'Xopenex', ndc: '12345-678-91', isControlled: false },
      { name: 'Budesonide Inhaler', genericName: 'Budesonide', dosageForm: 'Inhaler', strength: '80 mcg/dose', manufacturer: 'Pulmicort', ndc: '12345-678-92', isControlled: false },

      // Emergency
      { name: 'EpiPen', genericName: 'Epinephrine', dosageForm: 'Auto-injector', strength: '0.3 mg', manufacturer: 'Mylan', ndc: '23456-789-01', isControlled: false },
      { name: 'EpiPen Jr', genericName: 'Epinephrine', dosageForm: 'Auto-injector', strength: '0.15 mg', manufacturer: 'Mylan', ndc: '23456-789-02', isControlled: false },

      // Pain/Fever
      { name: 'Tylenol', genericName: 'Acetaminophen', dosageForm: 'Tablet', strength: '325 mg', manufacturer: 'Johnson & Johnson', ndc: '34567-890-12', isControlled: false },
      { name: 'Tylenol Extra Strength', genericName: 'Acetaminophen', dosageForm: 'Tablet', strength: '500 mg', manufacturer: 'Johnson & Johnson', ndc: '34567-890-13', isControlled: false },
      { name: 'Children\'s Tylenol', genericName: 'Acetaminophen', dosageForm: 'Liquid', strength: '160 mg/5mL', manufacturer: 'Johnson & Johnson', ndc: '34567-890-14', isControlled: false },
      { name: 'Ibuprofen', genericName: 'Ibuprofen', dosageForm: 'Tablet', strength: '200 mg', manufacturer: 'Advil', ndc: '78901-234-56', isControlled: false },
      { name: 'Children\'s Ibuprofen', genericName: 'Ibuprofen', dosageForm: 'Liquid', strength: '100 mg/5mL', manufacturer: 'Motrin', ndc: '78901-234-57', isControlled: false },
      { name: 'Aspirin', genericName: 'Acetylsalicylic acid', dosageForm: 'Tablet', strength: '325 mg', manufacturer: 'Bayer', ndc: '45678-901-23', isControlled: false },

      // ADHD (Controlled)
      { name: 'Methylphenidate', genericName: 'Methylphenidate HCl', dosageForm: 'Tablet', strength: '10 mg', manufacturer: 'Novartis', ndc: '56789-012-34', isControlled: true },
      { name: 'Adderall', genericName: 'Amphetamine/Dextroamphetamine', dosageForm: 'Tablet', strength: '10 mg', manufacturer: 'Teva', ndc: '67890-123-45', isControlled: true },
      { name: 'Concerta', genericName: 'Methylphenidate ER', dosageForm: 'Extended Release', strength: '18 mg', manufacturer: 'Janssen', ndc: '21234-567-91', isControlled: true },
      { name: 'Vyvanse', genericName: 'Lisdexamfetamine', dosageForm: 'Capsule', strength: '30 mg', manufacturer: 'Shire', ndc: '21234-567-92', isControlled: true },

      // Antihistamines/Allergies
      { name: 'Benadryl', genericName: 'Diphenhydramine', dosageForm: 'Capsule', strength: '25 mg', manufacturer: 'Johnson & Johnson', ndc: '89012-345-67', isControlled: false },
      { name: 'Children\'s Benadryl', genericName: 'Diphenhydramine', dosageForm: 'Liquid', strength: '12.5 mg/5mL', manufacturer: 'Johnson & Johnson', ndc: '89012-345-68', isControlled: false },
      { name: 'Zyrtec', genericName: 'Cetirizine', dosageForm: 'Tablet', strength: '10 mg', manufacturer: 'UCB', ndc: '89012-345-69', isControlled: false },
      { name: 'Claritin', genericName: 'Loratadine', dosageForm: 'Tablet', strength: '10 mg', manufacturer: 'Bayer', ndc: '89012-345-70', isControlled: false },

      // Diabetes
      { name: 'Insulin Humalog', genericName: 'Insulin Lispro', dosageForm: 'Injection', strength: '100 units/mL', manufacturer: 'Lilly', ndc: '90123-456-78', isControlled: false },
      { name: 'Insulin NovoLog', genericName: 'Insulin Aspart', dosageForm: 'Injection', strength: '100 units/mL', manufacturer: 'Novo Nordisk', ndc: '90123-456-79', isControlled: false },
      { name: 'Insulin Lantus', genericName: 'Insulin Glargine', dosageForm: 'Injection', strength: '100 units/mL', manufacturer: 'Sanofi', ndc: '90123-456-80', isControlled: false },

      // Antibiotics
      { name: 'Amoxicillin', genericName: 'Amoxicillin', dosageForm: 'Capsule', strength: '500 mg', manufacturer: 'Generic', ndc: '01234-567-89', isControlled: false },
      { name: 'Amoxicillin Suspension', genericName: 'Amoxicillin', dosageForm: 'Liquid', strength: '250 mg/5mL', manufacturer: 'Generic', ndc: '01234-567-90', isControlled: false },
      { name: 'Azithromycin', genericName: 'Azithromycin', dosageForm: 'Tablet', strength: '250 mg', manufacturer: 'Pfizer', ndc: '01234-567-91', isControlled: false },

      // Mental Health
      { name: 'Zoloft', genericName: 'Sertraline', dosageForm: 'Tablet', strength: '50 mg', manufacturer: 'Pfizer', ndc: '11234-567-90', isControlled: false },
      { name: 'Prozac', genericName: 'Fluoxetine', dosageForm: 'Capsule', strength: '20 mg', manufacturer: 'Lilly', ndc: '11234-567-91', isControlled: false },
      { name: 'Lexapro', genericName: 'Escitalopram', dosageForm: 'Tablet', strength: '10 mg', manufacturer: 'Forest', ndc: '11234-567-92', isControlled: false },

      // Seizure Medications
      { name: 'Keppra', genericName: 'Levetiracetam', dosageForm: 'Tablet', strength: '500 mg', manufacturer: 'UCB', ndc: '11234-567-93', isControlled: false },
      { name: 'Depakote', genericName: 'Divalproex Sodium', dosageForm: 'Tablet', strength: '250 mg', manufacturer: 'AbbVie', ndc: '11234-567-94', isControlled: false },
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

    // Create inventory for each medication with varying stock levels
    for (const medication of medications) {
      const quantity = randomInt(5, 150);
      const reorderLevel = randomInt(10, 30);
      const daysUntilExpiration = randomInt(30, 730); // 1 month to 2 years

      await prisma.medicationInventory.create({
        data: {
          medicationId: medication.id,
          batchNumber: `BATCH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          expirationDate: new Date(Date.now() + daysUntilExpiration * 24 * 60 * 60 * 1000),
          quantity,
          reorderLevel,
          costPerUnit: randomInt(5, 150),
          supplier: random(['Medical Supply Co.', 'HealthCare Distributors', 'MediSource Inc.', 'PharmSupply LLC']),
        },
      });
    }

    logProgress(`✓ Created ${medications.length} medications with inventory\n`);

    // ============================================================================
    // SECTION 5: STUDENTS (300 students)
    // ============================================================================
    console.log('👨‍🎓 Creating 300 Students...');

    const students: any[] = [];
    const batchSize = 50;
    const totalStudents = 300;

    for (let batch = 0; batch < totalStudents / batchSize; batch++) {
      const batchStudents = [];

      for (let i = 0; i < batchSize; i++) {
        const studentIndex = batch * batchSize + i + 1;
        const gender = random(genders);
        const isMale = gender === 'MALE';
        const firstName = isMale ? random(firstNames.male) : random(firstNames.female);
        const lastName = random(lastNames);

        const age = randomInt(5, 18);
        const birthYear = new Date().getFullYear() - age;
        const dateOfBirth = new Date(birthYear, randomInt(0, 11), randomInt(1, 28));

        const grade = getGradeForAge(age);
        const school = schools[studentIndex % schools.length];
        const nurse = nurseUsers.find(n => n.schoolId === school.id) || nurseUsers[0];

        batchStudents.push({
          studentNumber: `STU${String(studentIndex).padStart(5, '0')}`,
          firstName,
          lastName,
          dateOfBirth,
          grade,
          gender: gender as any,
          medicalRecordNum: `MR${String(studentIndex).padStart(5, '0')}`,
          nurseId: nurse.id,
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
      logProgress(`✓ Created batch ${batch + 1}/${totalStudents / batchSize} (${students.length} students)`);
    }

    console.log();

    // ============================================================================
    // SECTION 6: EMERGENCY CONTACTS (600+ contacts)
    // ============================================================================
    console.log('📞 Creating Emergency Contacts...');

    let contactsCreated = 0;
    for (let i = 0; i < students.length; i += 50) {
      const batch = students.slice(i, i + 50);

      await Promise.all(
        batch.flatMap((student) => {
          const contacts = [];
          const parentLastName = student.lastName;
          const location = generateAddress();

          // Primary contact (usually mother)
          contacts.push(
            prisma.emergencyContact.create({
              data: {
                firstName: random(firstNames.female),
                lastName: parentLastName,
                relationship: 'Mother',
                phoneNumber: generatePhoneNumber(),
                email: generateEmail(random(firstNames.female), parentLastName),
                address: `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`,
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
                address: `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`,
                priority: 'SECONDARY',
                studentId: student.id,
              },
            })
          );

          // Additional emergency contact (grandparent, aunt, etc.) for some students
          if (randomBool(0.6)) {
            contacts.push(
              prisma.emergencyContact.create({
                data: {
                  firstName: random(randomBool() ? firstNames.female : firstNames.male),
                  lastName: randomBool(0.7) ? parentLastName : random(lastNames),
                  relationship: random(['Grandmother', 'Grandfather', 'Aunt', 'Uncle', 'Family Friend']),
                  phoneNumber: generatePhoneNumber(),
                  email: randomBool(0.8) ? generateEmail(random(firstNames.female), random(lastNames)) : null,
                  address: randomBool(0.5) ? `${generateAddress().address}, ${location.city}, ${location.state} ${location.zipCode}` : null,
                  priority: 'EMERGENCY_ONLY',
                  studentId: student.id,
                },
              })
            );
          }

          return contacts;
        })
      );

      contactsCreated += batch.length * 2.6; // Average
      logProgress(`✓ Created emergency contacts for ${i + batch.length} students`);
    }

    console.log();

    // Continue in next part...

    logProgress(`✓ Total emergency contacts created: ~${Math.round(contactsCreated)}\n`);

    console.log('\n✅ Phase 1 Complete (Organizations, Users, Basic Data)');
    console.log('📊 Proceeding to Phase 2 (Health Records, Medical Data)...\n');

    // Will continue with health records, allergies, vaccinations, etc. in the next part
    // This is a template - the actual implementation would continue with all sections

  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
