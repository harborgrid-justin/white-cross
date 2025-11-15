#!/usr/bin/env ts-node

/**
 * Simple Database Count Checker
 * Checks counts without loading the full NestJS application
 */

import { Sequelize } from 'sequelize';

async function checkCounts(): Promise<void> {
  console.log('🔍 Checking database counts...\n');

  // Create a simple Sequelize connection
  const sequelize = new Sequelize(process.env.DATABASE_URL!, {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.\n');

    // Check counts
    const [districtsResult] = await sequelize.query('SELECT COUNT(*) as count FROM districts');
    const [schoolsResult] = await sequelize.query('SELECT COUNT(*) as count FROM schools');
    const [studentsResult] = await sequelize.query('SELECT COUNT(*) as count FROM students');
    const [contactsResult] = await sequelize.query('SELECT COUNT(*) as count FROM emergency_contacts');
    const [recordsResult] = await sequelize.query('SELECT COUNT(*) as count FROM health_records');
    const [usersResult] = await sequelize.query('SELECT COUNT(*) as count FROM users');

    console.log('📊 Database Counts:');
    console.log('  Districts:', (districtsResult as any)[0].count);
    console.log('  Schools:', (schoolsResult as any)[0].count);
    console.log('  Students:', (studentsResult as any)[0].count);
    console.log('  Emergency Contacts:', (contactsResult as any)[0].count);
    console.log('  Health Records:', (recordsResult as any)[0].count);
    console.log('  Users:', (usersResult as any)[0].count);

    // Check some sample student data
    const [sampleStudents] = await sequelize.query(`
      SELECT s."firstName", s."lastName", s.grade, sc.name as school_name, d.name as district_name
      FROM students s
      LEFT JOIN schools sc ON s."schoolId" = sc.id
      LEFT JOIN districts d ON s."districtId" = d.id
      ORDER BY s."createdAt" DESC
      LIMIT 5
    `);

    console.log('\n👤 Sample Students (Most Recent):');
    (sampleStudents as any[]).forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.firstName} ${student.lastName} (Grade ${student.grade}) - ${student.school_name}, ${student.district_name}`);
    });

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  checkCounts()
    .then(() => {
      console.log('\n✅ Database check completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Database check failed:', error);
      process.exit(1);
    });
}