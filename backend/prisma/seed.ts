import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password for default users
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create default district
  const district = await prisma.district.upsert({
    where: { code: 'DEMO_DISTRICT' },
    update: {},
    create: {
      name: 'Demo School District',
      code: 'DEMO_DISTRICT',
      address: '123 Education Way',
      city: 'Demo City',
      state: 'CA',
      zipCode: '90210',
      phone: '(555) 123-4567',
      email: 'admin@demodistrict.edu',
      website: 'https://demodistrict.edu',
    },
  });

  // Create default school
  const school = await prisma.school.upsert({
    where: { code: 'DEMO_ELEMENTARY' },
    update: {},
    create: {
      name: 'Demo Elementary School',
      code: 'DEMO_ELEMENTARY',
      address: '456 School Street',
      city: 'Demo City',
      state: 'CA',
      zipCode: '90210',
      phone: '(555) 234-5678',
      email: 'office@demoelementary.edu',
      principal: 'Jane Smith',
      studentCount: 450,
      districtId: district.id,
    },
  });

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@whitecross.health' },
    update: {},
    create: {
      email: 'admin@whitecross.health',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      isActive: true,
    },
  });

  // Create nurse user
  const nurseUser = await prisma.user.upsert({
    where: { email: 'nurse@whitecross.health' },
    update: {},
    create: {
      email: 'nurse@whitecross.health',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'NURSE',
      isActive: true,
    },
  });

  // Create test users for Cypress testing
  const testNursePassword = await bcrypt.hash('NursePassword123!', 10);
  const testAdminPassword = await bcrypt.hash('AdminPassword123!', 10);

  const testNurseUser = await prisma.user.upsert({
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

  const testAdminUser = await prisma.user.upsert({
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

  // Create some demo students
  const students = await Promise.all([
    prisma.student.upsert({
      where: { studentNumber: 'STU001' },
      update: {},
      create: {
        studentNumber: 'STU001',
        firstName: 'Emma',
        lastName: 'Wilson',
        dateOfBirth: new Date('2010-03-15'),
        grade: '6th Grade',
        gender: 'FEMALE',
        medicalRecordNum: 'MR001',
        nurseId: nurseUser.id,
      },
    }),
    prisma.student.upsert({
      where: { studentNumber: 'STU002' },
      update: {},
      create: {
        studentNumber: 'STU002',
        firstName: 'Liam',
        lastName: 'Davis',
        dateOfBirth: new Date('2011-07-22'),
        grade: '5th Grade',
        gender: 'MALE',
        medicalRecordNum: 'MR002',
        nurseId: nurseUser.id,
      },
    }),
    prisma.student.upsert({
      where: { studentNumber: 'STU003' },
      update: {},
      create: {
        studentNumber: 'STU003',
        firstName: 'Sophia',
        lastName: 'Miller',
        dateOfBirth: new Date('2009-11-08'),
        grade: '7th Grade',
        gender: 'FEMALE',
        medicalRecordNum: 'MR003',
        nurseId: nurseUser.id,
      },
    }),
  ]);

  // Create emergency contacts for students
  await Promise.all([
    prisma.emergencyContact.create({
      data: {
        firstName: 'Jennifer',
        lastName: 'Wilson',
        relationship: 'Mother',
        phoneNumber: '(555) 123-4567',
        email: 'jennifer.wilson@email.com',
        address: '123 Oak Street, Demo City, CA 90210',
        priority: 'PRIMARY',
        studentId: students[0].id,
      },
    }),
    prisma.emergencyContact.create({
      data: {
        firstName: 'Michael',
        lastName: 'Davis',
        relationship: 'Father',
        phoneNumber: '(555) 234-5678',
        email: 'michael.davis@email.com',
        address: '456 Pine Avenue, Demo City, CA 90210',
        priority: 'PRIMARY',
        studentId: students[1].id,
      },
    }),
    prisma.emergencyContact.create({
      data: {
        firstName: 'Lisa',
        lastName: 'Miller',
        relationship: 'Mother',
        phoneNumber: '(555) 345-6789',
        email: 'lisa.miller@email.com',
        address: '789 Elm Drive, Demo City, CA 90210',
        priority: 'PRIMARY',
        studentId: students[2].id,
      },
    }),
  ]);

  // Create some common medications
  const medications = await Promise.all([
    prisma.medication.upsert({
      where: { ndc: '12345-678-90' },
      update: {},
      create: {
        name: 'Albuterol Inhaler',
        genericName: 'Albuterol Sulfate',
        dosageForm: 'Inhaler',
        strength: '90 mcg/dose',
        manufacturer: 'ProAir',
        ndc: '12345-678-90',
      },
    }),
    prisma.medication.upsert({
      where: { ndc: '23456-789-01' },
      update: {},
      create: {
        name: 'EpiPen',
        genericName: 'Epinephrine',
        dosageForm: 'Auto-injector',
        strength: '0.3 mg',
        manufacturer: 'Mylan',
        ndc: '23456-789-01',
      },
    }),
    prisma.medication.upsert({
      where: { ndc: '34567-890-12' },
      update: {},
      create: {
        name: 'Tylenol',
        genericName: 'Acetaminophen',
        dosageForm: 'Tablet',
        strength: '325 mg',
        manufacturer: 'Johnson & Johnson',
        ndc: '34567-890-12',
      },
    }),
    prisma.medication.upsert({
      where: { ndc: '45678-901-23' },
      update: {},
      create: {
        name: 'Aspirin',
        genericName: 'acetylsalicylic acid',
        dosageForm: 'Tablet',
        strength: '325mg',
        manufacturer: 'Bayer',
        ndc: '45678-901-23',
      },
    }),
    prisma.medication.upsert({
      where: { ndc: '56789-012-34' },
      update: {},
      create: {
        name: 'Methylphenidate',
        genericName: 'methylphenidate HCl',
        dosageForm: 'Tablet',
        strength: '10mg',
        manufacturer: 'Novartis',
        ndc: '56789-012-34',
        isControlled: true,
      },
    }),
    prisma.medication.upsert({
      where: { ndc: '67890-123-45' },
      update: {},
      create: {
        name: 'Adderall',
        genericName: 'amphetamine/dextroamphetamine',
        dosageForm: 'Tablet',
        strength: '10mg',
        manufacturer: 'Teva',
        ndc: '67890-123-45',
        isControlled: true,
      },
    }),
    prisma.medication.upsert({
      where: { ndc: '78901-234-56' },
      update: {},
      create: {
        name: 'Ibuprofen',
        genericName: 'ibuprofen',
        dosageForm: 'Tablet',
        strength: '200mg',
        manufacturer: 'Johnson & Johnson',
        ndc: '78901-234-56',
      },
    }),
    prisma.medication.upsert({
      where: { ndc: '89012-345-67' },
      update: {},
      create: {
        name: 'Benadryl',
        genericName: 'diphenhydramine',
        dosageForm: 'Capsule',
        strength: '25mg',
        manufacturer: 'Johnson & Johnson',
        ndc: '89012-345-67',
      },
    }),
  ]);

  // Create medication inventory
  await Promise.all(
    medications.map((medication) =>
      prisma.medicationInventory.create({
        data: {
          medicationId: medication.id,
          batchNumber: `BATCH-${Math.random().toString(36).substr(2, 9)}`,
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          quantity: Math.floor(Math.random() * 50) + 10,
          reorderLevel: 5,
          costPerUnit: Math.floor(Math.random() * 100) + 10,
          supplier: 'Demo Medical Supply Co.',
        },
      })
    )
  );

  // Create some allergies for students
  await Promise.all([
    prisma.allergy.create({
      data: {
        allergen: 'Peanuts',
        severity: 'LIFE_THREATENING',
        reaction: 'Anaphylaxis',
        treatment: 'EpiPen administration',
        verified: true,
        verifiedBy: 'Dr. Smith',
        verifiedAt: new Date(),
        studentId: students[0].id,
      },
    }),
    prisma.allergy.create({
      data: {
        allergen: 'Penicillin',
        severity: 'MODERATE',
        reaction: 'Rash and hives',
        treatment: 'Discontinue medication, administer Benadryl',
        verified: true,
        verifiedBy: 'Dr. Johnson',
        verifiedAt: new Date(),
        studentId: students[1].id,
      },
    }),
  ]);

  // Create nurse availability
  const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
  await Promise.all(
    daysOfWeek.map((day) =>
      prisma.nurseAvailability.create({
        data: {
          nurseId: nurseUser.id,
          dayOfWeek: day,
          startTime: '08:00',
          endTime: '16:00',
          isRecurring: true,
          isAvailable: true,
        },
      })
    )
  );

  // Create system configurations
  const configs = [
    {
      key: 'app_name',
      value: 'White Cross',
      category: 'GENERAL',
      description: 'Application name',
      isPublic: true,
    },
    {
      key: 'max_login_attempts',
      value: '5',
      category: 'SECURITY',
      description: 'Maximum login attempts before account lockout',
      isPublic: false,
    },
    {
      key: 'session_timeout',
      value: '3600',
      category: 'SECURITY',
      description: 'Session timeout in seconds',
      isPublic: false,
    },
    {
      key: 'email_notifications_enabled',
      value: 'true',
      category: 'NOTIFICATION',
      description: 'Enable email notifications',
      isPublic: false,
    },
    {
      key: 'sms_notifications_enabled',
      value: 'true',
      category: 'NOTIFICATION',
      description: 'Enable SMS notifications',
      isPublic: false,
    },
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

  // Create default roles and permissions
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

  // Create admin role with all permissions
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: {
      name: 'Administrator',
      description: 'Full system access',
      isSystem: true,
    },
  });

  // Create nurse role with limited permissions
  const nurseRole = await prisma.role.upsert({
    where: { name: 'School Nurse' },
    update: {},
    create: {
      name: 'School Nurse',
      description: 'Standard nurse permissions',
      isSystem: true,
    },
  });

  // Assign all permissions to admin role
  await Promise.all(
    createdPermissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id } },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // Assign nurse-specific permissions to nurse role
  const nursePermissions = createdPermissions.filter(
    (p) => !p.resource.includes('administration') && p.action !== 'delete'
  );
  await Promise.all(
    nursePermissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: nurseRole.id, permissionId: permission.id } },
        update: {},
        create: {
          roleId: nurseRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // Assign roles to users
  await prisma.userRoleAssignment.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  await prisma.userRoleAssignment.upsert({
    where: { userId_roleId: { userId: nurseUser.id, roleId: nurseRole.id } },
    update: {},
    create: {
      userId: nurseUser.id,
      roleId: nurseRole.id,
    },
  });

  // Assign roles to test users
  await prisma.userRoleAssignment.upsert({
    where: { userId_roleId: { userId: testAdminUser.id, roleId: adminRole.id } },
    update: {},
    create: {
      userId: testAdminUser.id,
      roleId: adminRole.id,
    },
  });

  await prisma.userRoleAssignment.upsert({
    where: { userId_roleId: { userId: testNurseUser.id, roleId: nurseRole.id } },
    update: {},
    create: {
      userId: testNurseUser.id,
      roleId: nurseRole.id,
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📋 Created:');
  console.log(`   • District: ${district.name}`);
  console.log(`   • School: ${school.name}`);
  console.log(`   • Admin User: ${adminUser.email} (password: admin123)`);
  console.log(`   • Nurse User: ${nurseUser.email} (password: admin123)`);
  console.log(`   • Students: ${students.length}`);
  console.log(`   • Medications: ${medications.length}`);
  console.log(`   • Permissions: ${createdPermissions.length}`);
  console.log(`   • Roles: 2 (Administrator, School Nurse)`);
  console.log('\n🔐 Default login credentials:');
  console.log('   Administrator: admin@whitecross.health / admin123');
  console.log('   Nurse: nurse@whitecross.health / admin123');
  console.log('\n🧪 Test user credentials (for Cypress):');
  console.log('   Test Admin: admin@school.edu / AdminPassword123!');
  console.log('   Test Nurse: nurse@school.edu / NursePassword123!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });