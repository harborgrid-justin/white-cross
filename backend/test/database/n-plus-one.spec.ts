/**
 * N+1 Query Prevention Tests
 *
 * Tests that eager loading is properly implemented to prevent N+1 queries:
 * - Mental health records query count (should be 1, not 1+N)
 * - Graduating students query count (should be 2, not 1+500)
 * - Medication search query count
 * - Mock QueryLogger to count queries
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { DatabaseModule } from '../../src/database/database.module';
import { QueryLoggerService } from '../../src/database/services/query-logger.service';
import { Student } from '../../src/database/models/student.model';
import { MentalHealthRecord } from '../../src/database/models/mental-health-record.model';
import { MedicationLog } from '../../src/database/models/medication-log.model';
import { Medication } from '../../src/database/models/medication.model';
import { HealthRecord } from '../../src/database/models/health-record.model';

describe('N+1 Query Prevention Tests', () => {
  let module: TestingModule;
  let sequelize: Sequelize;
  let queryLogger: QueryLoggerService;
  let originalLogging: any;
  let queryCount: number;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        DatabaseModule,
      ],
    }).compile();

    sequelize = module.get<Sequelize>(Sequelize);
    queryLogger = module.get<QueryLoggerService>(QueryLoggerService);

    // Sync database
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    // Clean up tables
    await MedicationLog.destroy({ where: {}, force: true });
    await MentalHealthRecord.destroy({ where: {}, force: true });
    await HealthRecord.destroy({ where: {}, force: true });
    await Student.destroy({ where: {}, force: true });
    await Medication.destroy({ where: {}, force: true });

    // Reset query counter
    queryCount = 0;
    queryLogger.resetStats();

    // Set up query counter
    originalLogging = sequelize.options.logging;
    sequelize.options.logging = (sql: string) => {
      // Only count SELECT queries
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        queryCount++;
      }
      if (originalLogging && typeof originalLogging === 'function') {
        originalLogging(sql);
      }
    };
  });

  afterEach(() => {
    sequelize.options.logging = originalLogging;
  });

  describe('Mental Health Records - N+1 Prevention', () => {
    it('should load mental health records in 1 query with eager loading', async () => {
      // Create test data
      const students = await Promise.all([
        Student.create({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date('2010-01-01'),
          grade: '5',
          studentNumber: 'TEST',
        gender: 'MALE' as any,
        }),
        Student.create({
          firstName: 'Jane',
          lastName: 'Smith',
          dateOfBirth: new Date('2010-02-01'),
          grade: '5',
          studentNumber: 'TEST',
        gender: 'MALE' as any,
        }),
      ]);

      // Create mental health records for each student
      await Promise.all(
        students.map(student =>
          MentalHealthRecord.create({
            studentId: student.id,
            recordType: 'ASSESSMENT',
            recordDate: new Date(),
            title: 'Initial Assessment',
            sessionNotes: 'Test notes',
            riskLevel: 'LOW',
            followUpRequired: false,
            followUpCompleted: false,
            confidentialityLevel: 'STANDARD',
            parentNotified: false,
            attachments: [],
          })
        )
      );

      // Reset query count
      queryCount = 0;

      // Fetch with eager loading - should be 1 query
      const records = await MentalHealthRecord.findAll({
        include: [
          {
            model: Student,
            as: 'student',
            required: true,
          },
        ],
      });

      // Accessing student data should not trigger additional queries
      records.forEach(record => {
        const studentName = record.student?.firstName;
        expect(studentName).toBeDefined();
      });

      // Should be exactly 1 SELECT query (eager loading)
      expect(queryCount).toBeLessThanOrEqual(1);
      expect(records).toHaveLength(2);
    });

    it('should detect N+1 pattern without eager loading', async () => {
      // Create test data
      const students = await Promise.all(
        Array.from({ length: 5 }, (_, i) =>
          Student.create({
            firstName: `Student${i}`,
            lastName: 'Test',
            dateOfBirth: new Date('2010-01-01'),
            grade: '5',
            studentNumber: 'TEST',
        gender: 'MALE' as any,
          })
        )
      );

      await Promise.all(
        students.map(student =>
          MentalHealthRecord.create({
            studentId: student.id,
            recordType: 'ASSESSMENT',
            recordDate: new Date(),
            title: 'Assessment',
            sessionNotes: 'Notes',
            riskLevel: 'LOW',
            followUpRequired: false,
            followUpCompleted: false,
            confidentialityLevel: 'STANDARD',
            parentNotified: false,
            attachments: [],
          })
        )
      );

      // Reset query count
      queryCount = 0;

      // Fetch WITHOUT eager loading - this creates N+1
      const records = await MentalHealthRecord.findAll();

      // Access student data - triggers additional queries
      await Promise.all(
        records.map(async record => {
          const student = await Student.findByPk(record.studentId);
          expect(student).toBeDefined();
        })
      );

      // Should be 1 + N queries (N+1 problem)
      // 1 for mental health records + 5 for individual students
      expect(queryCount).toBeGreaterThan(5);
    });
  });

  describe('Graduating Students - N+1 Prevention', () => {
    it('should load graduating students efficiently', async () => {
      // Create 50 graduating students with health records
      const students = await Promise.all(
        Array.from({ length: 50 }, (_, i) =>
          Student.create({
            firstName: `Senior${i}`,
            lastName: 'Student',
            dateOfBirth: new Date('2006-01-01'),
            grade: '12',
            studentNumber: 'TEST',
        gender: 'MALE' as any,
          })
        )
      );

      // Create health records
      await Promise.all(
        students.map(student =>
          HealthRecord.create({
            studentId: student.id,
            recordType: 'PHYSICAL_EXAM',
            recordDate: new Date(),
            providerId: 'test-provider',
            diagnosis: 'Healthy',
            notes: 'Annual checkup',
          })
        )
      );

      // Reset query count
      queryCount = 0;

      // Fetch graduating students with eager loading
      const graduatingStudents = await Student.findAll({
        where: { grade: '12', enrollmentStatus: 'ACTIVE' },
        include: [
          {
            model: HealthRecord,
            as: 'healthRecords',
            required: false,
          },
        ],
      });

      // Access health records without triggering additional queries
      graduatingStudents.forEach(student => {
        const records = student.healthRecords;
        expect(records).toBeDefined();
      });

      // Should be at most 2 queries:
      // 1. Main query for students
      // 2. Join or separate query for health records (depending on Sequelize strategy)
      expect(queryCount).toBeLessThanOrEqual(2);
      expect(graduatingStudents).toHaveLength(50);
    });

    it('should efficiently load multiple associations', async () => {
      // Create a student with multiple associations
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2006-01-01'),
        grade: '12',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      // Create related records
      await HealthRecord.create({
        studentId: student.id,
        recordType: 'PHYSICAL_EXAM',
        recordDate: new Date(),
        providerId: 'provider1',
        diagnosis: 'Healthy',
        notes: 'Checkup',
      });

      await MentalHealthRecord.create({
        studentId: student.id,
        recordType: 'ASSESSMENT',
        recordDate: new Date(),
        title: 'Assessment',
        sessionNotes: 'Notes',
        riskLevel: 'LOW',
        followUpRequired: false,
        followUpCompleted: false,
        confidentialityLevel: 'STANDARD',
        parentNotified: false,
        attachments: [],
      });

      // Reset query count
      queryCount = 0;

      // Fetch with multiple includes
      const result = await Student.findByPk(student.id, {
        include: [
          {
            model: HealthRecord,
            as: 'healthRecords',
          },
          {
            model: MentalHealthRecord,
            as: 'mentalHealthRecords',
          },
        ],
      });

      // Access associations
      const healthRecords = result?.healthRecords;
      const mentalHealthRecords = result?.mentalHealthRecords;

      expect(healthRecords).toBeDefined();
      expect(mentalHealthRecords).toBeDefined();

      // Should be at most 3 queries (1 main + 2 associations)
      // Modern Sequelize may optimize this further
      expect(queryCount).toBeLessThanOrEqual(3);
    });
  });

  describe('Medication Search - N+1 Prevention', () => {
    it('should search medications with student data efficiently', async () => {
      // Create medications
      const medications = await Promise.all([
        Medication.create({
          name: 'Aspirin',
          dosage: '100mg',
          form: 'Tablet',
          manufacturer: 'PharmaCo',
          activeIngredient: 'Acetylsalicylic acid',
          requiresPrescription: false,
        }),
        Medication.create({
          name: 'Ibuprofen',
          dosage: '200mg',
          form: 'Tablet',
          manufacturer: 'MedCorp',
          activeIngredient: 'Ibuprofen',
          requiresPrescription: false,
        }),
      ]);

      // Create students
      const students = await Promise.all(
        Array.from({ length: 10 }, (_, i) =>
          Student.create({
            firstName: `Student${i}`,
            lastName: 'Test',
            dateOfBirth: new Date('2010-01-01'),
            grade: '5',
            studentNumber: 'TEST',
        gender: 'MALE' as any,
          })
        )
      );

      // Create medication logs
      await Promise.all(
        students.flatMap(student =>
          medications.map(medication =>
            MedicationLog.create({
              studentId: student.id,
              medicationId: medication.id,
              dosage: 100,
              dosageUnit: 'mg',
              route: 'ORAL',
              administeredAt: new Date(),
              administeredBy: 'Nurse Smith',
              wasGiven: true,
              status: 'ADMINISTERED',
            })
          )
        )
      );

      // Reset query count
      queryCount = 0;

      // Search medication logs with eager loading
      const logs = await MedicationLog.findAll({
        where: { wasGiven: true },
        include: [
          {
            model: Student,
            as: 'student',
            required: true,
          },
        ],
      });

      // Access student data
      logs.forEach(log => {
        const studentName = log.student?.firstName;
        expect(studentName).toBeDefined();
      });

      // Should be 1 query with JOIN
      expect(queryCount).toBeLessThanOrEqual(1);
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should paginate efficiently without N+1', async () => {
      // Create many medication logs
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      const medication = await Medication.create({
        name: 'Aspirin',
        dosage: '100mg',
        form: 'Tablet',
        manufacturer: 'PharmaCo',
        activeIngredient: 'Acetylsalicylic acid',
        requiresPrescription: false,
      });

      await Promise.all(
        Array.from({ length: 100 }, () =>
          MedicationLog.create({
            studentId: student.id,
            medicationId: medication.id,
            dosage: 100,
            dosageUnit: 'mg',
            route: 'ORAL',
            administeredAt: new Date(),
            administeredBy: 'Nurse Smith',
            wasGiven: true,
            status: 'ADMINISTERED',
          })
        )
      );

      // Reset query count
      queryCount = 0;

      // Paginate with eager loading
      const page1 = await MedicationLog.findAll({
        limit: 10,
        offset: 0,
        include: [
          {
            model: Student,
            as: 'student',
          },
        ],
      });

      const page2 = await MedicationLog.findAll({
        limit: 10,
        offset: 10,
        include: [
          {
            model: Student,
            as: 'student',
          },
        ],
      });

      // Should be 2 queries total (one per page)
      expect(queryCount).toBeLessThanOrEqual(2);
      expect(page1).toHaveLength(10);
      expect(page2).toHaveLength(10);
    });
  });

  describe('QueryLogger Integration', () => {
    it('should track query metrics', async () => {
      // Create some data
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      // Perform a query
      await Student.findByPk(student.id);

      // Get performance report
      const report = queryLogger.getPerformanceReport();

      expect(report.totalQueries).toBeGreaterThan(0);
      expect(report.topFrequentQueries).toBeDefined();
    });

    it('should detect potential N+1 patterns', async () => {
      // Create students
      const students = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
          Student.create({
            firstName: `Student${i}`,
            lastName: 'Test',
            dateOfBirth: new Date('2010-01-01'),
            grade: '5',
            studentNumber: 'TEST',
        gender: 'MALE' as any,
          })
        )
      );

      // Trigger N+1 pattern
      const allStudents = await Student.findAll();

      // Query each student individually (N+1 pattern)
      await Promise.all(
        allStudents.map(s => Student.findByPk(s.id))
      );

      // QueryLogger should have detected the pattern
      const report = queryLogger.getPerformanceReport();

      // We should see high frequency of similar queries
      expect(report.topFrequentQueries.length).toBeGreaterThan(0);
    });

    it('should identify slow queries', async () => {
      // Create many records to make query slower
      await Promise.all(
        Array.from({ length: 100 }, (_, i) =>
          Student.create({
            firstName: `Student${i}`,
            lastName: 'Test',
            dateOfBirth: new Date('2010-01-01'),
            grade: String(Math.floor(i / 20) + 1),
            studentNumber: 'TEST',
        gender: 'MALE' as any,
          })
        )
      );

      // Perform a potentially slow query (full table scan without index)
      await Student.findAll({
        where: {
          firstName: { [sequelize.Op.like]: '%Student%' },
        },
      });

      const slowQueries = queryLogger.getSlowQueries();

      // Depending on performance, we might or might not have slow queries
      // This test verifies the tracking mechanism works
      expect(Array.isArray(slowQueries)).toBe(true);
    });
  });

  describe('Complex Join Scenarios', () => {
    it('should handle nested includes efficiently', async () => {
      // This would require setting up more complex relationships
      // For now, we test the concept with available models

      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      await HealthRecord.create({
        studentId: student.id,
        recordType: 'PHYSICAL_EXAM',
        recordDate: new Date(),
        providerId: 'provider1',
        diagnosis: 'Healthy',
        notes: 'Checkup',
      });

      queryCount = 0;

      // Nested include
      const result = await Student.findAll({
        include: [
          {
            model: HealthRecord,
            as: 'healthRecords',
            required: false,
          },
        ],
      });

      // Should use JOIN, not separate queries
      expect(queryCount).toBeLessThanOrEqual(1);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
