#!/usr/bin/env ts-node

/**
 * Quick Database Check
 * Check how many records exist in the main tables
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Sequelize } from 'sequelize-typescript';

// Models
import { District } from '../database/models/district.model';
import { School } from '../database/models/school.model';
import { Student } from '../database/models/student.model';
import { EmergencyContact } from '../database/models/emergency-contact.model';
import { HealthRecord } from '../database/models/health-record.model';

async function checkDatabaseCounts(): Promise<void> {
  console.log('📊 Checking database record counts...\n');

  let app;
  try {
    // Initialize NestJS application
    app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn']
    });

    // Get counts
    const districtCount = await District.count();
    const schoolCount = await School.count();
    const studentCount = await Student.count();
    const emergencyContactCount = await EmergencyContact.count();
    const healthRecordCount = await HealthRecord.count();

    console.log('📈 Current Database Counts:');
    console.log(`   Districts: ${districtCount}`);
    console.log(`   Schools: ${schoolCount}`);
    console.log(`   Students: ${studentCount}`);
    console.log(`   Emergency Contacts: ${emergencyContactCount}`);
    console.log(`   Health Records: ${healthRecordCount}`);

    // Get some sample student data
    const sampleStudents = await Student.findAll({
      limit: 5,
      attributes: ['id', 'firstName', 'lastName', 'grade', 'isActive'],
      include: [
        { model: School, as: 'school', attributes: ['name'] },
        { model: District, as: 'district', attributes: ['name'] }
      ]
    });

    if (sampleStudents.length > 0) {
      console.log('\n👥 Sample Students:');
      sampleStudents.forEach((student: any) => {
        console.log(`   ${student.firstName} ${student.lastName} (Grade ${student.grade}) - ${student.school?.name || 'No School'}`);
      });
    }

  } catch (error) {
    console.error('❌ Database check failed:', error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

// Run the check if this file is executed directly
if (require.main === module) {
  checkDatabaseCounts()
    .then(() => {
      console.log('\n✅ Database check completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database check failed:', error);
      process.exit(1);
    });
}

export { checkDatabaseCounts };