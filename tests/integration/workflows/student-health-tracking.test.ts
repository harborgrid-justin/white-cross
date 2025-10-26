/**
 * Student Health Tracking Workflow Integration Test
 * Tests comprehensive student health monitoring and management workflow
 */

import { test, expect } from '../helpers/test-client';
import { createTestStudent } from '../helpers/test-client';
import {
  TEST_MEDICATIONS,
  TEST_HEALTH_RECORDS,
  TEST_APPOINTMENTS,
  TEST_INCIDENTS,
  getFutureDate,
  getPastDate,
  getScheduledDateTime,
} from '../helpers/test-data';

test.describe('Student Health Tracking Workflow', () => {
  test('should track complete student health journey', async ({ authenticatedContext }) => {
    // 1. Enroll student with medical history
    const studentData = {
      firstName: 'Complete',
      lastName: 'Health',
      dateOfBirth: '2010-06-15',
      grade: '8',
      schoolId: `HEALTH${Date.now()}`,
      status: 'active',
      allergies: ['Penicillin'],
      medicalConditions: ['Asthma'],
      dietaryRestrictions: ['Lactose Intolerant'],
    };

    const studentResponse = await authenticatedContext.post('/api/v1/students', {
      data: studentData,
    });
    expect(studentResponse.ok()).toBeTruthy();
    const student = await studentResponse.json();
    expect(student.id).toBeDefined();

    // 2. Add emergency contacts
    const emergencyContacts = [
      {
        studentId: student.id,
        firstName: 'Jane',
        lastName: 'Health',
        relationship: 'mother',
        phoneNumber: '555-1001',
        email: 'jane.health@example.com',
        isPrimary: true,
        canPickUp: true,
      },
      {
        studentId: student.id,
        firstName: 'John',
        lastName: 'Health',
        relationship: 'father',
        phoneNumber: '555-1002',
        email: 'john.health@example.com',
        isPrimary: true,
        canPickUp: true,
      },
    ];

    for (const contact of emergencyContacts) {
      const contactResponse = await authenticatedContext.post('/api/v1/emergency-contacts', {
        data: contact,
      });
      expect(contactResponse.ok()).toBeTruthy();
    }

    // 3. Record baseline health assessment
    const baselineResponse = await authenticatedContext.post('/api/v1/health-records', {
      data: {
        studentId: student.id,
        recordType: 'vital_signs',
        recordDate: new Date().toISOString(),
        vitalSigns: {
          height: 152,
          weight: 45,
          temperature: 98.6,
          heartRate: 75,
          bloodPressure: '110/70',
        },
        notes: 'Baseline health assessment - beginning of school year',
      },
    });
    expect(baselineResponse.ok()).toBeTruthy();

    // 4. Record immunization history
    const vaccines = ['MMR', 'Tdap', 'Varicella', 'Influenza'];
    for (const vaccine of vaccines) {
      const immunizationResponse = await authenticatedContext.post('/api/v1/health-records', {
        data: {
          studentId: student.id,
          recordType: 'immunization',
          recordDate: getPastDate(30),
          immunizationData: {
            vaccineName: vaccine,
            manufacturer: 'Test Pharma',
            lotNumber: `LOT${Math.random().toString().substr(2, 6)}`,
            expirationDate: getFutureDate(365),
            site: 'left_arm',
            route: 'intramuscular',
          },
          notes: `${vaccine} vaccine administered`,
        },
      });
      expect(immunizationResponse.ok()).toBeTruthy();
    }

    // 5. Prescribe asthma medication
    const medicationResponse = await authenticatedContext.post('/api/v1/medications', {
      data: {
        studentId: student.id,
        medicationName: 'Albuterol Inhaler',
        dosage: '2 puffs',
        frequency: 'as_needed',
        route: 'inhalation',
        prescribedBy: 'Dr. Asthma Specialist',
        startDate: new Date().toISOString(),
        instructions: 'Use when experiencing asthma symptoms',
        conditions: ['Asthma'],
      },
    });
    expect(medicationResponse.ok()).toBeTruthy();
    const medication = await medicationResponse.json();

    // 6. Record medication administration
    const administrationResponse = await authenticatedContext.post(
      '/api/v1/medication-administrations',
      {
        data: {
          medicationId: medication.id,
          administeredDate: new Date().toISOString(),
          administeredBy: 'School Nurse',
          dosageGiven: '2 puffs',
          notes: 'Student requested inhaler - experiencing mild wheezing',
          studentReaction: 'positive',
        },
      }
    );
    expect(administrationResponse.ok()).toBeTruthy();

    // 7. Schedule routine checkup
    const appointmentResponse = await authenticatedContext.post('/api/v1/appointments', {
      data: {
        studentId: student.id,
        appointmentType: 'routine_checkup',
        scheduledDateTime: getScheduledDateTime(48),
        duration: 30,
        notes: 'Quarterly health checkup for student with asthma',
      },
    });
    expect(appointmentResponse.ok()).toBeTruthy();
    const appointment = await appointmentResponse.json();

    // 8. Complete checkup appointment
    const completeAppointmentResponse = await authenticatedContext.put(
      `/api/v1/appointments/${appointment.id}/complete`,
      {
        data: {
          completedAt: new Date().toISOString(),
          outcome: 'completed_successfully',
          notes: 'Asthma well-controlled. Continue current medication plan.',
        },
      }
    );
    expect(completeAppointmentResponse.ok()).toBeTruthy();

    // 9. Record checkup vital signs
    const checkupVitalsResponse = await authenticatedContext.post('/api/v1/health-records', {
      data: {
        studentId: student.id,
        recordType: 'vital_signs',
        recordDate: new Date().toISOString(),
        vitalSigns: {
          height: 153,
          weight: 46,
          temperature: 98.4,
          heartRate: 72,
          bloodPressure: '112/72',
          respiratoryRate: 16,
          oxygenSaturation: 98,
        },
        relatedAppointmentId: appointment.id,
        notes: 'Routine checkup - all vitals normal',
      },
    });
    expect(checkupVitalsResponse.ok()).toBeTruthy();

    // 10. Track minor playground incident
    const incidentResponse = await authenticatedContext.post('/api/v1/incidents', {
      data: {
        studentId: student.id,
        incidentType: 'minor_injury',
        incidentDate: new Date().toISOString(),
        location: 'Playground',
        description: 'Student tripped and scraped elbow',
        severity: 'minor',
        treatmentProvided: 'Cleaned wound and applied bandage',
        parentNotified: true,
      },
    });
    expect(incidentResponse.ok()).toBeTruthy();

    // 11. Get comprehensive health summary
    const healthSummaryResponse = await authenticatedContext.get(
      `/api/v1/students/${student.id}/health-summary`
    );
    expect(healthSummaryResponse.ok()).toBeTruthy();
    const healthSummary = await healthSummaryResponse.json();

    expect(healthSummary.student).toBeDefined();
    expect(healthSummary.allergies).toContain('Penicillin');
    expect(healthSummary.medicalConditions).toContain('Asthma');
    expect(healthSummary.activeMedications).toBeDefined();
    expect(healthSummary.recentHealthRecords).toBeDefined();
    expect(healthSummary.upcomingAppointments).toBeDefined();
    expect(healthSummary.recentIncidents).toBeDefined();
    expect(healthSummary.immunizationStatus).toBeDefined();

    // 12. Generate health report for parent
    const reportResponse = await authenticatedContext.post(
      `/api/v1/students/${student.id}/health-report`,
      {
        data: {
          reportType: 'comprehensive',
          startDate: getPastDate(90),
          endDate: new Date().toISOString(),
          includeVitalSigns: true,
          includeMedications: true,
          includeIncidents: true,
          includeImmunizations: true,
          format: 'pdf',
        },
      }
    );
    expect(reportResponse.ok()).toBeTruthy();
  });

  test('should track student with chronic condition management', async ({
    authenticatedContext,
  }) => {
    // 1. Enroll student with Type 1 Diabetes
    const studentResponse = await authenticatedContext.post('/api/v1/students', {
      data: {
        firstName: 'Chronic',
        lastName: 'Condition',
        dateOfBirth: '2011-09-01',
        grade: '7',
        schoolId: `CHRON${Date.now()}`,
        status: 'active',
        medicalConditions: ['Type 1 Diabetes'],
      },
    });
    const student = await studentResponse.json();

    // 2. Create Individual Health Plan (IHP)
    const ihpResponse = await authenticatedContext.post('/api/v1/health-plans', {
      data: {
        studentId: student.id,
        planType: 'individual_health_plan',
        condition: 'Type 1 Diabetes',
        startDate: new Date().toISOString(),
        reviewDate: getFutureDate(180),
        goals: [
          'Maintain blood glucose between 80-180 mg/dL',
          'Prevent hypoglycemic episodes',
          'Ensure safe participation in all activities',
        ],
        accommodations: [
          'Access to blood glucose monitor',
          'Snack breaks as needed',
          'Restroom access without permission',
        ],
        emergencyProcedures: [
          'If blood sugar < 70, give glucose tablets',
          'If unconscious, call 911 and administer glucagon',
        ],
      },
    });
    expect(ihpResponse.ok()).toBeTruthy();

    // 3. Prescribe diabetes medications
    const medications = [
      {
        medicationName: 'Insulin NovoLog',
        dosage: 'Variable based on blood sugar',
        frequency: 'before_meals',
        route: 'subcutaneous',
        instructions: 'Calculate dose based on carb count and blood sugar level',
      },
      {
        medicationName: 'Glucagon Emergency Kit',
        dosage: '1 kit',
        frequency: 'emergency_only',
        route: 'intramuscular',
        instructions: 'Use if student unconscious due to low blood sugar',
      },
    ];

    for (const med of medications) {
      const medResponse = await authenticatedContext.post('/api/v1/medications', {
        data: {
          studentId: student.id,
          ...med,
          prescribedBy: 'Dr. Endocrinologist',
          startDate: new Date().toISOString(),
        },
      });
      expect(medResponse.ok()).toBeTruthy();
    }

    // 4. Track daily blood glucose monitoring
    const bloodSugarReadings = [
      { time: '08:00', value: 125, note: 'Before breakfast' },
      { time: '12:00', value: 180, note: 'Before lunch' },
      { time: '15:00', value: 95, note: 'Mid-afternoon check' },
    ];

    for (const reading of bloodSugarReadings) {
      const readingResponse = await authenticatedContext.post('/api/v1/health-records', {
        data: {
          studentId: student.id,
          recordType: 'blood_glucose',
          recordDate: new Date().toISOString(),
          bloodGlucoseData: {
            value: reading.value,
            unit: 'mg/dL',
            timeOfDay: reading.time,
          },
          notes: reading.note,
        },
      });
      expect(readingResponse.ok()).toBeTruthy();
    }

    // 5. Schedule recurring diabetes management appointments
    const recurringResponse = await authenticatedContext.post('/api/v1/appointments/recurring', {
      data: {
        studentId: student.id,
        appointmentType: 'medical_monitoring',
        scheduledDateTime: getScheduledDateTime(7 * 24),
        duration: 15,
        recurrence: 'weekly',
        recurrenceCount: 12,
        notes: 'Weekly diabetes management check-in',
      },
    });
    expect(recurringResponse.ok()).toBeTruthy();

    // 6. Create emergency action plan
    const eapResponse = await authenticatedContext.post('/api/v1/documents', {
      data: {
        studentId: student.id,
        documentType: 'emergency_action_plan',
        title: 'Diabetes Emergency Action Plan',
        category: 'emergency',
        content: {
          emergencyContacts: ['Mother: 555-2001', 'Father: 555-2002', 'Dr. Smith: 555-3000'],
          symptoms: {
            hypoglycemia: ['Shaking', 'Sweating', 'Confusion', 'Dizziness'],
            hyperglycemia: ['Thirst', 'Frequent urination', 'Fatigue'],
          },
          treatment: {
            hypoglycemia: '15g fast-acting carbs, recheck in 15 min',
            hyperglycemia: 'Monitor, encourage water, contact parent if > 250',
          },
        },
      },
    });
    expect(eapResponse.ok()).toBeTruthy();

    // 7. Get diabetes management dashboard
    const dashboardResponse = await authenticatedContext.get(
      `/api/v1/students/${student.id}/condition-dashboard`,
      {
        params: {
          condition: 'diabetes',
        },
      }
    );
    expect(dashboardResponse.ok()).toBeTruthy();
    const dashboard = await dashboardResponse.json();
    expect(dashboard.recentReadings).toBeDefined();
    expect(dashboard.medicationCompliance).toBeDefined();
    expect(dashboard.alerts).toBeDefined();
  });

  test('should track student health across academic year', async ({ authenticatedContext }) => {
    // 1. Create student at beginning of year
    const student = await createTestStudent(authenticatedContext);

    // 2. Record growth measurements quarterly
    const growthData = [
      { date: getPastDate(270), height: 145, weight: 38 }, // Beginning of year
      { date: getPastDate(180), height: 147, weight: 40 }, // Q2
      { date: getPastDate(90), height: 149, weight: 42 }, // Q3
      { date: new Date().toISOString(), height: 152, weight: 45 }, // Q4
    ];

    for (const growth of growthData) {
      const growthResponse = await authenticatedContext.post('/api/v1/health-records', {
        data: {
          studentId: student.id,
          recordType: 'vital_signs',
          recordDate: growth.date,
          vitalSigns: {
            height: growth.height,
            weight: growth.weight,
            bmi: (growth.weight / ((growth.height / 100) ** 2)).toFixed(1),
          },
          notes: 'Quarterly growth measurement',
        },
      });
      expect(growthResponse.ok()).toBeTruthy();
    }

    // 3. Get growth chart data
    const growthChartResponse = await authenticatedContext.get(
      `/api/v1/students/${student.id}/growth-chart`,
      {
        params: {
          startDate: getPastDate(270),
          endDate: new Date().toISOString(),
        },
      }
    );
    expect(growthChartResponse.ok()).toBeTruthy();
    const growthChart = await growthChartResponse.json();
    expect(growthChart.heightData).toBeDefined();
    expect(growthChart.weightData).toBeDefined();
    expect(growthChart.bmiData).toBeDefined();

    // 4. Track illness patterns
    const illnessesResponse = await authenticatedContext.get(
      `/api/v1/students/${student.id}/illness-history`,
      {
        params: {
          startDate: getPastDate(270),
          endDate: new Date().toISOString(),
        },
      }
    );
    expect(illnessesResponse.ok()).toBeTruthy();

    // 5. Generate end-of-year health summary
    const yearEndResponse = await authenticatedContext.post(
      `/api/v1/students/${student.id}/year-end-summary`,
      {
        data: {
          schoolYear: '2024-2025',
          format: 'pdf',
        },
      }
    );
    expect(yearEndResponse.ok()).toBeTruthy();
  });

  test('should provide health alerts and notifications', async ({ authenticatedContext }) => {
    // 1. Create student
    const student = await createTestStudent(authenticatedContext);

    // 2. Get health alerts for student
    const alertsResponse = await authenticatedContext.get(
      `/api/v1/students/${student.id}/health-alerts`
    );
    expect(alertsResponse.ok()).toBeTruthy();
    const alerts = await alertsResponse.json();
    expect(Array.isArray(alerts)).toBeTruthy();

    // 3. Check for medication due alerts
    const medicationAlertsResponse = await authenticatedContext.get(
      '/api/v1/medications/due-now'
    );
    expect(medicationAlertsResponse.ok()).toBeTruthy();

    // 4. Check for missing immunizations
    const immunizationAlertsResponse = await authenticatedContext.get(
      '/api/v1/immunizations/non-compliant'
    );
    expect(immunizationAlertsResponse.ok()).toBeTruthy();

    // 5. Check for overdue appointments
    const overdueAppointmentsResponse = await authenticatedContext.get(
      '/api/v1/appointments/overdue'
    );
    expect(overdueAppointmentsResponse.ok()).toBeTruthy();
  });
});
