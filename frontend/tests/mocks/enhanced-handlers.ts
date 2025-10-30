import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:3001';

/**
 * Comprehensive MSW handlers for all healthcare domains
 * Covers: Auth, Students, Medications, Appointments, Health Records,
 * Incidents, Emergency Contacts, Clinic Visits, Communications,
 * Audit Logs, Analytics, Documents, Immunizations, Allergies,
 * Vital Signs, Compliance, Administration, and Inventory
 */
export const enhancedHandlers = [
  // ==================== AUTH ENDPOINTS ====================
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as any;
    const { email, password } = body;

    if (email === 'test@example.com' && password === 'password123') {
      return HttpResponse.json({
        success: true,
        data: {
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'nurse',
            permissions: ['read:students', 'write:medications', 'read:health-records'],
          },
        },
      });
    }

    if (email === 'admin@example.com' && password === 'admin123') {
      return HttpResponse.json({
        success: true,
        data: {
          token: 'mock-admin-jwt-token',
          refreshToken: 'mock-admin-refresh-token',
          user: {
            id: '2',
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            permissions: ['*'],
          },
        },
      });
    }

    return HttpResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post(`${API_URL}/auth/refresh`, async ({ request }) => {
    const body = await request.json() as any;

    if (body.refreshToken === 'mock-refresh-token') {
      return HttpResponse.json({
        success: true,
        data: {
          token: 'new-mock-jwt-token',
          refreshToken: 'new-mock-refresh-token',
        },
      });
    }

    return HttpResponse.json(
      { success: false, error: 'Invalid refresh token' },
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
        permissions: ['read:students', 'write:medications', 'read:health-records'],
      },
    });
  }),

  // ==================== STUDENTS ENDPOINTS ====================
  http.get(`${API_URL}/students`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search');
    const grade = url.searchParams.get('grade');
    const status = url.searchParams.get('status');

    let students = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2010-05-15',
        grade: '8',
        status: 'active',
        schoolId: 'school-1',
        studentId: 'STU001',
        gender: 'male',
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '2011-08-22',
        grade: '7',
        status: 'active',
        schoolId: 'school-1',
        studentId: 'STU002',
        gender: 'female',
      },
    ];

    // Apply filters
    if (search) {
      students = students.filter(s =>
        s.firstName.toLowerCase().includes(search.toLowerCase()) ||
        s.lastName.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.includes(search)
      );
    }
    if (grade) {
      students = students.filter(s => s.grade === grade);
    }
    if (status) {
      students = students.filter(s => s.status === status);
    }

    return HttpResponse.json({
      success: true,
      data: {
        students,
        pagination: {
          page,
          limit,
          total: students.length,
          totalPages: Math.ceil(students.length / limit),
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
        studentId: 'STU001',
        gender: 'male',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: '62701',
        emergencyContacts: [],
        healthRecords: [],
        allergies: [],
        medications: [],
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
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  http.put(`${API_URL}/students/:id`, async ({ params, request }) => {
    const body = await request.json() as any;

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  http.delete(`${API_URL}/students/:id`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { id: params.id, deleted: true },
    });
  }),

  // ==================== MEDICATIONS ENDPOINTS ====================
  http.get(`${API_URL}/medications`, ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    return HttpResponse.json({
      success: true,
      data: {
        medications: [
          {
            id: '1',
            studentId: studentId || '1',
            name: 'Ibuprofen',
            dosage: '200mg',
            frequency: 'As needed',
            route: 'Oral',
            status: 'active',
            prescribedBy: 'Dr. Smith',
            prescribedDate: '2024-01-01',
            expirationDate: '2025-01-01',
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/medications`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-medication-id',
          ...body,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
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
        witnessedBy: 'Witness User',
      },
    });
  }),

  http.get(`${API_URL}/medications/:id/history`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        history: [
          {
            id: '1',
            medicationId: params.id,
            administeredAt: new Date().toISOString(),
            dosage: '200mg',
            administeredBy: 'Test User',
            witnessedBy: 'Witness User',
          },
        ],
      },
    });
  }),

  // ==================== APPOINTMENTS ENDPOINTS ====================
  http.get(`${API_URL}/appointments`, ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const status = url.searchParams.get('status');

    return HttpResponse.json({
      success: true,
      data: {
        appointments: [
          {
            id: '1',
            studentId: '1',
            type: 'checkup',
            scheduledAt: new Date().toISOString(),
            duration: 30,
            status: status || 'scheduled',
            nurseId: '1',
            notes: 'Annual checkup',
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/appointments`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-appointment-id',
          ...body,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  http.patch(`${API_URL}/appointments/:id`, async ({ params, request }) => {
    const body = await request.json() as any;

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // ==================== HEALTH RECORDS ENDPOINTS ====================
  http.get(`${API_URL}/health-records`, ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    return HttpResponse.json({
      success: true,
      data: {
        records: [
          {
            id: '1',
            studentId: studentId || '1',
            type: 'vaccination',
            date: '2024-01-15',
            provider: 'Dr. Johnson',
            notes: 'Annual flu shot',
            attachments: [],
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/health-records`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-health-record-id',
          ...body,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  // ==================== INCIDENTS ENDPOINTS ====================
  http.get(`${API_URL}/incidents`, ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    return HttpResponse.json({
      success: true,
      data: {
        incidents: [
          {
            id: '1',
            studentId: studentId || '1',
            type: 'injury',
            severity: 'minor',
            date: new Date().toISOString(),
            location: 'Playground',
            description: 'Scraped knee on playground',
            treatmentProvided: 'Cleaned and bandaged',
            reportedBy: '1',
            parentNotified: true,
            status: 'resolved',
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/incidents`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-incident-id',
          ...body,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  // ==================== EMERGENCY CONTACTS ENDPOINTS ====================
  http.get(`${API_URL}/emergency-contacts`, ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    return HttpResponse.json({
      success: true,
      data: {
        contacts: [
          {
            id: '1',
            studentId: studentId || '1',
            name: 'Jane Doe',
            relationship: 'Mother',
            phone: '555-1234',
            alternatePhone: '555-5678',
            email: 'jane.doe@example.com',
            isPrimary: true,
            canPickup: true,
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/emergency-contacts`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-contact-id',
          ...body,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  // ==================== CLINIC VISITS ENDPOINTS ====================
  http.get(`${API_URL}/clinic-visits`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const date = url.searchParams.get('date');

    return HttpResponse.json({
      success: true,
      data: {
        visits: [
          {
            id: '1',
            studentId: '1',
            checkInTime: new Date().toISOString(),
            checkOutTime: status === 'completed' ? new Date().toISOString() : null,
            reason: 'Headache',
            status: status || 'in-progress',
            nurseId: '1',
            vitalSigns: {},
            treatment: 'Rest and water',
            notes: 'Student feeling better',
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/clinic-visits`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-visit-id',
          ...body,
          checkInTime: new Date().toISOString(),
          status: 'in-progress',
        },
      },
      { status: 201 }
    );
  }),

  http.patch(`${API_URL}/clinic-visits/:id/checkout`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        checkOutTime: new Date().toISOString(),
        status: 'completed',
      },
    });
  }),

  // ==================== COMMUNICATIONS ENDPOINTS ====================
  http.get(`${API_URL}/communications/messages`, ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    return HttpResponse.json({
      success: true,
      data: {
        messages: [
          {
            id: '1',
            subject: 'Test Message',
            body: 'Message content',
            from: 'test@example.com',
            to: ['parent@example.com'],
            type: type || 'email',
            sentAt: new Date().toISOString(),
            status: 'sent',
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/communications/messages`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-message-id',
          ...body,
          sentAt: new Date().toISOString(),
          status: 'sent',
        },
      },
      { status: 201 }
    );
  }),

  http.post(`${API_URL}/communications/announcements`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-announcement-id',
          ...body,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  // ==================== AUDIT LOGS ENDPOINTS ====================
  http.get(`${API_URL}/audit-logs`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const action = url.searchParams.get('action');
    const resource = url.searchParams.get('resource');

    return HttpResponse.json({
      success: true,
      data: {
        logs: [
          {
            id: '1',
            action: action || 'READ',
            resource: resource || 'student',
            resourceId: '1',
            userId: '1',
            userName: 'Test User',
            timestamp: new Date().toISOString(),
            ipAddress: '127.0.0.1',
            userAgent: 'Test Browser',
            details: { fields: ['firstName', 'lastName'] },
          },
        ],
        pagination: {
          page,
          limit,
          total: 1,
          totalPages: 1,
        },
      },
    });
  }),

  http.post(`${API_URL}/audit-logs/export`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json({
      success: true,
      data: {
        exportId: 'export-id',
        status: 'processing',
        downloadUrl: '/downloads/audit-logs-export.csv',
      },
    });
  }),

  // ==================== ANALYTICS ENDPOINTS ====================
  http.get(`${API_URL}/analytics/dashboard`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalStudents: 450,
        activeStudents: 445,
        todayVisits: 12,
        pendingAppointments: 5,
        medicationsDue: 3,
        recentIncidents: 1,
        trends: {
          visitsThisWeek: [2, 3, 5, 4, 6, 8, 12],
          commonConditions: [
            { name: 'Headache', count: 15 },
            { name: 'Stomach ache', count: 12 },
            { name: 'Minor injury', count: 8 },
          ],
        },
      },
    });
  }),

  http.get(`${API_URL}/analytics/reports/:type`, ({ params, request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    return HttpResponse.json({
      success: true,
      data: {
        reportType: params.type,
        generatedAt: new Date().toISOString(),
        startDate,
        endDate,
        data: [],
      },
    });
  }),

  // ==================== DOCUMENTS ENDPOINTS ====================
  http.get(`${API_URL}/documents`, ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    const category = url.searchParams.get('category');

    return HttpResponse.json({
      success: true,
      data: {
        documents: [
          {
            id: '1',
            name: 'Medical Release Form',
            type: 'pdf',
            size: 1024000,
            studentId: studentId || '1',
            uploadedBy: '1',
            uploadedAt: new Date().toISOString(),
            category: category || 'medical',
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/documents/upload`, async ({ request }) => {
    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-document-id',
          name: 'uploaded-file.pdf',
          uploadedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  http.get(`${API_URL}/documents/:id/download`, ({ params }) => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    });
  }),

  // ==================== IMMUNIZATIONS ENDPOINTS ====================
  http.get(`${API_URL}/immunizations`, ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    return HttpResponse.json({
      success: true,
      data: {
        immunizations: [
          {
            id: '1',
            studentId: studentId || '1',
            vaccine: 'MMR',
            dose: '1',
            administeredDate: '2024-01-15',
            administeredBy: 'Dr. Smith',
            lotNumber: 'LOT12345',
            expirationDate: '2025-01-15',
            site: 'Left arm',
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/immunizations`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-immunization-id',
          ...body,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  // ==================== ALLERGIES ENDPOINTS ====================
  http.get(`${API_URL}/allergies`, ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    return HttpResponse.json({
      success: true,
      data: {
        allergies: [
          {
            id: '1',
            studentId: studentId || '1',
            allergen: 'Peanuts',
            severity: 'severe',
            reaction: 'Anaphylaxis',
            diagnosedDate: '2020-05-10',
            diagnosedBy: 'Dr. Johnson',
            treatment: 'EpiPen',
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/allergies`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-allergy-id',
          ...body,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  // ==================== VITAL SIGNS ENDPOINTS ====================
  http.get(`${API_URL}/vital-signs`, ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    return HttpResponse.json({
      success: true,
      data: {
        vitalSigns: [
          {
            id: '1',
            studentId: studentId || '1',
            temperature: 98.6,
            bloodPressureSystolic: 120,
            bloodPressureDiastolic: 80,
            heartRate: 72,
            respiratoryRate: 16,
            oxygenSaturation: 98,
            weight: 120.5,
            height: 65.0,
            measuredAt: new Date().toISOString(),
            measuredBy: '1',
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/vital-signs`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-vital-signs-id',
          ...body,
          measuredAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  // ==================== COMPLIANCE ENDPOINTS ====================
  http.get(`${API_URL}/compliance/reports`, ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    return HttpResponse.json({
      success: true,
      data: {
        reports: [
          {
            id: '1',
            type: type || 'hipaa',
            status: 'compliant',
            lastAuditDate: '2024-01-01',
            findings: [],
            recommendations: [],
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/compliance/reports/generate`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-compliance-report-id',
          ...body,
          generatedAt: new Date().toISOString(),
          status: 'processing',
        },
      },
      { status: 201 }
    );
  }),

  // ==================== ADMINISTRATION ENDPOINTS ====================
  http.get(`${API_URL}/admin/schools`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        schools: [
          {
            id: 'school-1',
            name: 'Lincoln Elementary',
            districtId: 'district-1',
            address: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
            phone: '555-0100',
            status: 'active',
            studentCount: 450,
          },
        ],
      },
    });
  }),

  http.get(`${API_URL}/admin/districts`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        districts: [
          {
            id: 'district-1',
            name: 'Springfield School District',
            superintendent: 'Jane Smith',
            phone: '555-0200',
            email: 'superintendent@district.edu',
            status: 'active',
            schoolCount: 5,
          },
        ],
      },
    });
  }),

  http.get(`${API_URL}/admin/users`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        users: [
          {
            id: '1',
            email: 'nurse@example.com',
            firstName: 'Alice',
            lastName: 'Johnson',
            role: 'nurse',
            status: 'active',
            schoolId: 'school-1',
          },
        ],
      },
    });
  }),

  http.post(`${API_URL}/admin/users`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'new-user-id',
          ...body,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  // ==================== INVENTORY ENDPOINTS ====================
  http.get(`${API_URL}/inventory`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const lowStock = url.searchParams.get('lowStock');

    return HttpResponse.json({
      success: true,
      data: {
        items: [
          {
            id: '1',
            name: 'Band-Aids',
            category: category || 'Supplies',
            quantity: lowStock === 'true' ? 10 : 250,
            reorderLevel: 50,
            location: 'Main Office',
            expirationDate: '2025-12-31',
          },
        ],
      },
    });
  }),

  http.patch(`${API_URL}/inventory/:id`, async ({ params, request }) => {
    const body = await request.json() as any;

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  http.post(`${API_URL}/inventory/:id/reorder`, async ({ params, request }) => {
    const body = await request.json() as any;

    return HttpResponse.json({
      success: true,
      data: {
        orderId: 'new-order-id',
        itemId: params.id,
        quantity: body.quantity,
        status: 'pending',
        orderedAt: new Date().toISOString(),
      },
    });
  }),
];
