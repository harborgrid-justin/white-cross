/**
 * Medications Module Integration Tests
 * Tests medication management, administration, and compliance
 */

import {
  test,
  expect,
  createTestStudent,
  createTestMedication,
  verifyAuditLog,
} from '../helpers/test-client';
import { TEST_MEDICATIONS, getFutureDate, getPastDate } from '../helpers/test-data';

test.describe('Medications Module Integration', () => {
  test.describe('Medication CRUD Operations', () => {
    test('should create a new medication prescription', async ({ authenticatedContext }) => {
      // Create student first
      const student = await createTestStudent(authenticatedContext);

      // Create medication
      const medicationData = {
        ...TEST_MEDICATIONS.daily,
        studentId: student.id,
      };

      const response = await authenticatedContext.post('/api/v1/medications', {
        data: medicationData,
      });

      expect(response.ok()).toBeTruthy();
      const medication = await response.json();

      expect(medication.id).toBeDefined();
      expect(medication.studentId).toBe(student.id);
      expect(medication.medicationName).toBe(medicationData.medicationName);
      expect(medication.dosage).toBe(medicationData.dosage);
      expect(medication.frequency).toBe(medicationData.frequency);
      expect(medication.status).toBe('active');

      // Verify audit log
      await verifyAuditLog(
        authenticatedContext,
        'medication',
        medication.id,
        'created'
      );
    });

    test('should retrieve medication by ID', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const created = await createTestMedication(authenticatedContext, student.id);

      const response = await authenticatedContext.get(`/api/v1/medications/${created.id}`);

      expect(response.ok()).toBeTruthy();
      const medication = await response.json();

      expect(medication.id).toBe(created.id);
      expect(medication.studentId).toBe(student.id);
    });

    test('should update medication details', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const created = await createTestMedication(authenticatedContext, student.id);

      const updateData = {
        dosage: '15mg',
        instructions: 'Updated instructions',
      };

      const response = await authenticatedContext.put(`/api/v1/medications/${created.id}`, {
        data: updateData,
      });

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.dosage).toBe('15mg');
      expect(updated.instructions).toBe('Updated instructions');

      // Verify audit log
      await verifyAuditLog(
        authenticatedContext,
        'medication',
        updated.id,
        'updated'
      );
    });

    test('should discontinue medication', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const created = await createTestMedication(authenticatedContext, student.id);

      const response = await authenticatedContext.put(
        `/api/v1/medications/${created.id}/discontinue`,
        {
          data: {
            reason: 'Treatment complete',
            discontinuedDate: new Date().toISOString(),
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const medication = await response.json();

      expect(medication.status).toBe('discontinued');
      expect(medication.discontinuedDate).toBeDefined();
    });

    test('should list all medications for a student', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // Create multiple medications
      await createTestMedication(authenticatedContext, student.id);
      await authenticatedContext.post('/api/v1/medications', {
        data: { ...TEST_MEDICATIONS.asNeeded, studentId: student.id },
      });

      const response = await authenticatedContext.get(
        `/api/v1/students/${student.id}/medications`
      );

      expect(response.ok()).toBeTruthy();
      const medications = await response.json();

      expect(Array.isArray(medications)).toBeTruthy();
      expect(medications.length).toBeGreaterThanOrEqual(2);
    });

    test('should filter medications by status', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/medications', {
        params: {
          status: 'active',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.medications).toBeDefined();
      data.medications.forEach((med: any) => {
        expect(med.status).toBe('active');
      });
    });
  });

  test.describe('Medication Administration', () => {
    test('should record medication administration', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const medication = await createTestMedication(authenticatedContext, student.id);

      const administrationData = {
        medicationId: medication.id,
        studentId: student.id,
        administeredAt: new Date().toISOString(),
        dosageGiven: medication.dosage,
        method: 'oral',
        notes: 'Medication administered without issues',
      };

      const response = await authenticatedContext.post('/api/v1/medication-administrations', {
        data: administrationData,
      });

      expect(response.ok()).toBeTruthy();
      const administration = await response.json();

      expect(administration.id).toBeDefined();
      expect(administration.medicationId).toBe(medication.id);
      expect(administration.studentId).toBe(student.id);
      expect(administration.status).toBe('completed');

      // Verify audit log for PHI access
      await verifyAuditLog(
        authenticatedContext,
        'medication_administration',
        administration.id,
        'created'
      );
    });

    test('should record missed medication dose', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const medication = await createTestMedication(authenticatedContext, student.id);

      const missedData = {
        medicationId: medication.id,
        studentId: student.id,
        scheduledTime: new Date().toISOString(),
        status: 'missed',
        reason: 'Student absent',
      };

      const response = await authenticatedContext.post('/api/v1/medication-administrations', {
        data: missedData,
      });

      expect(response.ok()).toBeTruthy();
      const administration = await response.json();

      expect(administration.status).toBe('missed');
      expect(administration.reason).toBe('Student absent');
    });

    test('should record refused medication', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const medication = await createTestMedication(authenticatedContext, student.id);

      const refusedData = {
        medicationId: medication.id,
        studentId: student.id,
        scheduledTime: new Date().toISOString(),
        status: 'refused',
        reason: 'Student refused to take medication',
      };

      const response = await authenticatedContext.post('/api/v1/medication-administrations', {
        data: refusedData,
      });

      expect(response.ok()).toBeTruthy();
      const administration = await response.json();

      expect(administration.status).toBe('refused');
    });

    test('should retrieve medication administration history', async ({
      authenticatedContext,
    }) => {
      const student = await createTestStudent(authenticatedContext);
      const medication = await createTestMedication(authenticatedContext, student.id);

      // Record multiple administrations
      for (let i = 0; i < 3; i++) {
        await authenticatedContext.post('/api/v1/medication-administrations', {
          data: {
            medicationId: medication.id,
            studentId: student.id,
            administeredAt: new Date().toISOString(),
            dosageGiven: medication.dosage,
            status: 'completed',
          },
        });
      }

      const response = await authenticatedContext.get(
        `/api/v1/medications/${medication.id}/administrations`
      );

      expect(response.ok()).toBeTruthy();
      const administrations = await response.json();

      expect(Array.isArray(administrations)).toBeTruthy();
      expect(administrations.length).toBeGreaterThanOrEqual(3);
    });
  });

  test.describe('Medication Schedule and Due Medications', () => {
    test('should retrieve due medications for today', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/medications/due', {
        params: {
          date: new Date().toISOString().split('T')[0],
        },
      });

      expect(response.ok()).toBeTruthy();
      const dueMedications = await response.json();

      expect(Array.isArray(dueMedications)).toBeTruthy();
      // All due medications should be active
      dueMedications.forEach((med: any) => {
        expect(med.status).toBe('active');
      });
    });

    test('should retrieve medication schedule for student', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      await createTestMedication(authenticatedContext, student.id);

      const response = await authenticatedContext.get(
        `/api/v1/students/${student.id}/medication-schedule`
      );

      expect(response.ok()).toBeTruthy();
      const schedule = await response.json();

      expect(Array.isArray(schedule)).toBeTruthy();
    });

    test('should retrieve overdue medications', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/medications/overdue');

      expect(response.ok()).toBeTruthy();
      const overdueMedications = await response.json();

      expect(Array.isArray(overdueMedications)).toBeTruthy();
    });
  });

  test.describe('Medication Inventory', () => {
    test('should track medication inventory', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const medication = await createTestMedication(authenticatedContext, student.id);

      const inventoryData = {
        medicationId: medication.id,
        quantity: 30,
        unit: 'tablets',
        lotNumber: 'LOT123456',
        expirationDate: getFutureDate(365),
        location: 'Cabinet A',
      };

      const response = await authenticatedContext.post('/api/v1/medication-inventory', {
        data: inventoryData,
      });

      expect(response.ok()).toBeTruthy();
      const inventory = await response.json();

      expect(inventory.medicationId).toBe(medication.id);
      expect(inventory.quantity).toBe(30);
    });

    test('should update medication inventory after administration', async ({
      authenticatedContext,
    }) => {
      const student = await createTestStudent(authenticatedContext);
      const medication = await createTestMedication(authenticatedContext, student.id);

      // Add inventory
      const inventoryResponse = await authenticatedContext.post('/api/v1/medication-inventory', {
        data: {
          medicationId: medication.id,
          quantity: 30,
          unit: 'tablets',
        },
      });
      const inventory = await inventoryResponse.json();

      // Record administration
      await authenticatedContext.post('/api/v1/medication-administrations', {
        data: {
          medicationId: medication.id,
          studentId: student.id,
          administeredAt: new Date().toISOString(),
          dosageGiven: '1 tablet',
          status: 'completed',
        },
      });

      // Check inventory updated
      const checkResponse = await authenticatedContext.get(
        `/api/v1/medication-inventory/${inventory.id}`
      );
      const updatedInventory = await checkResponse.json();

      expect(updatedInventory.quantity).toBe(29);
    });

    test('should alert on low medication inventory', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/medication-inventory/low-stock', {
        params: {
          threshold: 10,
        },
      });

      expect(response.ok()).toBeTruthy();
      const lowStockItems = await response.json();

      expect(Array.isArray(lowStockItems)).toBeTruthy();
    });

    test('should alert on expiring medications', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/medication-inventory/expiring', {
        params: {
          daysFromNow: 30,
        },
      });

      expect(response.ok()).toBeTruthy();
      const expiringItems = await response.json();

      expect(Array.isArray(expiringItems)).toBeTruthy();
    });
  });

  test.describe('Medication Reports and Compliance', () => {
    test('should generate medication administration report', async ({ authenticatedContext }) => {
      const startDate = getPastDate(30);
      const endDate = new Date().toISOString();

      const response = await authenticatedContext.get('/api/v1/medications/reports/administration', {
        params: {
          startDate,
          endDate,
        },
      });

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.totalAdministrations).toBeDefined();
      expect(report.completed).toBeDefined();
      expect(report.missed).toBeDefined();
      expect(report.refused).toBeDefined();
    });

    test('should generate medication compliance report for student', async ({
      authenticatedContext,
    }) => {
      const student = await createTestStudent(authenticatedContext);

      const response = await authenticatedContext.get(
        `/api/v1/students/${student.id}/medication-compliance`,
        {
          params: {
            startDate: getPastDate(30),
            endDate: new Date().toISOString(),
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const compliance = await response.json();

      expect(compliance.complianceRate).toBeDefined();
      expect(typeof compliance.complianceRate).toBe('number');
    });
  });

  test.describe('Validation and Error Handling', () => {
    test('should reject medication creation without required fields', async ({
      authenticatedContext,
    }) => {
      const invalidData = {
        medicationName: 'Test Med',
        // Missing studentId, dosage, frequency, etc.
      };

      const response = await authenticatedContext.post('/api/v1/medications', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should reject invalid frequency', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const invalidData = {
        ...TEST_MEDICATIONS.daily,
        studentId: student.id,
        frequency: 'invalid_frequency',
      };

      const response = await authenticatedContext.post('/api/v1/medications', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should prevent duplicate medication administration', async ({
      authenticatedContext,
    }) => {
      const student = await createTestStudent(authenticatedContext);
      const medication = await createTestMedication(authenticatedContext, student.id);

      const administrationData = {
        medicationId: medication.id,
        studentId: student.id,
        administeredAt: new Date().toISOString(),
        dosageGiven: medication.dosage,
        status: 'completed',
      };

      // First administration should succeed
      const firstResponse = await authenticatedContext.post(
        '/api/v1/medication-administrations',
        {
          data: administrationData,
        }
      );
      expect(firstResponse.ok()).toBeTruthy();

      // Duplicate administration (within same time window) should fail
      const duplicateResponse = await authenticatedContext.post(
        '/api/v1/medication-administrations',
        {
          data: administrationData,
        }
      );
      expect(duplicateResponse.ok()).toBeFalsy();
    });

    test('should return 404 for non-existent medication', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get(
        '/api/v1/medications/00000000-0000-0000-0000-000000000000'
      );

      expect(response.status()).toBe(404);
    });
  });
});
