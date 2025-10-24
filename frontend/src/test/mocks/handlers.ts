/**
 * MSW API Handlers
 * Mock API endpoints for testing
 */

import { http, HttpResponse } from 'msw';
import {
  createMockUser,
  createMockStudent,
  createMockHealthRecord,
  createMockAllergy,
  createMockMedication,
  createMockAppointment,
  createMockIncidentReport,
  createMockList,
  createMockApiResponse,
  createMockApiError,
} from '../utils/test-factories';

export const handlers = [
  // ============================================================
  // AUTHENTICATION
  // ============================================================
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as any;

    if (body.email === 'error@example.com') {
      return HttpResponse.json(
        createMockApiError({ message: 'Invalid credentials' }),
        { status: 401 }
      );
    }

    return HttpResponse.json(
      createMockApiResponse({
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        user: createMockUser({ email: body.email }),
      })
    );
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json(createMockApiResponse({ message: 'Logged out' }));
  }),

  http.post('/api/auth/refresh', () => {
    return HttpResponse.json(
      createMockApiResponse({
        token: 'new-mock-jwt-token',
        refreshToken: 'new-mock-refresh-token',
      })
    );
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json(
      createMockApiResponse(createMockUser())
    );
  }),

  // ============================================================
  // STUDENTS
  // ============================================================
  http.get('/api/students', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search');

    let students = createMockList(createMockStudent, 25);

    if (search) {
      students = students.filter((s) =>
        s.firstName.toLowerCase().includes(search.toLowerCase()) ||
        s.lastName.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = students.length;
    const start = (page - 1) * limit;
    const paginatedStudents = students.slice(start, start + limit);

    return HttpResponse.json(
      createMockApiResponse({
        students: paginatedStudents,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    );
  }),

  http.get('/api/students/:id', ({ params }) => {
    return HttpResponse.json(
      createMockApiResponse(createMockStudent({ id: params.id as string }))
    );
  }),

  http.post('/api/students', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json(
      createMockApiResponse(createMockStudent(body)),
      { status: 201 }
    );
  }),

  http.put('/api/students/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    return HttpResponse.json(
      createMockApiResponse(createMockStudent({ ...body, id: params.id as string }))
    );
  }),

  http.delete('/api/students/:id', () => {
    return HttpResponse.json(
      createMockApiResponse({ message: 'Student deleted' })
    );
  }),

  // ============================================================
  // HEALTH RECORDS
  // ============================================================
  http.get('/api/students/:studentId/health-records', ({ params }) => {
    const records = createMockList(createMockHealthRecord, 10).map(r => ({
      ...r,
      studentId: params.studentId as string,
    }));

    return HttpResponse.json(
      createMockApiResponse({ records })
    );
  }),

  http.post('/api/students/:studentId/health-records', async ({ params, request }) => {
    const body = await request.json() as any;
    return HttpResponse.json(
      createMockApiResponse(
        createMockHealthRecord({ ...body, studentId: params.studentId as string })
      ),
      { status: 201 }
    );
  }),

  // ============================================================
  // ALLERGIES
  // ============================================================
  http.get('/api/students/:studentId/allergies', ({ params }) => {
    const allergies = createMockList(createMockAllergy, 3).map(a => ({
      ...a,
      studentId: params.studentId as string,
    }));

    return HttpResponse.json(
      createMockApiResponse({ allergies })
    );
  }),

  http.post('/api/students/:studentId/allergies', async ({ params, request }) => {
    const body = await request.json() as any;
    return HttpResponse.json(
      createMockApiResponse(
        createMockAllergy({ ...body, studentId: params.studentId as string })
      ),
      { status: 201 }
    );
  }),

  http.put('/api/allergies/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    return HttpResponse.json(
      createMockApiResponse(createMockAllergy({ ...body, id: params.id as string }))
    );
  }),

  http.delete('/api/allergies/:id', () => {
    return HttpResponse.json(
      createMockApiResponse({ message: 'Allergy deleted' })
    );
  }),

  // ============================================================
  // MEDICATIONS
  // ============================================================
  http.get('/api/medications', () => {
    return HttpResponse.json(
      createMockApiResponse({
        medications: createMockList(createMockMedication, 15),
      })
    );
  }),

  http.get('/api/students/:studentId/medications', ({ params }) => {
    const medications = createMockList(createMockMedication, 5).map(m => ({
      ...m,
      studentId: params.studentId as string,
    }));

    return HttpResponse.json(
      createMockApiResponse({ medications })
    );
  }),

  http.post('/api/medications', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json(
      createMockApiResponse(createMockMedication(body)),
      { status: 201 }
    );
  }),

  http.put('/api/medications/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    return HttpResponse.json(
      createMockApiResponse(createMockMedication({ ...body, id: params.id as string }))
    );
  }),

  http.delete('/api/medications/:id', () => {
    return HttpResponse.json(
      createMockApiResponse({ message: 'Medication deleted' })
    );
  }),

  // ============================================================
  // APPOINTMENTS
  // ============================================================
  http.get('/api/appointments', ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    const appointments = createMockList(createMockAppointment, 10);

    return HttpResponse.json(
      createMockApiResponse({ appointments })
    );
  }),

  http.post('/api/appointments', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json(
      createMockApiResponse(createMockAppointment(body)),
      { status: 201 }
    );
  }),

  http.put('/api/appointments/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    return HttpResponse.json(
      createMockApiResponse(createMockAppointment({ ...body, id: params.id as string }))
    );
  }),

  http.delete('/api/appointments/:id', () => {
    return HttpResponse.json(
      createMockApiResponse({ message: 'Appointment cancelled' })
    );
  }),

  // ============================================================
  // INCIDENT REPORTS
  // ============================================================
  http.get('/api/incidents', () => {
    return HttpResponse.json(
      createMockApiResponse({
        incidents: createMockList(createMockIncidentReport, 20),
      })
    );
  }),

  http.get('/api/incidents/:id', ({ params }) => {
    return HttpResponse.json(
      createMockApiResponse(createMockIncidentReport({ id: params.id as string }))
    );
  }),

  http.post('/api/incidents', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json(
      createMockApiResponse(createMockIncidentReport(body)),
      { status: 201 }
    );
  }),

  http.put('/api/incidents/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    return HttpResponse.json(
      createMockApiResponse(createMockIncidentReport({ ...body, id: params.id as string }))
    );
  }),

  // ============================================================
  // DASHBOARD
  // ============================================================
  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json(
      createMockApiResponse({
        totalStudents: 500,
        activeIncidents: 12,
        upcomingAppointments: 25,
        medicationsDue: 8,
        recentAlerts: 3,
      })
    );
  }),

  // ============================================================
  // ERROR SIMULATION
  // ============================================================
  http.get('/api/error/500', () => {
    return HttpResponse.json(
      createMockApiError({ message: 'Internal server error' }),
      { status: 500 }
    );
  }),

  http.get('/api/error/404', () => {
    return HttpResponse.json(
      createMockApiError({ message: 'Not found' }),
      { status: 404 }
    );
  }),

  http.get('/api/error/403', () => {
    return HttpResponse.json(
      createMockApiError({ message: 'Forbidden' }),
      { status: 403 }
    );
  }),
];
