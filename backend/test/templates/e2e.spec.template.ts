/**
 * E2E TEST TEMPLATE
 *
 * Use this template for creating end-to-end API tests.
 * E2E tests test the complete HTTP request/response cycle.
 *
 * Replace [ModuleName] with your actual module name.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { [ModuleName]Module } from '../../src/[module-name]/[module-name].module';
import { DatabaseModule } from '../../src/database/database.module';
import { AuthTestHelper } from '../helpers/auth-test.helper';
import { DatabaseTestHelper } from '../helpers/database.helper';

describe('[ModuleName] API (E2E)', () => {
  let app: INestApplication;
  let authToken: string;
  let adminToken: string;

  // ==================== SETUP & TEARDOWN ====================

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        [ModuleName]Module,
        // Configure test database
        DatabaseModule.forTest(),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    // Get authentication tokens
    const { token } = await AuthTestHelper.registerAndLogin(app, {
      email: 'test@whitecross.edu',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'NURSE',
    });
    authToken = token;

    const { token: adminTokenValue } = await AuthTestHelper.registerAndLogin(app, {
      email: 'admin@whitecross.edu',
      password: 'AdminPassword123!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    });
    adminToken = adminTokenValue;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear test data before each test
    await DatabaseTestHelper.clearAllTables();
  });

  // ==================== CREATE ENDPOINT TESTS ====================

  describe('POST /[resource] (create)', () => {
    const createDto = {
      // Add creation data
    };

    it('should create resource and return 201', () => {
      return request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toMatchObject(createDto);
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidDto = { /* missing required fields */ };

      return request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.statusCode).toBe(400);
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .post('/[resource]')
        .send(createDto)
        .expect(401);
    });

    it('should return 409 for duplicate resource', async () => {
      // Create first resource
      await request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      // Try to create duplicate
      return request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(409);
    });

    it('should enforce role-based authorization', () => {
      // Test with insufficient role
      const viewerToken = AuthTestHelper.generateViewerToken();

      return request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send(createDto)
        .expect(403);
    });

    it('should validate content-type header', () => {
      return request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'text/plain')
        .send('invalid data')
        .expect(415); // Unsupported Media Type
    });
  });

  // ==================== READ ENDPOINT TESTS ====================

  describe('GET /[resource] (findAll)', () => {
    beforeEach(async () => {
      // Seed test data
      await request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* resource 1 */ })
        .expect(201);

      await request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* resource 2 */ })
        .expect(201);
    });

    it('should return paginated list with 200', () => {
      return request(app.getHttpServer())
        .get('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body).toHaveProperty('pagination');
          expect(res.body.pagination).toHaveProperty('total');
          expect(res.body.pagination).toHaveProperty('page');
          expect(res.body.pagination).toHaveProperty('limit');
        });
    });

    it('should support pagination parameters', () => {
      return request(app.getHttpServer())
        .get('/[resource]?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.pagination.page).toBe(1);
          expect(res.body.pagination.limit).toBe(10);
        });
    });

    it('should support search filter', () => {
      return request(app.getHttpServer())
        .get('/[resource]?search=test')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should support sorting', () => {
      return request(app.getHttpServer())
        .get('/[resource]?sort=createdAt&order=DESC')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          const items = res.body.data;
          if (items.length > 1) {
            expect(
              new Date(items[0].createdAt) >= new Date(items[1].createdAt)
            ).toBe(true);
          }
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .get('/[resource]')
        .expect(401);
    });

    it('should enforce multi-tenant isolation', async () => {
      // Create resource for School A
      const schoolAToken = AuthTestHelper.generateNurseToken({
        schoolId: 'school-a',
      });
      await request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${schoolAToken}`)
        .send({ /* resource for school A */ })
        .expect(201);

      // User from School B should not see School A data
      const schoolBToken = AuthTestHelper.generateNurseToken({
        schoolId: 'school-b',
      });
      return request(app.getHttpServer())
        .get('/[resource]')
        .set('Authorization', `Bearer ${schoolBToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(0);
        });
    });
  });

  describe('GET /[resource]/:id (findById)', () => {
    let resourceId: string;

    beforeEach(async () => {
      // Create test resource
      const response = await request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* test resource */ })
        .expect(201);

      resourceId = response.body.id;
    });

    it('should return resource by ID with 200', () => {
      return request(app.getHttpServer())
        .get(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(resourceId);
        });
    });

    it('should return 404 for non-existent resource', () => {
      return request(app.getHttpServer())
        .get('/[resource]/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.statusCode).toBe(404);
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .get(`/[resource]/${resourceId}`)
        .expect(401);
    });

    it('should enforce resource ownership', () => {
      // Try to access resource with different user
      const otherUserToken = AuthTestHelper.generateNurseToken({
        sub: 'other-user-id',
      });

      return request(app.getHttpServer())
        .get(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(403);
    });
  });

  // ==================== UPDATE ENDPOINT TESTS ====================

  describe('PATCH /[resource]/:id (update)', () => {
    let resourceId: string;

    beforeEach(async () => {
      // Create test resource
      const response = await request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* test resource */ })
        .expect(201);

      resourceId = response.body.id;
    });

    it('should update resource and return 200', () => {
      const updateDto = {
        // Add update data
      };

      return request(app.getHttpServer())
        .patch(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(resourceId);
          expect(res.body).toMatchObject(updateDto);
        });
    });

    it('should return 400 for invalid update data', () => {
      const invalidDto = { /* invalid data */ };

      return request(app.getHttpServer())
        .patch(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });

    it('should return 404 for non-existent resource', () => {
      return request(app.getHttpServer())
        .patch('/[resource]/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* update data */ })
        .expect(404);
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .patch(`/[resource]/${resourceId}`)
        .send({ /* update data */ })
        .expect(401);
    });

    it('should prevent updating immutable fields', () => {
      const invalidUpdate = {
        id: 'new-id',
        createdAt: new Date(),
      };

      return request(app.getHttpServer())
        .patch(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidUpdate)
        .expect(400);
    });
  });

  // ==================== DELETE ENDPOINT TESTS ====================

  describe('DELETE /[resource]/:id (delete)', () => {
    let resourceId: string;

    beforeEach(async () => {
      // Create test resource
      const response = await request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* test resource */ })
        .expect(201);

      resourceId = response.body.id;
    });

    it('should delete resource and return 204', () => {
      return request(app.getHttpServer())
        .delete(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('should return 404 for non-existent resource', () => {
      return request(app.getHttpServer())
        .delete('/[resource]/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .delete(`/[resource]/${resourceId}`)
        .expect(401);
    });

    it('should enforce authorization for deletion', () => {
      const viewerToken = AuthTestHelper.generateViewerToken();

      return request(app.getHttpServer())
        .delete(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${viewerToken}`)
        .expect(403);
    });

    it('should verify resource is actually deleted', async () => {
      // Delete resource
      await request(app.getHttpServer())
        .delete(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify it's gone
      return request(app.getHttpServer())
        .get(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  // ==================== WORKFLOW TESTS ====================

  describe('Complete Workflow', () => {
    it('should complete full CRUD cycle', async () => {
      // Create
      const createResponse = await request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* create data */ })
        .expect(201);

      const resourceId = createResponse.body.id;

      // Read
      await request(app.getHttpServer())
        .get(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Update
      await request(app.getHttpServer())
        .patch(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* update data */ })
        .expect(200);

      // Delete
      await request(app.getHttpServer())
        .delete(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/[resource]/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  // ==================== SECURITY TESTS ====================

  describe('Security', () => {
    it('should prevent XSS attacks', () => {
      const xssPayload = {
        name: '<script>alert("XSS")</script>',
      };

      return request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send(xssPayload)
        .expect(400); // Should be sanitized or rejected
    });

    it('should prevent SQL injection', () => {
      return request(app.getHttpServer())
        .get("/[resource]?search='; DROP TABLE users; --")
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200); // Should not crash, should sanitize input
    });

    it('should enforce rate limiting', async () => {
      // Make many requests quickly
      const requests = Array(100).fill(null).map(() =>
        request(app.getHttpServer())
          .get('/[resource]')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(requests);
      const rateLimited = responses.some(res => res.status === 429);

      expect(rateLimited).toBe(true);
    });

    it('should validate CSRF token', () => {
      // Test CSRF protection
    });
  });

  // ==================== PERFORMANCE TESTS ====================

  describe('Performance', () => {
    it('should respond within acceptable time', async () => {
      const startTime = Date.now();

      await request(app.getHttpServer())
        .get('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const responseTime = Date.now() - startTime;

      // Should respond within 2 seconds
      expect(responseTime).toBeLessThan(2000);
    });

    it('should handle large result sets efficiently', async () => {
      // Create many resources
      const createPromises = Array(100).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/[resource]')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ /* resource data */ })
      );

      await Promise.all(createPromises);

      // Fetch all with pagination
      const response = await request(app.getHttpServer())
        .get('/[resource]?limit=100')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(100);
    });
  });

  // ==================== HIPAA COMPLIANCE TESTS (if applicable) ====================

  describe('HIPAA Compliance', () => {
    it('should log all PHI access', async () => {
      // Create and access PHI resource
      const response = await request(app.getHttpServer())
        .post('/[resource]')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* PHI data */ })
        .expect(201);

      // Verify audit log entry exists
      // (Implementation depends on your audit logging system)
    });

    it('should encrypt sensitive data', async () => {
      // Verify sensitive data is encrypted at rest
      // (Implementation depends on your encryption strategy)
    });

    it('should enforce minimum necessary access', () => {
      // Verify users can only access data they need
    });
  });
});
