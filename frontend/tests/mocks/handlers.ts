import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:3001/api/v1';

export const handlers = [
  // Auth endpoints
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as any;
    const { email, password } = body;

    if (email === 'test@example.com' && password === 'password123') {
      return HttpResponse.json({
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'nurse',
            permissions: ['read:students', 'write:medications'],
          },
        },
      });
    }

    return HttpResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post(`${API_URL}/auth/logout`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.get(`${API_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return HttpResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'nurse',
        permissions: ['read:students', 'write:medications'],
      },
    });
  }),

  // Students endpoints
  http.get(`${API_URL}/students`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    return HttpResponse.json({
      success: true,
      data: {
        students: [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '2010-05-15',
            grade: '8',
            status: 'active',
            schoolId: 'school-1',
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            dateOfBirth: '2011-08-22',
            grade: '7',
            status: 'active',
            schoolId: 'school-1',
          },
        ],
        pagination: {
          page,
          limit,
          total: 2,
          totalPages: 1,
        },
      },
    });
  }),

  http.get(`${API_URL}/students/:id`, ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      success: true,
      data: {
        id,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2010-05-15',
        grade: '8',
        status: 'active',
        schoolId: 'school-1',
        emergencyContacts: [],
        healthRecords: [],
      },
    });
  }),

  http.post(`${API_URL}/students`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-student-id',
          ...body,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  // Medications endpoints
  http.get(`${API_URL}/medications`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        medications: [
          {
            id: '1',
            studentId: '1',
            name: 'Ibuprofen',
            dosage: '200mg',
            frequency: 'As needed',
            route: 'Oral',
            status: 'active',
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/medications/administer`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json({
      success: true,
      data: {
        id: 'admin-record-id',
        ...body,
        administeredAt: new Date().toISOString(),
        administeredBy: 'Test User',
      },
    });
  }),

  // Appointments endpoints
  http.get(`${API_URL}/appointments`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        appointments: [
          {
            id: '1',
            studentId: '1',
            type: 'checkup',
            scheduledAt: new Date().toISOString(),
            status: 'scheduled',
          },
        ],
      },
    });
  }),

  // Health records endpoints
  http.get(`${API_URL}/health-records`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        records: [
          {
            id: '1',
            studentId: '1',
            type: 'vaccination',
            date: '2024-01-15',
            notes: 'Annual flu shot',
          },
        ],
      },
    });
  }),

  // Incidents endpoints
  http.get(`${API_URL}/incidents`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        incidents: [
          {
            id: '1',
            studentId: '1',
            type: 'injury',
            severity: 'minor',
            date: new Date().toISOString(),
            description: 'Scraped knee on playground',
          },
        ],
      },
    });
  }),

  // Emergency contacts endpoints
  http.get(`${API_URL}/emergency-contacts`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        contacts: [
          {
            id: '1',
            studentId: '1',
            name: 'Jane Doe',
            relationship: 'Mother',
            phone: '555-1234',
            isPrimary: true,
          },
        ],
      },
    });
  }),
];
export * from "./enhanced-handlers";
