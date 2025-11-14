/**
 * DASHBOARD E2E TESTS
 *
 * End-to-end tests for Dashboard API endpoints.
 * Tests the complete request/response cycle with real HTTP calls.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DashboardModule } from '../src/services/dashboard/dashboard.module';
import { DatabaseModule } from '../src/database/database.module';

describe('Dashboard API (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        DashboardModule,
        // DatabaseModule would be configured with test database
        // For now, mocking at the service level
      ],
    })
      .overrideProvider('SEQUELIZE_CONNECTION')
      .useValue({
        models: {
          Student: { count: jest.fn().mockResolvedValue(100), findAll: jest.fn().mockResolvedValue([]) },
          StudentMedication: { count: jest.fn().mockResolvedValue(20) },
          Appointment: { count: jest.fn().mockResolvedValue(5), findAll: jest.fn().mockResolvedValue([]) },
          IncidentReport: { count: jest.fn().mockResolvedValue(2), findAll: jest.fn().mockResolvedValue([]) },
          MedicationLog: { count: jest.fn().mockResolvedValue(10), findAll: jest.fn().mockResolvedValue([]) },
          Allergy: { findAll: jest.fn().mockResolvedValue([]) },
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ==================== GET /dashboard/stats ====================

  describe('GET /dashboard/stats', () => {
    it('should return 200 with dashboard statistics', () => {
      return request(app.getHttpServer())
        .get('/dashboard/stats')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalStudents');
          expect(res.body).toHaveProperty('activeMedications');
          expect(res.body).toHaveProperty('todaysAppointments');
          expect(res.body).toHaveProperty('pendingIncidents');
          expect(res.body).toHaveProperty('medicationsDueToday');
          expect(res.body).toHaveProperty('healthAlerts');
          expect(res.body).toHaveProperty('recentActivityCount');
          expect(res.body).toHaveProperty('studentTrend');
          expect(res.body).toHaveProperty('medicationTrend');
          expect(res.body).toHaveProperty('appointmentTrend');
        });
    });

    it('should return numbers for all count fields', () => {
      return request(app.getHttpServer())
        .get('/dashboard/stats')
        .expect(200)
        .expect((res) => {
          expect(typeof res.body.totalStudents).toBe('number');
          expect(typeof res.body.activeMedications).toBe('number');
          expect(typeof res.body.todaysAppointments).toBe('number');
          expect(typeof res.body.pendingIncidents).toBe('number');
        });
    });

    it('should return trend objects with required properties', () => {
      return request(app.getHttpServer())
        .get('/dashboard/stats')
        .expect(200)
        .expect((res) => {
          expect(res.body.studentTrend).toHaveProperty('value');
          expect(res.body.studentTrend).toHaveProperty('change');
          expect(res.body.studentTrend).toHaveProperty('changeType');
          expect(['positive', 'negative', 'neutral']).toContain(
            res.body.studentTrend.changeType,
          );
        });
    });
  });

  // ==================== GET /dashboard/recent-activities ====================

  describe('GET /dashboard/recent-activities', () => {
    it('should return 200 with recent activities array', () => {
      return request(app.getHttpServer())
        .get('/dashboard/recent-activities')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should accept limit query parameter', () => {
      return request(app.getHttpServer())
        .get('/dashboard/recent-activities?limit=10')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeLessThanOrEqual(10);
        });
    });

    it('should validate limit parameter is a number', () => {
      return request(app.getHttpServer())
        .get('/dashboard/recent-activities?limit=invalid')
        .expect(400);
    });

    it('should use default limit when not provided', () => {
      return request(app.getHttpServer())
        .get('/dashboard/recent-activities')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  // ==================== GET /dashboard/upcoming-appointments ====================

  describe('GET /dashboard/upcoming-appointments', () => {
    it('should return 200 with appointments array', () => {
      return request(app.getHttpServer())
        .get('/dashboard/upcoming-appointments')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should accept limit query parameter', () => {
      return request(app.getHttpServer())
        .get('/dashboard/upcoming-appointments?limit=15')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should validate limit parameter type', () => {
      return request(app.getHttpServer())
        .get('/dashboard/upcoming-appointments?limit=abc')
        .expect(400);
    });
  });

  // ==================== GET /dashboard/chart-data ====================

  describe('GET /dashboard/chart-data', () => {
    it('should return 200 with chart data object', () => {
      return request(app.getHttpServer())
        .get('/dashboard/chart-data')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('enrollmentTrend');
          expect(res.body).toHaveProperty('medicationAdministration');
          expect(res.body).toHaveProperty('incidentFrequency');
          expect(res.body).toHaveProperty('appointmentTrends');
        });
    });

    it('should accept week period parameter', () => {
      return request(app.getHttpServer())
        .get('/dashboard/chart-data?period=week')
        .expect(200);
    });

    it('should accept month period parameter', () => {
      return request(app.getHttpServer())
        .get('/dashboard/chart-data?period=month')
        .expect(200);
    });

    it('should accept year period parameter', () => {
      return request(app.getHttpServer())
        .get('/dashboard/chart-data?period=year')
        .expect(200);
    });

    it('should reject invalid period parameter', () => {
      return request(app.getHttpServer())
        .get('/dashboard/chart-data?period=invalid')
        .expect(400);
    });

    it('should return arrays for all chart data', () => {
      return request(app.getHttpServer())
        .get('/dashboard/chart-data')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.enrollmentTrend)).toBe(true);
          expect(Array.isArray(res.body.medicationAdministration)).toBe(true);
          expect(Array.isArray(res.body.incidentFrequency)).toBe(true);
          expect(Array.isArray(res.body.appointmentTrends)).toBe(true);
        });
    });
  });

  // ==================== GET /dashboard/stats-by-scope ====================

  describe('GET /dashboard/stats-by-scope', () => {
    it('should return 200 with scoped stats', () => {
      return request(app.getHttpServer())
        .get('/dashboard/stats-by-scope')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalStudents');
          expect(res.body).toHaveProperty('activeMedications');
        });
    });

    it('should accept schoolId query parameter', () => {
      return request(app.getHttpServer())
        .get('/dashboard/stats-by-scope?schoolId=school-123')
        .expect(200);
    });

    it('should accept districtId query parameter', () => {
      return request(app.getHttpServer())
        .get('/dashboard/stats-by-scope?districtId=district-456')
        .expect(200);
    });

    it('should accept both schoolId and districtId', () => {
      return request(app.getHttpServer())
        .get('/dashboard/stats-by-scope?schoolId=school-123&districtId=district-456')
        .expect(200);
    });
  });

  // ==================== DELETE /dashboard/cache ====================

  describe('DELETE /dashboard/cache', () => {
    it('should return 204 when cache cleared', () => {
      return request(app.getHttpServer())
        .delete('/dashboard/cache')
        .expect(204);
    });

    it('should not return response body', () => {
      return request(app.getHttpServer())
        .delete('/dashboard/cache')
        .expect(204)
        .expect((res) => {
          expect(res.body).toEqual({});
        });
    });
  });

  // ==================== API DOCUMENTATION TESTS ====================

  describe('API Documentation', () => {
    it('should have proper content-type headers', () => {
      return request(app.getHttpServer())
        .get('/dashboard/stats')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  // ==================== PERFORMANCE TESTS ====================

  describe('Performance', () => {
    it('should respond to stats request within acceptable time', async () => {
      const startTime = Date.now();

      await request(app.getHttpServer())
        .get('/dashboard/stats')
        .expect(200);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Should respond within 2 seconds
      expect(responseTime).toBeLessThan(2000);
    });
  });

  // ==================== ERROR HANDLING TESTS ====================

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', () => {
      return request(app.getHttpServer())
        .get('/dashboard/nonexistent')
        .expect(404);
    });

    it('should handle invalid HTTP methods', () => {
      return request(app.getHttpServer())
        .post('/dashboard/stats')
        .expect(404);
    });
  });
});
