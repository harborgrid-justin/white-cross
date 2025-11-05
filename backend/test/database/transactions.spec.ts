/**
 * Transaction Isolation Level Tests
 *
 * Tests transaction isolation behavior including:
 * - SERIALIZABLE isolation prevents phantom reads
 * - READ_COMMITTED behavior
 * - Concurrent update handling
 * - Transaction rollback on errors
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction, IsolationLevel } from 'sequelize';
import { DatabaseModule } from '../../src/database/database.module';
import { AuditService } from '../../src/database/services/audit.service';
import { Student } from '../../src/database/models/student.model';
import { HealthRecord } from '../../src/database/models/health-record.model';
import { MedicationLog } from '../../src/database/models/medication-log.model';

describe('Transaction Isolation Tests', () => {
  let module: TestingModule;
  let sequelize: Sequelize;
  let auditService: AuditService;

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
    auditService = module.get<AuditService>('IAuditLogger');

    // Ensure clean database
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    // Clean up tables before each test
    await Student.destroy({ where: {}, force: true });
    await HealthRecord.destroy({ where: {}, force: true });
    await MedicationLog.destroy({ where: {}, force: true });
  });

  describe('SERIALIZABLE Isolation Level', () => {
    it('should prevent phantom reads', async () => {
      // Create initial data
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'S001',
        gender: 'MALE' as any,
      });

      let transaction1: Transaction | null = null;
      let transaction2: Transaction | null = null;

      try {
        // Transaction 1: Read all students
        transaction1 = await sequelize.transaction({
          isolationLevel: IsolationLevel.SERIALIZABLE,
        });

        const students1 = await Student.findAll({
          transaction: transaction1,
        });

        expect(students1).toHaveLength(1);

        // Transaction 2: Try to insert a new student
        transaction2 = await sequelize.transaction({
          isolationLevel: IsolationLevel.SERIALIZABLE,
        });

        // This should block or fail due to serialization
        const insertPromise = Student.create(
          {
            firstName: 'Jane',
            lastName: 'Smith',
            dateOfBirth: new Date('2010-02-01'),
            grade: '5',
            studentNumber: 'S002',
            gender: 'FEMALE' as any,
          },
          { transaction: transaction2 }
        );

        // Commit transaction 2 first
        await transaction2.commit();
        transaction2 = null;

        // Transaction 1 should still see only 1 student due to SERIALIZABLE
        const students2 = await Student.findAll({
          transaction: transaction1,
        });

        expect(students2).toHaveLength(1);

        await transaction1.commit();
        transaction1 = null;

        // After both transactions committed, we should see both students
        const finalStudents = await Student.findAll();
        expect(finalStudents).toHaveLength(2);
      } finally {
        if (transaction1) await transaction1.rollback();
        if (transaction2) await transaction2.rollback();
      }
    });

    it('should handle concurrent updates with SERIALIZABLE', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'S003',
        gender: 'MALE' as any,
      });

      let transaction1: Transaction | null = null;
      let transaction2: Transaction | null = null;

      try {
        transaction1 = await sequelize.transaction({
          isolationLevel: IsolationLevel.SERIALIZABLE,
        });

        transaction2 = await sequelize.transaction({
          isolationLevel: IsolationLevel.SERIALIZABLE,
        });

        // Both transactions try to update the same record
        const student1 = await Student.findByPk(student.id, {
          transaction: transaction1,
        });
        const student2 = await Student.findByPk(student.id, {
          transaction: transaction2,
        });

        if (student1) {
          student1.grade = '6';
          await student1.save({ transaction: transaction1 });
        }

        // Try to update in transaction2 - should detect conflict
        if (student2) {
          student2.grade = '7';
          // This should fail or be queued
          const updatePromise = student2.save({ transaction: transaction2 });

          // Commit transaction1 first
          await transaction1.commit();
          transaction1 = null;

          // Transaction2 update should fail with serialization error
          try {
            await updatePromise;
            await transaction2.commit();
            transaction2 = null;
            // If we get here without error, check the final value
            const finalStudent = await Student.findByPk(student.id);
            // One of the updates should win
            expect(['6', '7']).toContain(finalStudent?.grade);
          } catch (error: any) {
            // Expected serialization error
            expect(error.name).toMatch(/Serialization|Deadlock/i);
            await transaction2.rollback();
            transaction2 = null;
          }
        }
      } finally {
        if (transaction1) await transaction1.rollback();
        if (transaction2) await transaction2.rollback();
      }
    });
  });

  describe('READ_COMMITTED Isolation Level', () => {
    it('should allow non-repeatable reads with READ_COMMITTED', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'S004',
        gender: 'MALE' as any,
      });

      let transaction1: Transaction | null = null;
      let transaction2: Transaction | null = null;

      try {
        transaction1 = await sequelize.transaction({
          isolationLevel: IsolationLevel.READ_COMMITTED,
        });

        // Read initial value
        const student1 = await Student.findByPk(student.id, {
          transaction: transaction1,
        });
        expect(student1?.grade).toBe('5');

        // Another transaction updates the record
        transaction2 = await sequelize.transaction();
        const student2 = await Student.findByPk(student.id, {
          transaction: transaction2,
        });
        if (student2) {
          student2.grade = '6';
          await student2.save({ transaction: transaction2 });
        }
        await transaction2.commit();
        transaction2 = null;

        // Read again in transaction1 - should see updated value (non-repeatable read)
        const student3 = await Student.findByPk(student.id, {
          transaction: transaction1,
        });
        expect(student3?.grade).toBe('6');

        await transaction1.commit();
        transaction1 = null;
      } finally {
        if (transaction1) await transaction1.rollback();
        if (transaction2) await transaction2.rollback();
      }
    });
  });

  describe('Transaction Rollback', () => {
    it('should rollback all changes on error', async () => {
      let transaction: Transaction | null = null;

      try {
        transaction = await sequelize.transaction();

        // Create a student within transaction
        const student = await Student.create(
          {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: new Date('2010-01-01'),
            grade: '5',
            studentNumber: 'S005',
            gender: 'MALE' as any,
          },
          { transaction }
        );

        // Verify student exists in transaction
        const studentInTx = await Student.findByPk(student.id, { transaction });
        expect(studentInTx).toBeDefined();

        // Simulate an error
        throw new Error('Simulated error');
      } catch (error) {
        if (transaction) {
          await transaction.rollback();
          transaction = null;
        }
      }

      // Student should not exist after rollback
      const students = await Student.findAll();
      expect(students).toHaveLength(0);
    });

    it('should rollback audit logs with transaction', async () => {
      const initialAuditCount = await sequelize.models.AuditLog.count();
      let transaction: Transaction | null = null;

      try {
        transaction = await sequelize.transaction();

        // Create a student within transaction
        const student = await Student.create(
          {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: new Date('2010-01-01'),
            grade: '5',
            studentNumber: 'S006',
            gender: 'MALE' as any,
          },
          { transaction }
        );

        // Log audit within same transaction
        await auditService.logCreate(
          'Student',
          student.id,
          { userId: 'test-user', userName: 'Test User', userRole: 'NURSE' as any, timestamp: new Date() },
          { firstName: 'John', lastName: 'Doe' }
        );

        // Rollback the transaction
        await transaction.rollback();
        transaction = null;
      } catch (error) {
        if (transaction) {
          await transaction.rollback();
          transaction = null;
        }
      }

      // Verify no new audit logs were created
      const finalAuditCount = await sequelize.models.AuditLog.count();
      expect(finalAuditCount).toBe(initialAuditCount);
    });
  });

  describe('Concurrent Transaction Handling', () => {
    it('should handle multiple concurrent transactions', async () => {
      const concurrentCount = 5;
      const promises: Promise<any>[] = [];

      for (let i = 0; i < concurrentCount; i++) {
        promises.push(
          (async () => {
            const transaction = await sequelize.transaction();
            try {
              await Student.create(
                {
                  firstName: `Student${i}`,
                  lastName: 'Concurrent',
                  dateOfBirth: new Date('2010-01-01'),
                  grade: '5',
                  studentNumber: 'TEST',
        gender: 'MALE' as any,
                },
                { transaction }
              );
              await transaction.commit();
            } catch (error) {
              await transaction.rollback();
              throw error;
            }
          })()
        );
      }

      await Promise.all(promises);

      const students = await Student.findAll();
      expect(students).toHaveLength(concurrentCount);
    });

    it('should maintain data consistency under concurrent load', async () => {
      // Create a student
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      // Multiple transactions trying to update the same field
      const updateCount = 10;
      const promises: Promise<any>[] = [];

      for (let i = 0; i < updateCount; i++) {
        promises.push(
          (async () => {
            const transaction = await sequelize.transaction();
            try {
              const s = await Student.findByPk(student.id, {
                transaction,
                lock: transaction.LOCK.UPDATE,
              });
              if (s) {
                // Simulate some processing time
                await new Promise(resolve => setTimeout(resolve, 10));
                s.grade = String(6 + i);
                await s.save({ transaction });
              }
              await transaction.commit();
            } catch (error) {
              await transaction.rollback();
              // Retry on lock timeout
              throw error;
            }
          })()
        );
      }

      // Some may fail, but data should remain consistent
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;

      expect(successful).toBeGreaterThan(0);

      // Final student should have a valid grade
      const finalStudent = await Student.findByPk(student.id);
      expect(finalStudent).toBeDefined();
      expect(parseInt(finalStudent!.grade)).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Savepoint Support', () => {
    it('should support nested transactions with savepoints', async () => {
      let transaction: Transaction | null = null;

      try {
        transaction = await sequelize.transaction();

        // Create first student
        const student1 = await Student.create(
          {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: new Date('2010-01-01'),
            grade: '5',
            studentNumber: 'TEST',
        gender: 'MALE' as any,
          },
          { transaction }
        );

        // Create a savepoint
        const savepoint = await transaction.createSavepoint();

        try {
          // Create second student
          await Student.create(
            {
              firstName: 'Jane',
              lastName: 'Smith',
              dateOfBirth: new Date('2010-02-01'),
              grade: '5',
              studentNumber: 'TEST',
        gender: 'MALE' as any,
            },
            { transaction }
          );

          // Simulate error - rollback to savepoint
          throw new Error('Simulated error');
        } catch (error) {
          await transaction.rollbackToSavepoint(savepoint);
        }

        // Commit main transaction
        await transaction.commit();
        transaction = null;

        // Only first student should exist
        const students = await Student.findAll();
        expect(students).toHaveLength(1);
        expect(students[0].firstName).toBe('John');
      } finally {
        if (transaction) await transaction.rollback();
      }
    });
  });
});
