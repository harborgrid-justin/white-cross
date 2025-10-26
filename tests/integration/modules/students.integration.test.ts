/**
 * Students Module Integration Tests
 * Tests complete student CRUD operations and workflows
 */

import { test, expect } from '../helpers/test-client';
import { TEST_STUDENTS, TEST_EMERGENCY_CONTACTS, generateStudentId } from '../helpers/test-data';

test.describe('Students Module Integration', () => {
  test.describe('Student CRUD Operations', () => {
    let createdStudentId: string;

    test('should create a new student with complete data', async ({ authenticatedContext }) => {
      const studentData = {
        ...TEST_STUDENTS.valid,
        schoolId: generateStudentId(),
      };

      const response = await authenticatedContext.post('/api/v1/students', {
        data: studentData,
      });

      expect(response.ok()).toBeTruthy();
      const student = await response.json();

      expect(student.id).toBeDefined();
      expect(student.firstName).toBe(studentData.firstName);
      expect(student.lastName).toBe(studentData.lastName);
      expect(student.dateOfBirth).toBe(studentData.dateOfBirth);
      expect(student.grade).toBe(studentData.grade);
      expect(student.status).toBe('active');

      createdStudentId = student.id;
    });

    test('should retrieve student by ID', async ({ authenticatedContext }) => {
      // Create student first
      const createResponse = await authenticatedContext.post('/api/v1/students', {
        data: { ...TEST_STUDENTS.valid, schoolId: generateStudentId() },
      });
      const created = await createResponse.json();

      // Retrieve student
      const response = await authenticatedContext.get(`/api/v1/students/${created.id}`);

      expect(response.ok()).toBeTruthy();
      const student = await response.json();

      expect(student.id).toBe(created.id);
      expect(student.firstName).toBe(TEST_STUDENTS.valid.firstName);
      expect(student.lastName).toBe(TEST_STUDENTS.valid.lastName);
    });

    test('should update student information', async ({ authenticatedContext }) => {
      // Create student first
      const createResponse = await authenticatedContext.post('/api/v1/students', {
        data: { ...TEST_STUDENTS.valid, schoolId: generateStudentId() },
      });
      const created = await createResponse.json();

      // Update student
      const updateData = {
        grade: '9',
        status: 'active',
      };

      const response = await authenticatedContext.put(`/api/v1/students/${created.id}`, {
        data: updateData,
      });

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.id).toBe(created.id);
      expect(updated.grade).toBe('9');
      expect(updated.status).toBe('active');
    });

    test('should soft delete student', async ({ authenticatedContext }) => {
      // Create student first
      const createResponse = await authenticatedContext.post('/api/v1/students', {
        data: { ...TEST_STUDENTS.valid, schoolId: generateStudentId() },
      });
      const created = await createResponse.json();

      // Delete student
      const response = await authenticatedContext.delete(`/api/v1/students/${created.id}`);

      expect(response.ok()).toBeTruthy();

      // Verify student is marked as inactive
      const getResponse = await authenticatedContext.get(`/api/v1/students/${created.id}`);
      const student = await getResponse.json();

      expect(student.status).toBe('inactive');
    });

    test('should list all students with pagination', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/students', {
        params: {
          page: 1,
          limit: 10,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.students).toBeDefined();
      expect(Array.isArray(data.students)).toBeTruthy();
      expect(data.pagination).toBeDefined();
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(10);
    });

    test('should search students by name', async ({ authenticatedContext }) => {
      // Create student with specific name
      const studentData = {
        ...TEST_STUDENTS.valid,
        firstName: 'SearchTest',
        lastName: 'Unique',
        schoolId: generateStudentId(),
      };

      await authenticatedContext.post('/api/v1/students', { data: studentData });

      // Search for student
      const response = await authenticatedContext.get('/api/v1/students/search', {
        params: {
          query: 'SearchTest',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.students.length).toBeGreaterThan(0);
      const found = data.students.find((s: any) => s.firstName === 'SearchTest');
      expect(found).toBeDefined();
    });

    test('should filter students by grade', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/students', {
        params: {
          grade: '8',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.students).toBeDefined();
      data.students.forEach((student: any) => {
        expect(student.grade).toBe('8');
      });
    });

    test('should filter students by status', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/students', {
        params: {
          status: 'active',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.students).toBeDefined();
      data.students.forEach((student: any) => {
        expect(student.status).toBe('active');
      });
    });
  });

  test.describe('Student with Allergies and Conditions', () => {
    test('should create student with allergies', async ({ authenticatedContext }) => {
      const studentData = {
        ...TEST_STUDENTS.withAllergies,
        schoolId: generateStudentId(),
      };

      const response = await authenticatedContext.post('/api/v1/students', {
        data: studentData,
      });

      expect(response.ok()).toBeTruthy();
      const student = await response.json();

      expect(student.allergies).toBeDefined();
      expect(student.allergies).toEqual(studentData.allergies);
    });

    test('should create student with medical conditions', async ({ authenticatedContext }) => {
      const studentData = {
        ...TEST_STUDENTS.withConditions,
        schoolId: generateStudentId(),
      };

      const response = await authenticatedContext.post('/api/v1/students', {
        data: studentData,
      });

      expect(response.ok()).toBeTruthy();
      const student = await response.json();

      expect(student.medicalConditions).toBeDefined();
      expect(student.medicalConditions).toEqual(studentData.medicalConditions);
    });

    test('should update student allergies', async ({ authenticatedContext }) => {
      // Create student
      const createResponse = await authenticatedContext.post('/api/v1/students', {
        data: { ...TEST_STUDENTS.withAllergies, schoolId: generateStudentId() },
      });
      const created = await createResponse.json();

      // Update allergies
      const updateData = {
        allergies: ['Peanuts', 'Penicillin', 'Latex'],
      };

      const response = await authenticatedContext.put(`/api/v1/students/${created.id}`, {
        data: updateData,
      });

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.allergies).toEqual(updateData.allergies);
    });
  });

  test.describe('Emergency Contacts', () => {
    test('should add emergency contact to student', async ({ authenticatedContext }) => {
      // Create student first
      const studentResponse = await authenticatedContext.post('/api/v1/students', {
        data: { ...TEST_STUDENTS.valid, schoolId: generateStudentId() },
      });
      const student = await studentResponse.json();

      // Add emergency contact
      const contactData = {
        ...TEST_EMERGENCY_CONTACTS.mother,
        studentId: student.id,
      };

      const response = await authenticatedContext.post('/api/v1/emergency-contacts', {
        data: contactData,
      });

      expect(response.ok()).toBeTruthy();
      const contact = await response.json();

      expect(contact.id).toBeDefined();
      expect(contact.studentId).toBe(student.id);
      expect(contact.firstName).toBe(contactData.firstName);
      expect(contact.relationship).toBe(contactData.relationship);
      expect(contact.isPrimary).toBe(true);
    });

    test('should retrieve all emergency contacts for student', async ({ authenticatedContext }) => {
      // Create student
      const studentResponse = await authenticatedContext.post('/api/v1/students', {
        data: { ...TEST_STUDENTS.valid, schoolId: generateStudentId() },
      });
      const student = await studentResponse.json();

      // Add multiple contacts
      await authenticatedContext.post('/api/v1/emergency-contacts', {
        data: { ...TEST_EMERGENCY_CONTACTS.mother, studentId: student.id },
      });
      await authenticatedContext.post('/api/v1/emergency-contacts', {
        data: { ...TEST_EMERGENCY_CONTACTS.father, studentId: student.id },
      });

      // Retrieve contacts
      const response = await authenticatedContext.get(
        `/api/v1/students/${student.id}/emergency-contacts`
      );

      expect(response.ok()).toBeTruthy();
      const contacts = await response.json();

      expect(Array.isArray(contacts)).toBeTruthy();
      expect(contacts.length).toBeGreaterThanOrEqual(2);
    });

    test('should update emergency contact', async ({ authenticatedContext }) => {
      // Create student and contact
      const studentResponse = await authenticatedContext.post('/api/v1/students', {
        data: { ...TEST_STUDENTS.valid, schoolId: generateStudentId() },
      });
      const student = await studentResponse.json();

      const contactResponse = await authenticatedContext.post('/api/v1/emergency-contacts', {
        data: { ...TEST_EMERGENCY_CONTACTS.mother, studentId: student.id },
      });
      const contact = await contactResponse.json();

      // Update contact
      const updateData = {
        phoneNumber: '555-9999',
        email: 'updated@example.com',
      };

      const response = await authenticatedContext.put(
        `/api/v1/emergency-contacts/${contact.id}`,
        {
          data: updateData,
        }
      );

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.phoneNumber).toBe(updateData.phoneNumber);
      expect(updated.email).toBe(updateData.email);
    });

    test('should delete emergency contact', async ({ authenticatedContext }) => {
      // Create student and contact
      const studentResponse = await authenticatedContext.post('/api/v1/students', {
        data: { ...TEST_STUDENTS.valid, schoolId: generateStudentId() },
      });
      const student = await studentResponse.json();

      const contactResponse = await authenticatedContext.post('/api/v1/emergency-contacts', {
        data: { ...TEST_EMERGENCY_CONTACTS.grandparent, studentId: student.id },
      });
      const contact = await contactResponse.json();

      // Delete contact
      const response = await authenticatedContext.delete(
        `/api/v1/emergency-contacts/${contact.id}`
      );

      expect(response.ok()).toBeTruthy();

      // Verify deleted
      const getResponse = await authenticatedContext.get(
        `/api/v1/emergency-contacts/${contact.id}`
      );
      expect(getResponse.status()).toBe(404);
    });
  });

  test.describe('Student Health Timeline', () => {
    test('should retrieve complete health timeline for student', async ({
      authenticatedContext,
    }) => {
      // Create student
      const studentResponse = await authenticatedContext.post('/api/v1/students', {
        data: { ...TEST_STUDENTS.valid, schoolId: generateStudentId() },
      });
      const student = await studentResponse.json();

      // Create some health records
      await authenticatedContext.post('/api/v1/health-records', {
        data: {
          studentId: student.id,
          recordType: 'vital_signs',
          recordDate: new Date().toISOString(),
          vitalSigns: {
            temperature: 98.6,
            heartRate: 72,
          },
        },
      });

      // Get health timeline
      const response = await authenticatedContext.get(
        `/api/v1/students/${student.id}/health-timeline`
      );

      expect(response.ok()).toBeTruthy();
      const timeline = await response.json();

      expect(Array.isArray(timeline)).toBeTruthy();
      expect(timeline.length).toBeGreaterThan(0);
    });
  });

  test.describe('Validation and Error Handling', () => {
    test('should reject student creation with missing required fields', async ({
      authenticatedContext,
    }) => {
      const invalidData = {
        firstName: 'Test',
        // Missing lastName, dateOfBirth, etc.
      };

      const response = await authenticatedContext.post('/api/v1/students', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should reject invalid date of birth', async ({ authenticatedContext }) => {
      const invalidData = {
        ...TEST_STUDENTS.valid,
        dateOfBirth: 'invalid-date',
        schoolId: generateStudentId(),
      };

      const response = await authenticatedContext.post('/api/v1/students', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should reject future date of birth', async ({ authenticatedContext }) => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const invalidData = {
        ...TEST_STUDENTS.valid,
        dateOfBirth: futureDate.toISOString().split('T')[0],
        schoolId: generateStudentId(),
      };

      const response = await authenticatedContext.post('/api/v1/students', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should return 404 for non-existent student', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get(
        '/api/v1/students/00000000-0000-0000-0000-000000000000'
      );

      expect(response.status()).toBe(404);
    });
  });
});
