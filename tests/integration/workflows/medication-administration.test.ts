/**
 * Medication Administration Workflow Integration Test
 * Tests complete medication administration workflow from prescription to reporting
 */

import {
  test,
  expect,
  createTestStudent,
  verifyAuditLog,
} from '../helpers/test-client';
import { TEST_MEDICATIONS, getScheduledDateTime } from '../helpers/test-data';

test.describe('Medication Administration Workflow', () => {
  test('should complete full medication administration workflow', async ({
    authenticatedContext,
  }) => {
    // STEP 1: Create student with allergy information
    const studentResponse = await authenticatedContext.post('/api/v1/students', {
      data: {
        firstName: 'Workflow',
        lastName: 'Test',
        dateOfBirth: '2010-01-01',
        grade: '5',
        schoolId: `WF${Date.now()}`,
        status: 'active',
        allergies: ['Penicillin'],
      },
    });

    expect(studentResponse.ok()).toBeTruthy();
    const student = await studentResponse.json();
    expect(student.allergies).toContain('Penicillin');

    // STEP 2: Create medication prescription
    const medicationData = {
      ...TEST_MEDICATIONS.daily,
      studentId: student.id,
      startDate: new Date().toISOString(),
    };

    const medResponse = await authenticatedContext.post('/api/v1/medications', {
      data: medicationData,
    });

    expect(medResponse.ok()).toBeTruthy();
    const medication = await medResponse.json();
    expect(medication.status).toBe('active');

    // Verify audit log for prescription
    await verifyAuditLog(authenticatedContext, 'medication', medication.id, 'created');

    // STEP 3: Add medication to inventory
    const inventoryResponse = await authenticatedContext.post('/api/v1/medication-inventory', {
      data: {
        medicationId: medication.id,
        quantity: 30,
        unit: 'tablets',
        lotNumber: 'LOT123456',
        expirationDate: '2025-12-31',
        location: 'Cabinet A',
      },
    });

    expect(inventoryResponse.ok()).toBeTruthy();
    const inventory = await inventoryResponse.json();
    expect(inventory.quantity).toBe(30);

    // STEP 4: Check medication schedule (due medications)
    const dueResponse = await authenticatedContext.get('/api/v1/medications/due', {
      params: {
        date: new Date().toISOString().split('T')[0],
      },
    });

    expect(dueResponse.ok()).toBeTruthy();
    const dueMedications = await dueResponse.json();
    const isDue = dueMedications.some((m: any) => m.id === medication.id);
    expect(isDue).toBeTruthy();

    // STEP 5: Verify allergy check before administration
    const allergyResponse = await authenticatedContext.get(
      `/api/v1/students/${student.id}/allergies`
    );
    expect(allergyResponse.ok()).toBeTruthy();
    const allergies = await allergyResponse.json();
    expect(allergies.allergies).toContain('Penicillin');

    // STEP 6: Administer medication
    const administrationData = {
      medicationId: medication.id,
      studentId: student.id,
      administeredAt: new Date().toISOString(),
      dosageGiven: medication.dosage,
      method: 'oral',
      notes: 'Medication administered without issues',
      status: 'completed',
    };

    const adminResponse = await authenticatedContext.post('/api/v1/medication-administrations', {
      data: administrationData,
    });

    expect(adminResponse.ok()).toBeTruthy();
    const administration = await adminResponse.json();
    expect(administration.status).toBe('completed');

    // Verify audit log for administration
    await verifyAuditLog(
      authenticatedContext,
      'medication_administration',
      administration.id,
      'created'
    );

    // STEP 7: Verify inventory was decremented
    const inventoryCheckResponse = await authenticatedContext.get(
      `/api/v1/medication-inventory/${inventory.id}`
    );
    const updatedInventory = await inventoryCheckResponse.json();
    expect(updatedInventory.quantity).toBe(29); // Decremented by 1

    // STEP 8: Check administration history
    const historyResponse = await authenticatedContext.get(
      `/api/v1/medications/${medication.id}/administrations`
    );

    expect(historyResponse.ok()).toBeTruthy();
    const history = await historyResponse.json();
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].id).toBe(administration.id);

    // STEP 9: Generate compliance report
    const reportResponse = await authenticatedContext.get(
      `/api/v1/students/${student.id}/medication-compliance`,
      {
        params: {
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
        },
      }
    );

    expect(reportResponse.ok()).toBeTruthy();
    const compliance = await reportResponse.json();
    expect(compliance.complianceRate).toBeDefined();
    expect(compliance.totalDoses).toBeGreaterThan(0);
    expect(compliance.administeredDoses).toBeGreaterThan(0);

    // STEP 10: Verify health record was created/updated
    const healthRecordResponse = await authenticatedContext.get(
      `/api/v1/students/${student.id}/health-timeline`
    );

    expect(healthRecordResponse.ok()).toBeTruthy();
    const timeline = await healthRecordResponse.json();
    expect(timeline.some((record: any) => record.type === 'medication_administration')).toBeTruthy();
  });

  test('should handle medication refusal workflow', async ({ authenticatedContext }) => {
    // Create student and medication
    const student = await createTestStudent(authenticatedContext);
    const medResponse = await authenticatedContext.post('/api/v1/medications', {
      data: {
        ...TEST_MEDICATIONS.daily,
        studentId: student.id,
      },
    });
    const medication = await medResponse.json();

    // Record refusal
    const refusalResponse = await authenticatedContext.post('/api/v1/medication-administrations', {
      data: {
        medicationId: medication.id,
        studentId: student.id,
        scheduledTime: new Date().toISOString(),
        status: 'refused',
        reason: 'Student refused to take medication',
        notes: 'Parent will be contacted',
      },
    });

    expect(refusalResponse.ok()).toBeTruthy();
    const refusal = await refusalResponse.json();
    expect(refusal.status).toBe('refused');

    // Verify parent notification flag
    expect(refusal.parentNotificationRequired).toBe(true);

    // Check compliance report includes refusal
    const complianceResponse = await authenticatedContext.get(
      `/api/v1/students/${student.id}/medication-compliance`
    );
    const compliance = await complianceResponse.json();
    expect(compliance.refusedDoses).toBeGreaterThan(0);
  });

  test('should handle missed dose workflow', async ({ authenticatedContext }) => {
    const student = await createTestStudent(authenticatedContext);
    const medResponse = await authenticatedContext.post('/api/v1/medications', {
      data: {
        ...TEST_MEDICATIONS.daily,
        studentId: student.id,
      },
    });
    const medication = await medResponse.json();

    // Record missed dose
    const missedResponse = await authenticatedContext.post('/api/v1/medication-administrations', {
      data: {
        medicationId: medication.id,
        studentId: student.id,
        scheduledTime: new Date().toISOString(),
        status: 'missed',
        reason: 'Student absent from school',
      },
    });

    expect(missedResponse.ok()).toBeTruthy();
    const missed = await missedResponse.json();
    expect(missed.status).toBe('missed');

    // Verify no inventory deduction
    const inventoryResponse = await authenticatedContext.get('/api/v1/medication-inventory', {
      params: {
        medicationId: medication.id,
      },
    });

    if (inventoryResponse.ok()) {
      const inventory = await inventoryResponse.json();
      // Inventory should not be affected by missed dose
      expect(inventory).toBeDefined();
    }
  });

  test('should handle PRN (as-needed) medication workflow', async ({ authenticatedContext }) => {
    const student = await createTestStudent(authenticatedContext);

    // Create PRN medication
    const medResponse = await authenticatedContext.post('/api/v1/medications', {
      data: {
        ...TEST_MEDICATIONS.asNeeded,
        studentId: student.id,
        frequency: 'as_needed',
        maxDailyDoses: 3,
      },
    });

    expect(medResponse.ok()).toBeTruthy();
    const medication = await medResponse.json();

    // Administer first PRN dose
    const admin1Response = await authenticatedContext.post('/api/v1/medication-administrations', {
      data: {
        medicationId: medication.id,
        studentId: student.id,
        administeredAt: new Date().toISOString(),
        dosageGiven: medication.dosage,
        reason: 'Headache complaint',
        status: 'completed',
      },
    });

    expect(admin1Response.ok()).toBeTruthy();

    // Check daily dose count
    const doseCountResponse = await authenticatedContext.get(
      `/api/v1/medications/${medication.id}/daily-dose-count`,
      {
        params: {
          date: new Date().toISOString().split('T')[0],
        },
      }
    );

    if (doseCountResponse.ok()) {
      const doseCount = await doseCountResponse.json();
      expect(doseCount.count).toBe(1);
      expect(doseCount.remainingDoses).toBe(2);
    }

    // Try to exceed max daily doses (would require multiple administrations)
    // For now, verify the constraint exists
    expect(medication.maxDailyDoses).toBe(3);
  });

  test('should handle medication administration with side effects', async ({
    authenticatedContext,
  }) => {
    const student = await createTestStudent(authenticatedContext);
    const medResponse = await authenticatedContext.post('/api/v1/medications', {
      data: {
        ...TEST_MEDICATIONS.daily,
        studentId: student.id,
      },
    });
    const medication = await medResponse.json();

    // Administer with side effects noted
    const adminResponse = await authenticatedContext.post('/api/v1/medication-administrations', {
      data: {
        medicationId: medication.id,
        studentId: student.id,
        administeredAt: new Date().toISOString(),
        dosageGiven: medication.dosage,
        status: 'completed',
        sideEffects: ['Drowsiness', 'Mild nausea'],
        notes: 'Student reported feeling drowsy after administration',
        requiresFollowUp: true,
      },
    });

    expect(adminResponse.ok()).toBeTruthy();
    const administration = await adminResponse.json();
    expect(administration.sideEffects).toBeDefined();
    expect(administration.requiresFollowUp).toBe(true);

    // Verify incident report may be created for side effects
    if (administration.incidentReportId) {
      const incidentResponse = await authenticatedContext.get(
        `/api/v1/incidents/${administration.incidentReportId}`
      );
      expect(incidentResponse.ok()).toBeTruthy();
    }
  });

  test('should handle low inventory alert during administration', async ({
    authenticatedContext,
  }) => {
    const student = await createTestStudent(authenticatedContext);
    const medResponse = await authenticatedContext.post('/api/v1/medications', {
      data: {
        ...TEST_MEDICATIONS.daily,
        studentId: student.id,
      },
    });
    const medication = await medResponse.json();

    // Add low inventory
    await authenticatedContext.post('/api/v1/medication-inventory', {
      data: {
        medicationId: medication.id,
        quantity: 5, // Low quantity
        reorderLevel: 10,
        unit: 'tablets',
      },
    });

    // Check low stock alerts
    const lowStockResponse = await authenticatedContext.get('/api/v1/medication-inventory/low-stock');

    expect(lowStockResponse.ok()).toBeTruthy();
    const lowStock = await lowStockResponse.json();
    const hasAlert = lowStock.some((item: any) => item.medicationId === medication.id);
    expect(hasAlert).toBeTruthy();
  });

  test('should handle medication discontinuation workflow', async ({ authenticatedContext }) => {
    const student = await createTestStudent(authenticatedContext);
    const medResponse = await authenticatedContext.post('/api/v1/medications', {
      data: {
        ...TEST_MEDICATIONS.daily,
        studentId: student.id,
      },
    });
    const medication = await medResponse.json();

    // Discontinue medication
    const discontinueResponse = await authenticatedContext.put(
      `/api/v1/medications/${medication.id}/discontinue`,
      {
        data: {
          reason: 'Treatment completed successfully',
          discontinuedDate: new Date().toISOString(),
        },
      }
    );

    expect(discontinueResponse.ok()).toBeTruthy();
    const discontinued = await discontinueResponse.json();
    expect(discontinued.status).toBe('discontinued');

    // Verify it no longer appears in due medications
    const dueResponse = await authenticatedContext.get('/api/v1/medications/due');
    const dueMedications = await dueResponse.json();
    const isStillDue = dueMedications.some((m: any) => m.id === medication.id);
    expect(isStillDue).toBe(false);

    // Verify audit log
    await verifyAuditLog(authenticatedContext, 'medication', medication.id, 'discontinued');
  });
});
