/**
 * Incidents Module Integration Tests
 * Tests complete incident reporting and tracking workflows
 */

import { test, expect } from '../helpers/test-client';
import {
  TEST_STUDENTS,
  TEST_INCIDENTS,
  generateStudentId,
  getPastDate,
} from '../helpers/test-data';
import { createTestStudent, createTestIncident } from '../helpers/test-client';

test.describe('Incidents Module Integration', () => {
  test.describe('Incident CRUD Operations', () => {
    let studentId: string;

    test.beforeEach(async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      studentId = student.id;
    });

    test('should create minor injury incident', async ({ authenticatedContext }) => {
      const incidentData = {
        ...TEST_INCIDENTS.minorInjury,
        studentId,
        incidentDate: new Date().toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/incidents', {
        data: incidentData,
      });

      expect(response.ok()).toBeTruthy();
      const incident = await response.json();

      expect(incident.id).toBeDefined();
      expect(incident.studentId).toBe(studentId);
      expect(incident.incidentType).toBe('minor_injury');
      expect(incident.severity).toBe('minor');
      expect(incident.parentNotified).toBe(true);
    });

    test('should create illness incident', async ({ authenticatedContext }) => {
      const incidentData = {
        ...TEST_INCIDENTS.illness,
        studentId,
        incidentDate: new Date().toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/incidents', {
        data: incidentData,
      });

      expect(response.ok()).toBeTruthy();
      const incident = await response.json();

      expect(incident.incidentType).toBe('illness');
      expect(incident.severity).toBe('moderate');
      expect(incident.sentHome).toBe(true);
    });

    test('should create severe allergic reaction incident', async ({
      authenticatedContext,
    }) => {
      const incidentData = {
        ...TEST_INCIDENTS.allergicReaction,
        studentId,
        incidentDate: new Date().toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/incidents', {
        data: incidentData,
      });

      expect(response.ok()).toBeTruthy();
      const incident = await response.json();

      expect(incident.incidentType).toBe('allergic_reaction');
      expect(incident.severity).toBe('severe');
      expect(incident.emergencyResponse).toBe(true);
      expect(incident.parentNotified).toBe(true);
    });

    test('should retrieve incident by ID', async ({ authenticatedContext }) => {
      // Create incident
      const created = await createTestIncident(authenticatedContext, studentId);

      // Retrieve incident
      const response = await authenticatedContext.get(`/api/v1/incidents/${created.id}`);

      expect(response.ok()).toBeTruthy();
      const incident = await response.json();

      expect(incident.id).toBe(created.id);
      expect(incident.studentId).toBe(studentId);
    });

    test('should update incident details', async ({ authenticatedContext }) => {
      // Create incident
      const created = await createTestIncident(authenticatedContext, studentId);

      // Update incident
      const updateData = {
        treatmentProvided: 'Updated treatment: Ice pack applied, rest provided',
        followUpRequired: true,
        notes: 'Follow-up appointment scheduled',
      };

      const response = await authenticatedContext.put(`/api/v1/incidents/${created.id}`, {
        data: updateData,
      });

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.treatmentProvided).toContain('Updated treatment');
      expect(updated.followUpRequired).toBe(true);
      expect(updated.notes).toContain('Follow-up');
    });

    test('should list all incidents with pagination', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/incidents', {
        params: {
          page: 1,
          limit: 10,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.incidents).toBeDefined();
      expect(Array.isArray(data.incidents)).toBeTruthy();
      expect(data.pagination).toBeDefined();
    });

    test('should filter incidents by severity', async ({ authenticatedContext }) => {
      // Create incidents with different severities
      await createTestIncident(authenticatedContext, studentId); // minor

      // Create moderate incident
      await authenticatedContext.post('/api/v1/incidents', {
        data: {
          ...TEST_INCIDENTS.illness,
          studentId,
          incidentDate: new Date().toISOString(),
          severity: 'moderate',
        },
      });

      // Filter by severity
      const response = await authenticatedContext.get('/api/v1/incidents', {
        params: {
          severity: 'moderate',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      data.incidents.forEach((incident: any) => {
        expect(incident.severity).toBe('moderate');
      });
    });

    test('should filter incidents by date range', async ({ authenticatedContext }) => {
      // Create incidents across different dates
      await authenticatedContext.post('/api/v1/incidents', {
        data: {
          ...TEST_INCIDENTS.minorInjury,
          studentId,
          incidentDate: getPastDate(30),
        },
      });

      await authenticatedContext.post('/api/v1/incidents', {
        data: {
          ...TEST_INCIDENTS.minorInjury,
          studentId,
          incidentDate: getPastDate(5),
        },
      });

      // Filter last 7 days
      const response = await authenticatedContext.get('/api/v1/incidents', {
        params: {
          startDate: getPastDate(7),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.incidents.length).toBeGreaterThan(0);
      data.incidents.forEach((incident: any) => {
        const incidentDate = new Date(incident.incidentDate);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        expect(incidentDate.getTime()).toBeGreaterThanOrEqual(sevenDaysAgo.getTime());
      });
    });
  });

  test.describe('Witness Management', () => {
    let incidentId: string;
    let studentId: string;

    test.beforeEach(async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      studentId = student.id;
      const incident = await createTestIncident(authenticatedContext, studentId);
      incidentId = incident.id;
    });

    test('should add witness to incident', async ({ authenticatedContext }) => {
      const witnessData = {
        incidentId,
        witnessName: 'Ms. Jane Smith',
        witnessRole: 'teacher',
        witnessStatement: 'I saw the student fall from the swing set',
        witnessContact: 'jane.smith@school.edu',
      };

      const response = await authenticatedContext.post('/api/v1/incident-witnesses', {
        data: witnessData,
      });

      expect(response.ok()).toBeTruthy();
      const witness = await response.json();

      expect(witness.id).toBeDefined();
      expect(witness.incidentId).toBe(incidentId);
      expect(witness.witnessName).toBe('Ms. Jane Smith');
      expect(witness.witnessRole).toBe('teacher');
    });

    test('should retrieve all witnesses for incident', async ({ authenticatedContext }) => {
      // Add multiple witnesses
      const witnesses = [
        {
          witnessName: 'Teacher A',
          witnessRole: 'teacher',
          witnessStatement: 'Witnessed incident',
        },
        {
          witnessName: 'Teacher B',
          witnessRole: 'playground_monitor',
          witnessStatement: 'Also witnessed incident',
        },
      ];

      for (const witness of witnesses) {
        await authenticatedContext.post('/api/v1/incident-witnesses', {
          data: {
            incidentId,
            ...witness,
          },
        });
      }

      // Retrieve witnesses
      const response = await authenticatedContext.get(
        `/api/v1/incidents/${incidentId}/witnesses`
      );

      expect(response.ok()).toBeTruthy();
      const witnessData = await response.json();

      expect(Array.isArray(witnessData)).toBeTruthy();
      expect(witnessData.length).toBeGreaterThanOrEqual(2);
    });

    test('should update witness statement', async ({ authenticatedContext }) => {
      // Add witness
      const createResponse = await authenticatedContext.post('/api/v1/incident-witnesses', {
        data: {
          incidentId,
          witnessName: 'Mr. John Doe',
          witnessRole: 'teacher',
          witnessStatement: 'Initial statement',
        },
      });
      const witness = await createResponse.json();

      // Update statement
      const updateData = {
        witnessStatement: 'Updated detailed statement with more information',
      };

      const response = await authenticatedContext.put(
        `/api/v1/incident-witnesses/${witness.id}`,
        {
          data: updateData,
        }
      );

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.witnessStatement).toContain('Updated detailed statement');
    });
  });

  test.describe('Follow-up Tracking', () => {
    let incidentId: string;
    let studentId: string;

    test.beforeEach(async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      studentId = student.id;

      // Create incident requiring follow-up
      const incidentResponse = await authenticatedContext.post('/api/v1/incidents', {
        data: {
          ...TEST_INCIDENTS.minorInjury,
          studentId,
          incidentDate: getPastDate(3),
          followUpRequired: true,
        },
      });
      const incident = await incidentResponse.json();
      incidentId = incident.id;
    });

    test('should create follow-up action', async ({ authenticatedContext }) => {
      const followUpData = {
        incidentId,
        actionType: 'medical_check',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        assignedTo: 'School Nurse',
        description: 'Check on wound healing progress',
        status: 'pending',
      };

      const response = await authenticatedContext.post('/api/v1/incident-follow-ups', {
        data: followUpData,
      });

      expect(response.ok()).toBeTruthy();
      const followUp = await response.json();

      expect(followUp.id).toBeDefined();
      expect(followUp.incidentId).toBe(incidentId);
      expect(followUp.actionType).toBe('medical_check');
      expect(followUp.status).toBe('pending');
    });

    test('should complete follow-up action', async ({ authenticatedContext }) => {
      // Create follow-up
      const createResponse = await authenticatedContext.post('/api/v1/incident-follow-ups', {
        data: {
          incidentId,
          actionType: 'parent_contact',
          dueDate: new Date().toISOString(),
          assignedTo: 'School Nurse',
          description: 'Contact parent for update',
          status: 'pending',
        },
      });
      const followUp = await createResponse.json();

      // Complete follow-up
      const updateData = {
        status: 'completed',
        completedDate: new Date().toISOString(),
        notes: 'Contacted parent - student doing well',
      };

      const response = await authenticatedContext.put(
        `/api/v1/incident-follow-ups/${followUp.id}`,
        {
          data: updateData,
        }
      );

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.status).toBe('completed');
      expect(updated.completedDate).toBeDefined();
    });

    test('should list all follow-ups for incident', async ({ authenticatedContext }) => {
      // Create multiple follow-ups
      const followUps = [
        { actionType: 'medical_check', description: 'Check wound' },
        { actionType: 'parent_contact', description: 'Contact parent' },
        { actionType: 'documentation', description: 'Complete paperwork' },
      ];

      for (const followUp of followUps) {
        await authenticatedContext.post('/api/v1/incident-follow-ups', {
          data: {
            incidentId,
            ...followUp,
            dueDate: new Date().toISOString(),
            assignedTo: 'School Nurse',
            status: 'pending',
          },
        });
      }

      // Retrieve follow-ups
      const response = await authenticatedContext.get(
        `/api/v1/incidents/${incidentId}/follow-ups`
      );

      expect(response.ok()).toBeTruthy();
      const followUpsData = await response.json();

      expect(Array.isArray(followUpsData)).toBeTruthy();
      expect(followUpsData.length).toBeGreaterThanOrEqual(3);
    });

    test('should track overdue follow-ups', async ({ authenticatedContext }) => {
      // Create overdue follow-up
      const pastDue = new Date();
      pastDue.setDate(pastDue.getDate() - 5);

      await authenticatedContext.post('/api/v1/incident-follow-ups', {
        data: {
          incidentId,
          actionType: 'medical_check',
          dueDate: pastDue.toISOString(),
          assignedTo: 'School Nurse',
          description: 'Overdue check',
          status: 'pending',
        },
      });

      // Get overdue follow-ups
      const response = await authenticatedContext.get('/api/v1/incident-follow-ups/overdue');

      expect(response.ok()).toBeTruthy();
      const overdue = await response.json();

      expect(Array.isArray(overdue)).toBeTruthy();
      expect(overdue.length).toBeGreaterThan(0);
    });
  });

  test.describe('Parent Notification', () => {
    let incidentId: string;
    let studentId: string;

    test.beforeEach(async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      studentId = student.id;
      const incident = await createTestIncident(authenticatedContext, studentId);
      incidentId = incident.id;
    });

    test('should record parent notification', async ({ authenticatedContext }) => {
      const notificationData = {
        incidentId,
        notificationMethod: 'phone_call',
        notifiedBy: 'School Nurse',
        notificationDate: new Date().toISOString(),
        parentName: 'Sarah Doe',
        parentResponse: 'Acknowledged, will monitor at home',
        notes: 'Parent was understanding and cooperative',
      };

      const response = await authenticatedContext.post(
        '/api/v1/incident-notifications',
        {
          data: notificationData,
        }
      );

      expect(response.ok()).toBeTruthy();
      const notification = await response.json();

      expect(notification.id).toBeDefined();
      expect(notification.incidentId).toBe(incidentId);
      expect(notification.notificationMethod).toBe('phone_call');
    });

    test('should retrieve notification history', async ({ authenticatedContext }) => {
      // Create notification
      await authenticatedContext.post('/api/v1/incident-notifications', {
        data: {
          incidentId,
          notificationMethod: 'email',
          notifiedBy: 'School Nurse',
          notificationDate: new Date().toISOString(),
          parentName: 'Michael Doe',
          parentResponse: 'Acknowledged via email',
        },
      });

      // Retrieve notifications
      const response = await authenticatedContext.get(
        `/api/v1/incidents/${incidentId}/notifications`
      );

      expect(response.ok()).toBeTruthy();
      const notifications = await response.json();

      expect(Array.isArray(notifications)).toBeTruthy();
      expect(notifications.length).toBeGreaterThan(0);
    });
  });

  test.describe('Incident Reporting', () => {
    test('should generate incident summary report', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/incidents/reports/summary', {
        params: {
          startDate: getPastDate(30),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.totalIncidents).toBeDefined();
      expect(report.incidentsBySeverity).toBeDefined();
      expect(report.incidentsByType).toBeDefined();
    });

    test('should generate incident trends report', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/incidents/reports/trends', {
        params: {
          period: 'monthly',
          startDate: getPastDate(90),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.trends).toBeDefined();
      expect(Array.isArray(report.trends)).toBeTruthy();
    });

    test('should export incidents to PDF', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.post('/api/v1/incidents/export', {
        data: {
          format: 'pdf',
          startDate: getPastDate(30),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.headers()['content-type']).toContain('pdf');
    });
  });

  test.describe('Validation and Error Handling', () => {
    let studentId: string;

    test.beforeEach(async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      studentId = student.id;
    });

    test('should reject incident with missing required fields', async ({
      authenticatedContext,
    }) => {
      const invalidData = {
        studentId,
        // Missing incidentType, incidentDate, etc.
      };

      const response = await authenticatedContext.post('/api/v1/incidents', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should reject invalid incident type', async ({ authenticatedContext }) => {
      const invalidData = {
        studentId,
        incidentType: 'invalid_type',
        incidentDate: new Date().toISOString(),
        location: 'Classroom',
        description: 'Test incident',
      };

      const response = await authenticatedContext.post('/api/v1/incidents', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should reject invalid severity level', async ({ authenticatedContext }) => {
      const invalidData = {
        ...TEST_INCIDENTS.minorInjury,
        studentId,
        incidentDate: new Date().toISOString(),
        severity: 'invalid_severity',
      };

      const response = await authenticatedContext.post('/api/v1/incidents', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should return 404 for non-existent incident', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get(
        '/api/v1/incidents/00000000-0000-0000-0000-000000000000'
      );

      expect(response.status()).toBe(404);
    });

    test('should reject incident for non-existent student', async ({
      authenticatedContext,
    }) => {
      const invalidData = {
        ...TEST_INCIDENTS.minorInjury,
        studentId: '00000000-0000-0000-0000-000000000000',
        incidentDate: new Date().toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/incidents', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(404);
    });
  });
});
