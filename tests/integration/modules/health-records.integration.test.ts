/**
 * Health Records Module Integration Tests
 * Tests complete health records CRUD operations and workflows
 */

import { test, expect } from '../helpers/test-client';
import {
  TEST_STUDENTS,
  TEST_HEALTH_RECORDS,
  generateStudentId,
  getPastDate,
} from '../helpers/test-data';
import { createTestStudent } from '../helpers/test-client';

test.describe('Health Records Module Integration', () => {
  test.describe('Vital Signs Records', () => {
    let studentId: string;

    test.beforeEach(async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      studentId = student.id;
    });

    test('should create vital signs record', async ({ authenticatedContext }) => {
      const recordData = {
        ...TEST_HEALTH_RECORDS.vitalSigns,
        studentId,
        recordDate: new Date().toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/health-records', {
        data: recordData,
      });

      expect(response.ok()).toBeTruthy();
      const record = await response.json();

      expect(record.id).toBeDefined();
      expect(record.studentId).toBe(studentId);
      expect(record.recordType).toBe('vital_signs');
      expect(record.vitalSigns).toBeDefined();
      expect(record.vitalSigns.temperature).toBe(98.6);
      expect(record.vitalSigns.heartRate).toBe(72);
    });

    test('should retrieve vital signs record by ID', async ({ authenticatedContext }) => {
      // Create record
      const createResponse = await authenticatedContext.post('/api/v1/health-records', {
        data: {
          ...TEST_HEALTH_RECORDS.vitalSigns,
          studentId,
          recordDate: new Date().toISOString(),
        },
      });
      const created = await createResponse.json();

      // Retrieve record
      const response = await authenticatedContext.get(
        `/api/v1/health-records/${created.id}`
      );

      expect(response.ok()).toBeTruthy();
      const record = await response.json();

      expect(record.id).toBe(created.id);
      expect(record.studentId).toBe(studentId);
      expect(record.recordType).toBe('vital_signs');
    });

    test('should update vital signs record', async ({ authenticatedContext }) => {
      // Create record
      const createResponse = await authenticatedContext.post('/api/v1/health-records', {
        data: {
          ...TEST_HEALTH_RECORDS.vitalSigns,
          studentId,
          recordDate: new Date().toISOString(),
        },
      });
      const created = await createResponse.json();

      // Update record
      const updateData = {
        vitalSigns: {
          temperature: 99.2,
          heartRate: 80,
          bloodPressure: '125/85',
          respiratoryRate: 18,
          oxygenSaturation: 97,
        },
        notes: 'Updated vital signs - slightly elevated',
      };

      const response = await authenticatedContext.put(
        `/api/v1/health-records/${created.id}`,
        {
          data: updateData,
        }
      );

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.vitalSigns.temperature).toBe(99.2);
      expect(updated.vitalSigns.heartRate).toBe(80);
      expect(updated.notes).toContain('elevated');
    });

    test('should list all vital signs for student', async ({ authenticatedContext }) => {
      // Create multiple records
      await authenticatedContext.post('/api/v1/health-records', {
        data: {
          ...TEST_HEALTH_RECORDS.vitalSigns,
          studentId,
          recordDate: getPastDate(5),
        },
      });

      await authenticatedContext.post('/api/v1/health-records', {
        data: {
          ...TEST_HEALTH_RECORDS.vitalSigns,
          studentId,
          recordDate: getPastDate(1),
        },
      });

      // List records
      const response = await authenticatedContext.get(
        `/api/v1/students/${studentId}/health-records`,
        {
          params: {
            recordType: 'vital_signs',
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const records = await response.json();

      expect(Array.isArray(records)).toBeTruthy();
      expect(records.length).toBeGreaterThanOrEqual(2);
      records.forEach((record: any) => {
        expect(record.recordType).toBe('vital_signs');
        expect(record.studentId).toBe(studentId);
      });
    });
  });

  test.describe('Immunization Records', () => {
    let studentId: string;

    test.beforeEach(async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      studentId = student.id;
    });

    test('should create immunization record', async ({ authenticatedContext }) => {
      const recordData = {
        ...TEST_HEALTH_RECORDS.immunization,
        studentId,
        recordDate: new Date().toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/health-records', {
        data: recordData,
      });

      expect(response.ok()).toBeTruthy();
      const record = await response.json();

      expect(record.id).toBeDefined();
      expect(record.recordType).toBe('immunization');
      expect(record.immunizationData).toBeDefined();
      expect(record.immunizationData.vaccineName).toBe('Influenza');
      expect(record.immunizationData.lotNumber).toBe('LOT123456');
    });

    test('should retrieve immunization history for student', async ({
      authenticatedContext,
    }) => {
      // Create multiple immunization records
      const vaccines = ['Influenza', 'Tdap', 'Meningococcal'];

      for (const vaccine of vaccines) {
        await authenticatedContext.post('/api/v1/health-records', {
          data: {
            recordType: 'immunization',
            studentId,
            recordDate: getPastDate(Math.floor(Math.random() * 365)),
            immunizationData: {
              vaccineName: vaccine,
              manufacturer: 'Test Pharma',
              lotNumber: `LOT${Math.random().toString().substr(2, 6)}`,
              expirationDate: '2025-12-31',
              site: 'left_arm',
              route: 'intramuscular',
            },
            notes: `${vaccine} vaccine administered`,
          },
        });
      }

      // Retrieve immunization history
      const response = await authenticatedContext.get(
        `/api/v1/students/${studentId}/health-records`,
        {
          params: {
            recordType: 'immunization',
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const records = await response.json();

      expect(records.length).toBeGreaterThanOrEqual(3);
      records.forEach((record: any) => {
        expect(record.recordType).toBe('immunization');
        expect(record.immunizationData).toBeDefined();
      });
    });

    test('should validate immunization compliance', async ({
      authenticatedContext,
    }) => {
      // Create required vaccines
      const requiredVaccines = ['MMR', 'Tdap', 'Varicella'];

      for (const vaccine of requiredVaccines) {
        await authenticatedContext.post('/api/v1/health-records', {
          data: {
            recordType: 'immunization',
            studentId,
            recordDate: getPastDate(30),
            immunizationData: {
              vaccineName: vaccine,
              manufacturer: 'Test Pharma',
              lotNumber: `LOT${Math.random().toString().substr(2, 6)}`,
              expirationDate: '2025-12-31',
              site: 'left_arm',
              route: 'intramuscular',
            },
            notes: `${vaccine} vaccine administered`,
          },
        });
      }

      // Check compliance
      const response = await authenticatedContext.get(
        `/api/v1/students/${studentId}/immunization-compliance`
      );

      expect(response.ok()).toBeTruthy();
      const compliance = await response.json();

      expect(compliance.studentId).toBe(studentId);
      expect(compliance.compliant).toBeDefined();
      expect(compliance.vaccines).toBeDefined();
    });
  });

  test.describe('Injury Records', () => {
    let studentId: string;

    test.beforeEach(async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      studentId = student.id;
    });

    test('should create injury record', async ({ authenticatedContext }) => {
      const recordData = {
        ...TEST_HEALTH_RECORDS.injury,
        studentId,
        recordDate: new Date().toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/health-records', {
        data: recordData,
      });

      expect(response.ok()).toBeTruthy();
      const record = await response.json();

      expect(record.id).toBeDefined();
      expect(record.recordType).toBe('injury');
      expect(record.injuryData).toBeDefined();
      expect(record.injuryData.type).toBe('laceration');
      expect(record.injuryData.bodyPart).toBe('knee');
      expect(record.injuryData.severity).toBe('minor');
    });

    test('should track injury treatment and follow-up', async ({
      authenticatedContext,
    }) => {
      // Create injury record
      const createResponse = await authenticatedContext.post('/api/v1/health-records', {
        data: {
          ...TEST_HEALTH_RECORDS.injury,
          studentId,
          recordDate: getPastDate(7),
        },
      });
      const injury = await createResponse.json();

      // Add follow-up visit
      const followUpResponse = await authenticatedContext.post('/api/v1/health-records', {
        data: {
          recordType: 'follow_up',
          studentId,
          recordDate: new Date().toISOString(),
          relatedRecordId: injury.id,
          notes: 'Follow-up: Wound healing well, no signs of infection',
        },
      });

      expect(followUpResponse.ok()).toBeTruthy();
      const followUp = await followUpResponse.json();

      expect(followUp.recordType).toBe('follow_up');
      expect(followUp.relatedRecordId).toBe(injury.id);
    });

    test('should generate injury report', async ({ authenticatedContext }) => {
      // Create multiple injury records
      for (let i = 0; i < 5; i++) {
        await authenticatedContext.post('/api/v1/health-records', {
          data: {
            recordType: 'injury',
            studentId,
            recordDate: getPastDate(i * 30),
            injuryData: {
              type: ['laceration', 'bruise', 'sprain'][i % 3],
              bodyPart: ['knee', 'arm', 'ankle'][i % 3],
              severity: 'minor',
              treatment: 'First aid provided',
            },
            notes: `Injury ${i + 1}`,
          },
        });
      }

      // Generate injury report
      const response = await authenticatedContext.get(
        `/api/v1/students/${studentId}/injury-report`,
        {
          params: {
            startDate: getPastDate(365),
            endDate: new Date().toISOString(),
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.studentId).toBe(studentId);
      expect(report.totalInjuries).toBeGreaterThanOrEqual(5);
      expect(report.injuriesByType).toBeDefined();
    });
  });

  test.describe('Medical History', () => {
    let studentId: string;

    test.beforeEach(async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      studentId = student.id;
    });

    test('should retrieve complete medical history', async ({
      authenticatedContext,
    }) => {
      // Create various health records
      await authenticatedContext.post('/api/v1/health-records', {
        data: {
          ...TEST_HEALTH_RECORDS.vitalSigns,
          studentId,
          recordDate: getPastDate(30),
        },
      });

      await authenticatedContext.post('/api/v1/health-records', {
        data: {
          ...TEST_HEALTH_RECORDS.immunization,
          studentId,
          recordDate: getPastDate(90),
        },
      });

      await authenticatedContext.post('/api/v1/health-records', {
        data: {
          ...TEST_HEALTH_RECORDS.injury,
          studentId,
          recordDate: getPastDate(10),
        },
      });

      // Retrieve complete history
      const response = await authenticatedContext.get(
        `/api/v1/students/${studentId}/medical-history`
      );

      expect(response.ok()).toBeTruthy();
      const history = await response.json();

      expect(history.studentId).toBe(studentId);
      expect(history.records).toBeDefined();
      expect(history.records.length).toBeGreaterThanOrEqual(3);

      const recordTypes = history.records.map((r: any) => r.recordType);
      expect(recordTypes).toContain('vital_signs');
      expect(recordTypes).toContain('immunization');
      expect(recordTypes).toContain('injury');
    });

    test('should filter medical history by date range', async ({
      authenticatedContext,
    }) => {
      // Create records across different dates
      await authenticatedContext.post('/api/v1/health-records', {
        data: {
          ...TEST_HEALTH_RECORDS.vitalSigns,
          studentId,
          recordDate: getPastDate(365),
        },
      });

      await authenticatedContext.post('/api/v1/health-records', {
        data: {
          ...TEST_HEALTH_RECORDS.vitalSigns,
          studentId,
          recordDate: getPastDate(30),
        },
      });

      await authenticatedContext.post('/api/v1/health-records', {
        data: {
          ...TEST_HEALTH_RECORDS.vitalSigns,
          studentId,
          recordDate: getPastDate(7),
        },
      });

      // Filter by last 60 days
      const response = await authenticatedContext.get(
        `/api/v1/students/${studentId}/medical-history`,
        {
          params: {
            startDate: getPastDate(60),
            endDate: new Date().toISOString(),
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const history = await response.json();

      expect(history.records.length).toBeGreaterThanOrEqual(2);
      // Should not include the 365 days old record
      history.records.forEach((record: any) => {
        const recordDate = new Date(record.recordDate);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        expect(recordDate.getTime()).toBeGreaterThanOrEqual(sixtyDaysAgo.getTime());
      });
    });

    test('should search medical history by keywords', async ({
      authenticatedContext,
    }) => {
      // Create record with specific keywords
      await authenticatedContext.post('/api/v1/health-records', {
        data: {
          recordType: 'vital_signs',
          studentId,
          recordDate: new Date().toISOString(),
          vitalSigns: {
            temperature: 101.5,
            heartRate: 95,
            bloodPressure: '120/80',
          },
          notes: 'Student has fever, sent home for rest',
        },
      });

      // Search for keyword
      const response = await authenticatedContext.get(
        `/api/v1/students/${studentId}/medical-history/search`,
        {
          params: {
            query: 'fever',
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const results = await response.json();

      expect(results.length).toBeGreaterThan(0);
      const found = results.find((r: any) => r.notes.includes('fever'));
      expect(found).toBeDefined();
    });
  });

  test.describe('Validation and Error Handling', () => {
    let studentId: string;

    test.beforeEach(async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      studentId = student.id;
    });

    test('should reject health record with missing required fields', async ({
      authenticatedContext,
    }) => {
      const invalidData = {
        studentId,
        // Missing recordType and recordDate
      };

      const response = await authenticatedContext.post('/api/v1/health-records', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should reject invalid record type', async ({ authenticatedContext }) => {
      const invalidData = {
        studentId,
        recordType: 'invalid_type',
        recordDate: new Date().toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/health-records', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should reject future record date', async ({ authenticatedContext }) => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const invalidData = {
        ...TEST_HEALTH_RECORDS.vitalSigns,
        studentId,
        recordDate: futureDate.toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/health-records', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should return 404 for non-existent health record', async ({
      authenticatedContext,
    }) => {
      const response = await authenticatedContext.get(
        '/api/v1/health-records/00000000-0000-0000-0000-000000000000'
      );

      expect(response.status()).toBe(404);
    });

    test('should reject health record for non-existent student', async ({
      authenticatedContext,
    }) => {
      const invalidData = {
        ...TEST_HEALTH_RECORDS.vitalSigns,
        studentId: '00000000-0000-0000-0000-000000000000',
        recordDate: new Date().toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/health-records', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(404);
    });
  });
});
