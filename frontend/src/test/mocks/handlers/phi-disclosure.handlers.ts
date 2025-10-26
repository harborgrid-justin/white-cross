/**
 * MSW Handlers for PHI Disclosure API
 * Mock API responses for testing PHI disclosure tracking
 */

import { http, HttpResponse } from 'msw';
import { phiDisclosureFixtures } from '@/test/fixtures/phi-disclosure.fixtures';

const BASE_URL = 'http://localhost:3000/api';

export const phiDisclosureHandlers = [
  /**
   * Create PHI disclosure
   * POST /api/phi-disclosures
   */
  http.post(`${BASE_URL}/phi-disclosures`, async ({ request }) => {
    const body: any = await request.json();

    // Validate required fields
    if (!body.studentId || !body.disclosedTo || !body.purpose || !body.informationDisclosed) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: 'Validation error: Missing required fields',
            code: 'VALIDATION_ERROR',
          },
        },
        { status: 400 }
      );
    }

    // Validate authorization method requirements
    if (body.authorizationMethod === 'WRITTEN_CONSENT' && !body.authorizationDocument) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: 'Authorization document required for written consent',
            code: 'VALIDATION_ERROR',
          },
        },
        { status: 400 }
      );
    }

    // Create disclosure
    const disclosure = {
      id: `disclosure-${Date.now()}`,
      ...body,
      disclosedBy: body.disclosedBy || 'nurse-789',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simulate audit log creation
    console.log('[AUDIT] PHI_DISCLOSURE_CREATED', {
      resourceId: disclosure.id,
      studentId: disclosure.studentId,
    });

    return HttpResponse.json({
      success: true,
      data: {
        disclosure,
      },
    });
  }),

  /**
   * Get disclosures by student
   * GET /api/phi-disclosures/student/:studentId
   */
  http.get(`${BASE_URL}/phi-disclosures/student/:studentId`, ({ params, request }) => {
    const { studentId } = params;
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    let disclosures = phiDisclosureFixtures.multipleDisclosures(5);

    // Filter by date range if provided
    if (startDate || endDate) {
      disclosures = disclosures.filter(d => {
        const disclosureDate = new Date(d.disclosureDate);
        if (startDate && disclosureDate < new Date(startDate)) return false;
        if (endDate && disclosureDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Simulate audit log
    console.log('[AUDIT] PHI_DISCLOSURE_LIST_ACCESSED', {
      studentId,
      count: disclosures.length,
    });

    return HttpResponse.json({
      success: true,
      data: {
        disclosures,
        total: disclosures.length,
      },
    });
  }),

  /**
   * Get single disclosure
   * GET /api/phi-disclosures/:id
   */
  http.get(`${BASE_URL}/phi-disclosures/:id`, ({ params }) => {
    const { id } = params;

    const disclosure = {
      ...phiDisclosureFixtures.validDisclosure,
      id: id as string,
    };

    // Simulate audit log
    console.log('[AUDIT] PHI_DISCLOSURE_VIEWED', {
      resourceId: id,
      studentId: disclosure.studentId,
    });

    return HttpResponse.json({
      success: true,
      data: {
        disclosure,
      },
    });
  }),

  /**
   * Update disclosure
   * PUT /api/phi-disclosures/:id
   */
  http.put(`${BASE_URL}/phi-disclosures/:id`, async ({ params, request }) => {
    const { id } = params;
    const body: any = await request.json();

    const disclosure = {
      ...phiDisclosureFixtures.validDisclosure,
      id: id as string,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Simulate audit log
    console.log('[AUDIT] PHI_DISCLOSURE_UPDATED', {
      resourceId: id,
      studentId: disclosure.studentId,
    });

    return HttpResponse.json({
      success: true,
      data: {
        disclosure,
      },
    });
  }),

  /**
   * Delete disclosure
   * DELETE /api/phi-disclosures/:id
   */
  http.delete(`${BASE_URL}/phi-disclosures/:id`, ({ params }) => {
    const { id } = params;

    // Simulate audit log
    console.log('[AUDIT] PHI_DISCLOSURE_DELETED', {
      resourceId: id,
    });

    return HttpResponse.json({
      success: true,
      data: {
        message: 'Disclosure deleted successfully',
      },
    });
  }),

  /**
   * Generate disclosure report
   * GET /api/phi-disclosures/report
   */
  http.get(`${BASE_URL}/phi-disclosures/report`, ({ request }) => {
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'PDF';
    const studentId = url.searchParams.get('studentId');

    const report = {
      ...phiDisclosureFixtures.reportData,
      reportUrl: `https://reports.example.com/disclosure-report-${Date.now()}.${format.toLowerCase()}`,
      studentId,
    };

    // Simulate audit log
    console.log('[AUDIT] PHI_DISCLOSURE_REPORT_GENERATED', {
      studentId,
      format,
    });

    return HttpResponse.json({
      success: true,
      data: report,
    });
  }),

  /**
   * Get disclosure statistics
   * GET /api/phi-disclosures/statistics
   */
  http.get(`${BASE_URL}/phi-disclosures/statistics`, () => {
    const stats = {
      totalDisclosures: 142,
      thisMonth: 23,
      thisYear: 142,
      byPurpose: {
        Treatment: 85,
        'Care Coordination': 32,
        Legal: 15,
        Research: 10,
      },
      byAuthorizationMethod: {
        WRITTEN_CONSENT: 98,
        VERBAL_CONSENT: 28,
        EMERGENCY: 12,
        COURT_ORDER: 4,
      },
      averagePerMonth: 11.8,
    };

    return HttpResponse.json({
      success: true,
      data: stats,
    });
  }),

  /**
   * Error simulation handlers
   */
  http.post(`${BASE_URL}/phi-disclosures/error/network`, () => {
    return HttpResponse.error();
  }),

  http.post(`${BASE_URL}/phi-disclosures/error/unauthorized`, () => {
    return HttpResponse.json(
      {
        success: false,
        error: {
          message: 'Unauthorized: Insufficient permissions',
          code: 'UNAUTHORIZED',
        },
      },
      { status: 403 }
    );
  }),

  http.post(`${BASE_URL}/phi-disclosures/error/server`, () => {
    return HttpResponse.json(
      {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'SERVER_ERROR',
        },
      },
      { status: 500 }
    );
  }),
];
