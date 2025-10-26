/**
 * Incident Reporting Workflow Integration Test
 * Tests complete end-to-end incident reporting and tracking workflow
 */

import { test, expect } from '../helpers/test-client';
import { createTestStudent, verifyAuditLog } from '../helpers/test-client';
import { TEST_INCIDENTS } from '../helpers/test-data';

test.describe('Incident Reporting Workflow', () => {
  test('should complete full minor injury incident workflow', async ({
    authenticatedContext,
  }) => {
    // 1. Create student
    const student = await createTestStudent(authenticatedContext);

    // 2. Report incident immediately
    const incidentData = {
      ...TEST_INCIDENTS.minorInjury,
      studentId: student.id,
      incidentDate: new Date().toISOString(),
      reportedBy: 'School Nurse',
    };

    const incidentResponse = await authenticatedContext.post('/api/v1/incidents', {
      data: incidentData,
    });
    expect(incidentResponse.ok()).toBeTruthy();
    const incident = await incidentResponse.json();
    expect(incident.id).toBeDefined();
    expect(incident.severity).toBe('minor');

    // 3. Add witness statement
    const witnessData = {
      incidentId: incident.id,
      witnessName: 'Ms. Johnson',
      witnessRole: 'playground_monitor',
      witnessStatement: 'I saw the student fall from the swing. They immediately got up crying.',
      witnessContact: 'mjohnson@school.edu',
    };

    const witnessResponse = await authenticatedContext.post('/api/v1/incident-witnesses', {
      data: witnessData,
    });
    expect(witnessResponse.ok()).toBeTruthy();

    // 4. Create health record for injury
    const healthRecordResponse = await authenticatedContext.post('/api/v1/health-records', {
      data: {
        studentId: student.id,
        recordType: 'injury',
        recordDate: new Date().toISOString(),
        injuryData: {
          type: 'scrape',
          bodyPart: 'knee',
          severity: 'minor',
          treatment: 'Cleaned and bandaged',
        },
        relatedIncidentId: incident.id,
        notes: 'Minor scrape from playground fall',
      },
    });
    expect(healthRecordResponse.ok()).toBeTruthy();
    const healthRecord = await healthRecordResponse.json();

    // 5. Notify parent
    const notificationData = {
      incidentId: incident.id,
      notificationMethod: 'phone_call',
      notifiedBy: 'School Nurse',
      notificationDate: new Date().toISOString(),
      parentName: 'Sarah Doe',
      parentResponse: 'Acknowledged. Will monitor at home.',
    };

    const notificationResponse = await authenticatedContext.post(
      '/api/v1/incident-notifications',
      {
        data: notificationData,
      }
    );
    expect(notificationResponse.ok()).toBeTruthy();

    // 6. Update incident with parent notification confirmation
    const updateResponse = await authenticatedContext.put(`/api/v1/incidents/${incident.id}`, {
      data: {
        parentNotified: true,
        parentNotificationDate: new Date().toISOString(),
        notes: 'Parent called and informed. Parent acknowledged.',
      },
    });
    expect(updateResponse.ok()).toBeTruthy();

    // 7. Schedule follow-up check
    const followUpData = {
      incidentId: incident.id,
      actionType: 'medical_check',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'School Nurse',
      description: 'Check wound healing progress',
      status: 'pending',
    };

    const followUpResponse = await authenticatedContext.post('/api/v1/incident-follow-ups', {
      data: followUpData,
    });
    expect(followUpResponse.ok()).toBeTruthy();
    const followUp = await followUpResponse.json();

    // 8. Complete follow-up check (next day simulation)
    const completeFollowUpResponse = await authenticatedContext.put(
      `/api/v1/incident-follow-ups/${followUp.id}`,
      {
        data: {
          status: 'completed',
          completedDate: new Date().toISOString(),
          notes: 'Wound healing well. No signs of infection. No further action needed.',
        },
      }
    );
    expect(completeFollowUpResponse.ok()).toBeTruthy();

    // 9. Close incident
    const closeResponse = await authenticatedContext.put(`/api/v1/incidents/${incident.id}`, {
      data: {
        status: 'closed',
        closedDate: new Date().toISOString(),
        resolution: 'Student fully recovered. No complications.',
      },
    });
    expect(closeResponse.ok()).toBeTruthy();

    // 10. Verify audit log for incident creation
    const auditLog = await verifyAuditLog(
      authenticatedContext,
      'incident',
      incident.id,
      'create'
    );
    expect(auditLog).toBeDefined();
  });

  test('should handle severe allergic reaction incident workflow', async ({
    authenticatedContext,
  }) => {
    // 1. Create student with known allergies
    const studentResponse = await authenticatedContext.post('/api/v1/students', {
      data: {
        firstName: 'Allergy',
        lastName: 'Test',
        dateOfBirth: '2012-03-15',
        grade: '6',
        schoolId: `ALG${Date.now()}`,
        status: 'active',
        allergies: ['Peanuts', 'Tree Nuts'],
      },
    });
    const student = await studentResponse.json();

    // 2. Report severe allergic reaction incident
    const incidentData = {
      ...TEST_INCIDENTS.allergicReaction,
      studentId: student.id,
      incidentDate: new Date().toISOString(),
      reportedBy: 'School Nurse',
      priority: 'critical',
    };

    const incidentResponse = await authenticatedContext.post('/api/v1/incidents', {
      data: incidentData,
    });
    expect(incidentResponse.ok()).toBeTruthy();
    const incident = await incidentResponse.json();
    expect(incident.severity).toBe('severe');
    expect(incident.emergencyResponse).toBe(true);

    // 3. Document emergency treatment (EpiPen administration)
    const treatmentResponse = await authenticatedContext.post('/api/v1/health-records', {
      data: {
        studentId: student.id,
        recordType: 'emergency_treatment',
        recordDate: new Date().toISOString(),
        treatmentData: {
          medication: 'EpiPen',
          dosage: '0.3mg',
          route: 'intramuscular',
          administeredBy: 'School Nurse',
          administeredAt: new Date().toISOString(),
          vitalSigns: {
            heartRate: 120,
            bloodPressure: '140/90',
            respiratoryRate: 24,
          },
        },
        relatedIncidentId: incident.id,
        notes: 'EpiPen administered due to anaphylaxis. 911 called.',
      },
    });
    expect(treatmentResponse.ok()).toBeTruthy();

    // 4. Document 911 call
    const emergencyCallResponse = await authenticatedContext.post('/api/v1/incident-actions', {
      data: {
        incidentId: incident.id,
        actionType: 'emergency_call',
        actionDate: new Date().toISOString(),
        performedBy: 'School Nurse',
        details: '911 called at incident time. EMS dispatched.',
        status: 'completed',
      },
    });
    expect(emergencyCallResponse.ok()).toBeTruthy();

    // 5. Immediate parent notification
    const parentNotificationResponse = await authenticatedContext.post(
      '/api/v1/incident-notifications',
      {
        data: {
          incidentId: incident.id,
          notificationMethod: 'phone_call',
          notifiedBy: 'Principal',
          notificationDate: new Date().toISOString(),
          parentName: 'Emergency Contact',
          urgency: 'critical',
          parentResponse: 'Rushing to school immediately',
        },
      }
    );
    expect(parentNotificationResponse.ok()).toBeTruthy();

    // 6. Send urgent message to parent
    const messageResponse = await authenticatedContext.post('/api/v1/messages', {
      data: {
        recipientId: student.id,
        recipientType: 'student_parent',
        subject: 'CRITICAL: Medical Emergency',
        messageBody:
          'Your student had a severe allergic reaction. EpiPen administered. 911 called. Please come to school immediately.',
        messageType: 'alert',
        priority: 'urgent',
      },
    });
    expect(messageResponse.ok()).toBeTruthy();

    // 7. Document EMS arrival and transfer
    const emsTransferResponse = await authenticatedContext.post('/api/v1/incident-actions', {
      data: {
        incidentId: incident.id,
        actionType: 'ems_transfer',
        actionDate: new Date().toISOString(),
        performedBy: 'School Nurse',
        details: 'EMS arrived. Student transferred to ambulance with parent present.',
        status: 'completed',
      },
    });
    expect(emsTransferResponse.ok()).toBeTruthy();

    // 8. Create mandatory follow-ups
    const followUps = [
      {
        actionType: 'hospital_contact',
        description: 'Contact hospital for student status update',
        dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        actionType: 'incident_report',
        description: 'Complete detailed incident report for administration',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        actionType: 'policy_review',
        description: 'Review allergy management policies and procedures',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const followUpData of followUps) {
      const response = await authenticatedContext.post('/api/v1/incident-follow-ups', {
        data: {
          incidentId: incident.id,
          ...followUpData,
          assignedTo: 'School Nurse',
          status: 'pending',
        },
      });
      expect(response.ok()).toBeTruthy();
    }

    // 9. Verify incident marked as critical in system
    const verifyResponse = await authenticatedContext.get(`/api/v1/incidents/${incident.id}`);
    const verifiedIncident = await verifyResponse.json();
    expect(verifiedIncident.severity).toBe('severe');
    expect(verifiedIncident.emergencyResponse).toBe(true);
  });

  test('should handle illness incident with isolation workflow', async ({
    authenticatedContext,
  }) => {
    // 1. Create student
    const student = await createTestStudent(authenticatedContext);

    // 2. Report illness incident
    const incidentData = {
      ...TEST_INCIDENTS.illness,
      studentId: student.id,
      incidentDate: new Date().toISOString(),
      reportedBy: 'Teacher',
    };

    const incidentResponse = await authenticatedContext.post('/api/v1/incidents', {
      data: incidentData,
    });
    expect(incidentResponse.ok()).toBeTruthy();
    const incident = await incidentResponse.json();

    // 3. Document symptoms and vital signs
    const healthRecordResponse = await authenticatedContext.post('/api/v1/health-records', {
      data: {
        studentId: student.id,
        recordType: 'vital_signs',
        recordDate: new Date().toISOString(),
        vitalSigns: {
          temperature: 101.5,
          heartRate: 95,
          bloodPressure: '118/75',
        },
        symptoms: ['fever', 'headache', 'nausea'],
        relatedIncidentId: incident.id,
        notes: 'Student has fever and complaints of stomach ache',
      },
    });
    expect(healthRecordResponse.ok()).toBeTruthy();

    // 4. Move student to isolation room
    const isolationResponse = await authenticatedContext.post('/api/v1/incident-actions', {
      data: {
        incidentId: incident.id,
        actionType: 'isolation',
        actionDate: new Date().toISOString(),
        performedBy: 'School Nurse',
        details: 'Student moved to health office isolation room',
        status: 'in_progress',
      },
    });
    expect(isolationResponse.ok()).toBeTruthy();

    // 5. Contact parent for pickup
    const parentContactResponse = await authenticatedContext.post(
      '/api/v1/incident-notifications',
      {
        data: {
          incidentId: incident.id,
          notificationMethod: 'phone_call',
          notifiedBy: 'School Nurse',
          notificationDate: new Date().toISOString(),
          parentName: 'Parent',
          parentResponse: 'Will pick up student within 30 minutes',
        },
      }
    );
    expect(parentContactResponse.ok()).toBeTruthy();

    // 6. Update incident when student leaves
    const updateResponse = await authenticatedContext.put(`/api/v1/incidents/${incident.id}`, {
      data: {
        sentHome: true,
        departureTime: new Date().toISOString(),
        pickedUpBy: 'Mother',
        notes: 'Student picked up by mother at 11:30 AM',
      },
    });
    expect(updateResponse.ok()).toBeTruthy();

    // 7. Schedule return-to-school check
    const followUpResponse = await authenticatedContext.post('/api/v1/incident-follow-ups', {
      data: {
        incidentId: incident.id,
        actionType: 'return_to_school_check',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'School Nurse',
        description: 'Verify student is fever-free for 24 hours before returning',
        status: 'pending',
      },
    });
    expect(followUpResponse.ok()).toBeTruthy();

    // 8. Close incident when student returns healthy
    const closeResponse = await authenticatedContext.put(`/api/v1/incidents/${incident.id}`, {
      data: {
        status: 'closed',
        closedDate: new Date().toISOString(),
        resolution: 'Student returned to school healthy after 24-hour absence',
      },
    });
    expect(closeResponse.ok()).toBeTruthy();
  });

  test('should generate incident reports and analytics', async ({ authenticatedContext }) => {
    // 1. Get recent incidents summary
    const summaryResponse = await authenticatedContext.get('/api/v1/incidents/summary', {
      params: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
      },
    });
    expect(summaryResponse.ok()).toBeTruthy();
    const summary = await summaryResponse.json();
    expect(summary.totalIncidents).toBeDefined();

    // 2. Get incidents by severity
    const bySeverityResponse = await authenticatedContext.get(
      '/api/v1/incidents/by-severity',
      {
        params: {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString(),
        },
      }
    );
    expect(bySeverityResponse.ok()).toBeTruthy();
    const bySeverity = await bySeverityResponse.json();
    expect(bySeverity.minor).toBeDefined();
    expect(bySeverity.moderate).toBeDefined();
    expect(bySeverity.severe).toBeDefined();

    // 3. Get incidents requiring follow-up
    const followUpRequiredResponse = await authenticatedContext.get(
      '/api/v1/incidents/follow-up-required'
    );
    expect(followUpRequiredResponse.ok()).toBeTruthy();
    const followUpRequired = await followUpRequiredResponse.json();
    expect(Array.isArray(followUpRequired)).toBeTruthy();

    // 4. Export incident report
    const exportResponse = await authenticatedContext.post('/api/v1/incidents/export', {
      data: {
        format: 'pdf',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        includeWitnesses: true,
        includeFollowUps: true,
      },
    });
    expect(exportResponse.ok()).toBeTruthy();
  });

  test('should track incident trends and patterns', async ({ authenticatedContext }) => {
    // 1. Get incident trends by month
    const trendsResponse = await authenticatedContext.get('/api/v1/incidents/trends', {
      params: {
        period: 'monthly',
        months: 6,
      },
    });
    expect(trendsResponse.ok()).toBeTruthy();
    const trends = await trendsResponse.json();
    expect(Array.isArray(trends)).toBeTruthy();

    // 2. Get most common incident types
    const commonTypesResponse = await authenticatedContext.get(
      '/api/v1/incidents/common-types',
      {
        params: {
          limit: 10,
        },
      }
    );
    expect(commonTypesResponse.ok()).toBeTruthy();
    const commonTypes = await commonTypesResponse.json();
    expect(Array.isArray(commonTypes)).toBeTruthy();

    // 3. Get incident hotspots (locations)
    const hotspotsResponse = await authenticatedContext.get('/api/v1/incidents/hotspots');
    expect(hotspotsResponse.ok()).toBeTruthy();
    const hotspots = await hotspotsResponse.json();
    expect(Array.isArray(hotspots)).toBeTruthy();
  });
});
